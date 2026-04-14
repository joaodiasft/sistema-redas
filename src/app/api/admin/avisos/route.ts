import { PrioridadeAviso } from "@prisma/client";
import { requireAdminSession } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const avisos = await prisma.avisoSistema.findMany({
    orderBy: [{ prioridade: "desc" }, { criadoEm: "desc" }],
    take: 100,
    include: {
      curso: { select: { id: true, nome: true, codigo: true } },
      turma: { select: { id: true, nome: true, codigo: true } },
    },
  });

  return Response.json({ avisos });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  let body: {
    titulo?: string;
    mensagem?: string;
    prioridadeNivel?: PrioridadeAviso;
    paraTodasTurmas?: boolean;
    enviarAlunos?: boolean;
    enviarProfessores?: boolean;
    cursoId?: string | null;
    turmaId?: string | null;
    ativo?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const titulo = (body.titulo ?? "").trim();
  const mensagem = (body.mensagem ?? "").trim();
  if (!titulo || !mensagem) {
    return Response.json({ error: "Título e descrição são obrigatórios." }, { status: 400 });
  }

  const prioridadeNivel = body.prioridadeNivel ?? PrioridadeAviso.MEDIA;
  const prioridade =
    prioridadeNivel === PrioridadeAviso.ALTA ? 10 : prioridadeNivel === PrioridadeAviso.MEDIA ? 5 : 2;

  const aviso = await prisma.avisoSistema.create({
    data: {
      titulo,
      mensagem,
      prioridade,
      prioridadeNivel,
      paraTodasTurmas: body.paraTodasTurmas ?? true,
      enviarAlunos: body.enviarAlunos ?? true,
      enviarProfessores: body.enviarProfessores ?? false,
      cursoId: body.cursoId || null,
      turmaId: body.turmaId || null,
      ativo: body.ativo ?? true,
    },
    include: {
      curso: { select: { id: true, nome: true, codigo: true } },
      turma: { select: { id: true, nome: true, codigo: true } },
    },
  });

  return Response.json({ aviso });
}
