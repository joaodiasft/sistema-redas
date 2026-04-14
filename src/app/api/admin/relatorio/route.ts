import { SituacaoAluno } from "@prisma/client";
import { requireAdminSession } from "@/lib/api-admin";
import { montarRelatorio, type TipoRelatorio } from "@/lib/relatorio-data";

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const tipo = (searchParams.get("tipo") ?? "geral") as TipoRelatorio;
  const cursoId = searchParams.get("cursoId") || undefined;
  const turmaId = searchParams.get("turmaId") || undefined;
  const alunoId = searchParams.get("alunoId") || undefined;
  const situacaoRaw = searchParams.get("situacao") || "TODOS";
  const situacao =
    situacaoRaw === "TODOS"
      ? "TODOS"
      : (situacaoRaw as SituacaoAluno);

  const validTipos: TipoRelatorio[] = ["geral", "curso", "turma", "aluno"];
  if (!validTipos.includes(tipo)) {
    return Response.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const payload = await montarRelatorio({
    tipo,
    cursoId,
    turmaId,
    alunoId,
    situacao,
  });

  return Response.json(payload);
}
