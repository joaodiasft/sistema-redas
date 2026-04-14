import { requireAdminSession } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const turmaId = new URL(req.url).searchParams.get("turmaId");
  if (!turmaId) {
    return Response.json({ error: "turmaId obrigatório" }, { status: 400 });
  }

  const matriculas = await prisma.matricula.findMany({
    where: { turmaId },
    include: {
      aluno: {
        select: {
          id: true,
          nomeCompleto: true,
          codigoPublico: true,
        },
      },
    },
    orderBy: { aluno: { nomeCompleto: "asc" } },
  });

  const alunos = matriculas.map((m) => m.aluno);

  return Response.json({ alunos });
}
