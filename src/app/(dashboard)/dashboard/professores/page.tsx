import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { ProfessoresCrud } from "@/components/admin/professores-crud";
import { prisma } from "@/lib/prisma";

export default async function ProfessoresPage() {
  const [professores, turmas] = await Promise.all([
    prisma.professor.findMany({
      orderBy: { codigoPublico: "asc" },
      include: {
        turmas: { include: { turma: { include: { curso: true } } } },
        usuario: { select: { email: true } },
      },
    }),
    prisma.turma.findMany({
      where: { ativa: true },
      include: { curso: true },
      orderBy: [{ cursoId: "asc" }, { nome: "asc" }],
    }),
  ]);

  return (
    <ModuleScaffold
      title="Professores"
      description="CRUD completo: matéria, vínculo com uma ou mais turmas e login opcional na criação."
    >
      <ProfessoresCrud professores={professores} turmas={turmas} />
    </ModuleScaffold>
  );
}
