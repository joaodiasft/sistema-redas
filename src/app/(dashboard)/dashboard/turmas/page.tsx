import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { TurmasCrud } from "@/components/admin/turmas-crud";
import { prisma } from "@/lib/prisma";

export default async function TurmasPage() {
  const [cursos, turmas] = await Promise.all([
    prisma.curso.findMany({ orderBy: { nome: "asc" } }),
    prisma.turma.findMany({
      orderBy: [{ cursoId: "asc" }, { codigo: "asc" }],
      include: { curso: true },
    }),
  ]);

  return (
    <ModuleScaffold
      title="Turmas"
      description="CRUD completo: vínculo ao curso, horários, dia da semana, capacidade e status ativo."
    >
      <TurmasCrud cursos={cursos} turmas={turmas} />
    </ModuleScaffold>
  );
}
