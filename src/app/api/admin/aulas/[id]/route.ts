import { requireAdminSession } from "@/lib/api-admin";
import { optionalRelationId } from "@/lib/optional-fk";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  let body: {
    data?: string;
    turmaId?: string;
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

  const data: Record<string, unknown> = {};
  if (body.data !== undefined) {
    const d = new Date(body.data);
    if (Number.isNaN(d.getTime())) return Response.json({ error: "Data inválida." }, { status: 400 });
    data.data = d;
  }
  if (body.turmaId !== undefined) data.turmaId = body.turmaId;
  if (body.moduloId !== undefined) data.moduloId = optionalRelationId(body.moduloId) ?? null;
  if (body.professorId !== undefined) data.professorId = optionalRelationId(body.professorId) ?? null;
  if (body.titulo !== undefined) data.titulo = body.titulo?.trim() || null;
  if (body.observacao !== undefined) data.observacao = body.observacao?.trim() || null;

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  try {
    const aula = await prisma.aulaAgendada.update({
      where: { id },
      data,
      include: {
        turma: { include: { curso: true } },
        modulo: true,
        professor: true,
      },
    });
    return Response.json({ aula });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Record") || msg.includes("P2025")) {
      return Response.json({ error: "Aula não encontrada." }, { status: 404 });
    }
    if (msg.includes("Foreign key") || msg.includes("P2003")) {
      return Response.json(
        { error: "Vínculo inválido (turma, módulo ou professor)." },
        { status: 400 },
      );
    }
    console.error("[aulas PATCH]", e);
    return Response.json({ error: "Erro ao atualizar aula." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  try {
    await prisma.aulaAgendada.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Aula não encontrada." }, { status: 404 });
  }
}
