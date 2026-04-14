import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { PresencaFormClient } from "@/components/admin/presenca-form-client";
import { prisma } from "@/lib/prisma";

export default async function PresencaPage() {
  const [turmas, sem] = await Promise.all([
    prisma.turma.findMany({
      where: { ativa: true },
      include: { curso: true },
      orderBy: [{ cursoId: "asc" }, { nome: "asc" }],
    }),
    prisma.semestre.findFirst({
      where: { ativo: true },
      include: {
        modulos: {
          orderBy: { numero: "asc" },
          include: { encontros: { orderBy: { ordem: "asc" } } },
        },
      },
    }),
  ]);

  const encontros =
    sem?.modulos.flatMap((m) =>
      m.encontros.map((e) => ({
        id: e.id,
        rotulo: e.rotulo,
        ordem: e.ordem,
        moduloNumero: m.numero,
        moduloTitulo: m.titulo,
        codigoModulo: m.codigoPublico,
      })),
    ) ?? [];

  const modulosResolver =
    sem?.modulos.map((m) => ({
      id: m.id,
      numero: m.numero,
      mesReferencia: m.mesReferencia,
      anoReferencia: m.anoReferencia,
      codigoPublico: m.codigoPublico,
    })) ?? [];

  return (
    <ModuleScaffold
      title="Presença"
      description="Integrado: turma carrega alunos matriculados; encontro e data salvam histórico em PresencaEncontro. O módulo do encontro é sugerido automaticamente pela data da aula."
    >
      <PanelCard>
        <PresencaFormClient
          turmas={turmas}
          encontros={encontros}
          modulosResolver={modulosResolver}
        />
      </PanelCard>
    </ModuleScaffold>
  );
}
