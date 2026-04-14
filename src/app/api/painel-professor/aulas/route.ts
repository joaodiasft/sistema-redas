import { endOfMonth, startOfMonth } from "date-fns";
import { getSessionFromCookies } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

/** GET: aulas agendadas no mês, apenas turmas vinculadas ao professor (somente leitura). */
export async function GET(req: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "PROFESSOR") {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const professor = await prisma.professor.findFirst({
    where: { usuarioId: session.userId },
    include: { turmas: true },
  });
  if (!professor) {
    return Response.json({ error: "Professor não encontrado" }, { status: 403 });
  }

  const turmaIds = professor.turmas.map((t) => t.turmaId);
  if (turmaIds.length === 0) {
    return Response.json({ aulas: [], inicio: null, fim: null });
  }

  const { searchParams } = new URL(req.url);
  const mesRef = searchParams.get("mes");
  const base = mesRef ? new Date(mesRef) : new Date();
  const inicio = startOfMonth(base);
  const fim = endOfMonth(base);

  const aulas = await prisma.aulaAgendada.findMany({
    where: {
      turmaId: { in: turmaIds },
      data: { gte: inicio, lte: fim },
    },
    orderBy: { data: "asc" },
    include: {
      turma: { include: { curso: true } },
      modulo: { select: { id: true, codigoPublico: true, numero: true, titulo: true } },
      professor: { select: { id: true, nome: true, codigoPublico: true } },
    },
  });

  return Response.json({
    aulas,
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
  });
}
