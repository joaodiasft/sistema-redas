import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function CalendarioOperacionalPage() {
  return (
    <ModuleScaffold
      title="Calendário operacional"
      description="Panorama de aulas, módulos e turmas — complementa o calendário geral com foco em registro operacional."
    >
      <PanelCard>
        <p className="text-sm text-zinc-600">
          Visualização combinando datas de encontros (<code className="rounded bg-zinc-100 px-1">Encontro</code>
          ), turmas e andamento mensal. Pode ser unificado ao calendário geral com camadas
          adicionais.
        </p>
      </PanelCard>
    </ModuleScaffold>
  );
}
