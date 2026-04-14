import { requireAdminSession } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const mesRef = searchParams.get("mes");
  const base = mesRef ? new Date(mesRef) : new Date();
  const inicio = startOfMonth(base);
  const fim = endOfMonth(base);

  const aulas = await prisma.aulaAgendada.findMany({
    where: {
      data: { gte: inicio, lte: fim },
    },
    orderBy: { data: "asc" },
    include: {
      turma: { include: { curso: true } },
      modulo: { select: { id: true, codigoPublico: true, numero: true, titulo: true } },
      professor: { select: { id: true, nome: true, codigoPublico: true } },
    },
  });

  return Response.json({ aulas, inicio: inicio.toISOString(), fim: fim.toISOString() });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  let body: {
    data: string;
    turmaId: string;
    moduloId?: string | null;
    professorId?: string | null;
    titulo?: string | null;
    observacao?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.data || !body.turmaId) {
    return Response.json({ error: "data e turmaId são obrigatórios." }, { status: 400 });
  }

  const data = new Date(body.data);
  if (Number.isNaN(data.getTime())) {
    return Response.json({ error: "Data inválida." }, { status: 400 });
  }

  const aula = await prisma.aulaAgendada.create({
    data: {
      data,
      turmaId: body.turmaId,
      moduloId: body.moduloId || null,
      professorId: body.professorId || null,
      titulo: body.titulo?.trim() || null,
      observacao: body.observacao?.trim() || null,
    },
    include: {
      turma: { include: { curso: true } },
      modulo: true,
      professor: true,
    },
  });

  return Response.json({ aula });
}
