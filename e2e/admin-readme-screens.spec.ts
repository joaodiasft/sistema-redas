import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "docs", "img", "admin");

const creds = {
  email: process.env.E2E_ADMIN_EMAIL ?? "admin.redas@redas.com",
  password: process.env.E2E_ADMIN_PASSWORD ?? "redasmil2026",
};

/** Rotas do menu lateral + páginas úteis; prefixo numérico para ordenação no README. */
const routes: [string, string][] = [
  ["/dashboard", "01-dashboard"],
  ["/dashboard/relatorios", "02-relatorios"],
  ["/dashboard/calendario-geral", "03-calendario-geral"],
  ["/dashboard/alunos", "04-alunos"],
  ["/dashboard/alunos/novo", "05-aluno-novo"],
  ["/dashboard/cursos-turmas", "06-cursos-turmas"],
  ["/dashboard/turmas", "07-turmas"],
  ["/dashboard/professores", "08-professores"],
  ["/dashboard/modulos", "09-modulos"],
  ["/dashboard/operacional/presenca", "10-presenca"],
  ["/dashboard/operacional/reposicao", "11-reposicao"],
  ["/dashboard/operacional/calendario", "12-calendario-operacional"],
  ["/dashboard/operacional/financeiro", "13-financeiro-operacional"],
  ["/dashboard/operacional/redacao", "14-redacao"],
  ["/dashboard/configuracoes", "15-configuracoes"],
  ["/dashboard/configuracoes/acesso-aluno", "16-acesso-aluno"],
  ["/dashboard/configuracoes/sistema", "17-sistema"],
  ["/dashboard/usuarios", "18-usuarios"],
  ["/dashboard/semestre-modulos", "19-semestre-modulos"],
];

test.describe("README — capturas do painel admin", () => {
  test("login admin e screenshots", async ({ page }) => {
    fs.mkdirSync(outDir, { recursive: true });

    await page.goto("/login");
    await page.evaluate(
      async ({ email, password }: { email: string; password: string }) => {
        const r = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha: password }),
          credentials: "include",
        });
        const j = (await r.json().catch(() => ({}))) as { error?: string };
        if (!r.ok) throw new Error(j.error ?? `Login ${r.status}`);
        window.location.assign("/dashboard");
      },
      { email: creds.email, password: creds.password },
    );
    await page.waitForURL(/\/dashboard/, { timeout: 60_000 });

    for (const [url, slug] of routes) {
      const res = await page.goto(url);
      expect(res?.ok(), `${url} deve responder OK`).toBeTruthy();
      await page.waitForLoadState("domcontentloaded");
      const file = path.join(outDir, `${slug}.png`);
      await page.screenshot({ path: file, fullPage: true });
    }
  });
});
