import { redirect } from "next/navigation";
import type { Aluno, Curso, Matricula, Turma } from "@prisma/client";
import { cache } from "react";
import { getSessionFromCookies } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export type AlunoComMatriculas = Aluno & {
  matriculas: (Matricula & { turma: Turma; curso: Curso })[];
};

/** Identifica curso de redação (código seed01 ou nome). */
export function isCursoRedacao(curso: { codigo: string; nome: string }): boolean {
  const n = curso.nome.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return (
    curso.codigo === "01" ||
    n.includes("redacao") ||
    curso.nome.toLowerCase().includes("redaç")
  );
}

export function alunoMatriculadoEmRedacao(aluno: AlunoComMatriculas): boolean {
  return aluno.matriculas.some((m) => isCursoRedacao(m.curso));
}

/**
 * Garante sessão ALUNO e ficha de aluno ligada ao utilizador.
 * Todas as rotas em /painel/aluno/* devem usar isto no servidor.
 */
export const requireAlunoPainel = cache(async (): Promise<{
  session: NonNullable<Awaited<ReturnType<typeof getSessionFromCookies>>>;
  aluno: AlunoComMatriculas;
}> => {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "ALUNO") {
    redirect("/login");
  }

  const aluno = await prisma.aluno.findFirst({
    where: { usuarioId: session.userId },
    include: {
      matriculas: {
        include: { turma: true, curso: true },
        orderBy: { ordem: "asc" },
      },
    },
  });

  if (!aluno) {
    redirect("/login");
  }

  return { session, aluno };
});

export function formatBRL(value: unknown): string {
  if (value == null) return "—";
  let n: number;
  if (typeof value === "number") n = value;
  else if (typeof value === "string") n = Number(value.replace(",", "."));
  else if (typeof value === "object" && value !== null && "toNumber" in value) {
    n = (value as { toNumber: () => number }).toNumber();
  } else n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function labelTipoPlano(t: string): string {
  const map: Record<string, string> = {
    MENSAL: "Mensal",
    BIMESTRAL: "Bimestral",
    TRIMESTRAL: "Trimestral",
    BOLSA_50: "Bolsa 50%",
    BOLSA_100: "Bolsa 100%",
  };
  return map[t] ?? t;
}

export function labelSituacaoAluno(s: string): string {
  const map: Record<string, string> = {
    ATIVO: "Em dia",
    INATIVO: "Inativo",
    DEVENDO: "Pendente financeiro",
  };
  return map[s] ?? s;
}

export function labelStatusParcela(s: string): string {
  const map: Record<string, string> = {
    PENDENTE: "Pendente",
    PAGO: "Pago",
    ATRASADO: "Atrasado",
    ISENTO: "Isento",
  };
  return map[s] ?? s;
}
