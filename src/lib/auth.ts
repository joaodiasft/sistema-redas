const DEV_FALLBACK =
  "dev-auth-secret-change-in-production-min-32-chars";

function getAuthSecretKey(): Uint8Array {
  const raw = process.env.AUTH_SECRET?.trim();
  if (raw && raw.length >= 16) {
    return new TextEncoder().encode(raw);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET é obrigatório em produção (mín. 16 caracteres).");
  }
  return new TextEncoder().encode(DEV_FALLBACK);
}

function base64UrlEncodeBytes(data: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < data.length; i++) bin += String.fromCharCode(data[i]!);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeJson(obj: object): string {
  const json = JSON.stringify(obj);
  return base64UrlEncodeBytes(new TextEncoder().encode(json));
}

function base64UrlDecodeToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importHmacKey(secret: Uint8Array): Promise<CryptoKey> {
  const raw = new Uint8Array(secret);
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

const EXP_SECONDS = 60 * 60 * 24 * 7;

export async function signSession(
  userId: string,
  email: string,
  perfil: string,
): Promise<string> {
  const secret = getAuthSecretKey();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: userId,
    email,
    perfil,
    iat: now,
    exp: now + EXP_SECONDS,
  };
  const h = base64UrlEncodeJson(header);
  const p = base64UrlEncodeJson(payload);
  const data = new TextEncoder().encode(`${h}.${p}`);
  const key = await importHmacKey(secret);
  const sigBuf = await crypto.subtle.sign("HMAC", key, data);
  const sig = base64UrlEncodeBytes(new Uint8Array(sigBuf));
  return `${h}.${p}.${sig}`;
}

export type SessionPayload = {
  userId: string;
  email: string;
  perfil: string;
};

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  if (!h || !p || !s) return null;
  const secret = getAuthSecretKey();
  const data = new TextEncoder().encode(`${h}.${p}`);
  let sig: Uint8Array;
  try {
    sig = base64UrlDecodeToBytes(s);
  } catch {
    return null;
  }
  const key = await importHmacKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    new Uint8Array(sig),
    data,
  );
  if (!ok) return null;
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecodeToBytes(p)));
  } catch {
    return null;
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof (payload as { sub?: unknown }).sub !== "string" ||
    typeof (payload as { email?: unknown }).email !== "string" ||
    typeof (payload as { perfil?: unknown }).perfil !== "string" ||
    typeof (payload as { exp?: unknown }).exp !== "number"
  ) {
    return null;
  }
  const { sub, email, perfil, exp } = payload as {
    sub: string;
    email: string;
    perfil: string;
    exp: number;
  };
  if (exp * 1000 < Date.now()) return null;
  return { userId: sub, email, perfil };
}
