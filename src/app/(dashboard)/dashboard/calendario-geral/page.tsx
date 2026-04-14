import { CalendarioAgendaClient } from "@/components/dashboard/calendario-agenda-client";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { prisma } from "@/lib/prisma";

export default async function CalendarioGeralPage() {
  const [turmas, semestre, professores] = await Promise.all([
    prisma.turma.findMany({
      where: { ativa: true },
      include: { curso: true },
      orderBy: [{ cursoId: "asc" }, { codigo: "asc" }],
    }),
    prisma.semestre.findFirst({
      where: { ativo: true },
      include: { modulos: { orderBy: { numero: "asc" } } },
    }),
    prisma.professor.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const modulos = semestre?.modulos ?? [];

  return (
    <ModuleScaffold
      title="Calendário geral"
      description="Agenda profissional: grade recorrente das turmas + lançamento de aulas com módulo (sugerido pela data), professor e observação."
    >
      <CalendarioAgendaClient turmas={turmas} modulos={modulos} professores={professores} />
    </ModuleScaffold>
  );
}
