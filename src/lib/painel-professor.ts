import { redirect } from "next/navigation";
import type { Curso, Professor, ProfessorTurma, Turma } from "@prisma/client";
import { cache } from "react";
import { getSessionFromCookies } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export type ProfessorComTurmas = Professor & {
  turmas: (ProfessorTurma & { turma: Turma & { curso: Curso } })[];
};

export const requireProfessorPainel = cache(async (): Promise<{
  session: NonNullable<Awaited<ReturnType<typeof getSessionFromCookies>>>;
  professor: ProfessorComTurmas;
}> => {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "PROFESSOR") {
    redirect("/login");
  }

  const professor = await prisma.professor.findFirst({
    where: { usuarioId: session.userId },
    include: {
      turmas: {
        include: {
          turma: { include: { curso: true } },
        },
      },
    },
  });

  if (!professor) {
    redirect("/login");
  }

  return { session, professor };
});

export function turmaIdsDoProfessor(professor: ProfessorComTurmas): string[] {
  return professor.turmas.map((pt) => pt.turmaId);
}

export function assertTurmaDoProfessor(
  professor: ProfessorComTurmas,
  turmaId: string,
): boolean {
  return professor.turmas.some((pt) => pt.turmaId === turmaId);
}

export function labelDiaSemana(d: number | null): string {
  if (d === null) return "—";
  const nomes = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return nomes[d] ?? "—";
}

export function labelClasseTurma(c: string): string {
  return c === "ENSINO_FUNDAMENTAL" ? "Ensino fundamental" : "Ensino médio";
}
