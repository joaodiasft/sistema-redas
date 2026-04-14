/**
 * Verifica hashes na BD e, se BASE_URL estiver acessível, testa POST /api/auth/login.
 * Uso: node scripts/verify-logins.mjs
 * Com servidor: BASE_URL=http://localhost:3000 node scripts/verify-logins.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Contas documentadas no seed (senhas esperadas). */
const SEED_ACCOUNTS = [
  ["admin.redas@redas.com", "redasmil2026", "ADMIN"],
  ["admin.teste@rmil.com", "redas2026", "ADMIN"],
  ["professor.teste@rmil.com", "redas2026", "PROFESSOR"],
  ["joao.claudio@rmil.com", "123456", "ALUNO"],
  ["martha@rmil.com", "redas2026", "PROFESSOR"],
];

async function verifyDb() {
  const rows = [];
  for (const [email, senhaEsperada, perfilEsperado] of SEED_ACCOUNTS) {
    const u = await prisma.usuario.findUnique({
      where: { email },
      select: { email: true, perfil: true, ativo: true, senhaHash: true },
    });
    if (!u) {
      rows.push({ email, ok: false, step: "missing_user" });
      continue;
    }
    if (u.perfil !== perfilEsperado) {
      rows.push({
        email,
        ok: false,
        step: "perfil_mismatch",
        got: u.perfil,
        expected: perfilEsperado,
      });
      continue;
    }
    if (!u.ativo) {
      rows.push({ email, ok: false, step: "inactive" });
      continue;
    }
    const match = await bcrypt.compare(senhaEsperada, u.senhaHash);
    rows.push({
      email,
      ok: match,
      step: match ? "bcrypt_ok" : "bcrypt_fail",
      perfil: u.perfil,
    });
  }
  return rows;
}

async function verifyHttp(baseUrl) {
  const url = `${baseUrl.replace(/\/$/, "")}/api/auth/login`;
  const results = [];
  for (const [email, senha] of SEED_ACCOUNTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json().catch(() => ({}));
      const setCookie = res.headers.get("set-cookie") || "";
      const hasSessionCookie = /session=/.test(setCookie);
      results.push({
        email,
        httpOk: res.ok,
        status: res.status,
        perfil: data.perfil,
        error: data.error,
        setSessionCookie: hasSessionCookie,
      });
    } catch (e) {
      results.push({
        email,
        httpOk: false,
        error: String(e?.message || e),
      });
    }
  }
  return results;
}

async function main() {
  console.log("=== Base de dados (bcrypt + perfil) ===\n");
  const db = await verifyDb();
  console.log(JSON.stringify(db, null, 2));
  const dbAllOk = db.every((r) => r.ok);

  const base = process.env.BASE_URL || "";
  if (base) {
    console.log("\n=== HTTP POST /api/auth/login ===\n");
    const http = await verifyHttp(base);
    console.log(JSON.stringify(http, null, 2));
    const httpAllOk = http.every((r) => r.httpOk && r.setSessionCookie);
    process.exitCode = dbAllOk && httpAllOk ? 0 : 1;
  } else {
    console.log("\n(Skipping HTTP: define BASE_URL=http://localhost:3000 para testar a API.)");
    process.exitCode = dbAllOk ? 0 : 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
