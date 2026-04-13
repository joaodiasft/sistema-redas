import { MonthCalendarView } from "@/components/dashboard/month-calendar-view";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { prisma } from "@/lib/prisma";

export default async function CalendarioGeralPage() {
  const turmas = await prisma.turma.findMany({
    where: { ativa: true },
    include: { curso: true },
  });
  const diasSemanaTurmas = turmas.map((t) => t.diaSemana);
  const refDate = new Date();

  return (
    <ModuleScaffold
      title="Calendário geral"
      description="Visão mensual: dias com aula prevista conforme turmas cadastradas, módulos em andamento e organização do curso."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <PanelCard className="lg:col-span-2">
          <MonthCalendarView refDate={refDate} diasSemanaTurmas={diasSemanaTurmas} />
        </PanelCard>
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Turmas ativas</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {turmas.map((t) => (
              <li key={t.id} className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2">
                <span className="font-medium text-zinc-800">{t.curso.nome}</span>
                <br />
                <span className="text-xs">{t.nome}</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
