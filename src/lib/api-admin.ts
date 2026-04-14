import { getSessionFromCookies } from "@/lib/auth-server";

export async function requireAdminSession() {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "ADMIN") {
    return { ok: false as const, res: Response.json({ error: "Não autorizado" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}
