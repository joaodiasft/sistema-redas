import { CalendarioAgendaClient } from "@/components/dashboard/calendario-agenda-client";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { prisma } from "@/lib/prisma";

export default async function CalendarioOperacionalPage() {
  const [turmas, semestre, professores] = await Promise.all([
    prisma.turma.findMany({
      where: { ativa: true },
      include: { curso: true },
      orderBy: [{ cursoId: "asc" }, { codigo: "asc" }],
    }),
    prisma.semestre.findFirst({
      where: { ativo: true },
      include: {
        modulos: {
          orderBy: { numero: "asc" },
          select: {
            id: true,
            codigoPublico: true,
            numero: true,
            titulo: true,
            mesReferencia: true,
            anoReferencia: true,
          },
        },
      },
    }),
    prisma.professor.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const modulos = semestre?.modulos ?? [];

  return (
    <ModuleScaffold
      title="Calendário operacional"
      description="Mesmo motor do calendário geral: lançar, editar e excluir aulas com observações. O módulo é preenchido automaticamente conforme a data/hora da aula."
    >
      <CalendarioAgendaClient turmas={turmas} modulos={modulos} professores={professores} />
    </ModuleScaffold>
  );
}
