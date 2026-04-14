import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { TurmasFormTable } from "@/components/admin/turmas-form-table";
import { prisma } from "@/lib/prisma";

export default async function TurmasPage() {
  const [cursos, turmas] = await Promise.all([
    prisma.curso.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.turma.findMany({
      where: {},
      orderBy: [{ cursoId: "asc" }, { codigo: "asc" }],
      include: { curso: true },
    }),
  ]);

  return (
    <ModuleScaffold
      title="Turmas"
      description="Cadastro separado do curso: horários, dia da semana, capacidade e vínculo. Edição e exclusão com validação."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Nova turma</h2>
          <p className="mt-1 text-xs text-zinc-500">
            O código deve ser único dentro do mesmo curso (ex.: R1, EX1).
          </p>
          <TurmasFormTable cursos={cursos} turmas={turmas} />
        </PanelCard>
        <TurmasFormTable cursos={cursos} turmas={turmas} showTableOnly />
      </div>
    </ModuleScaffold>
  );
}
