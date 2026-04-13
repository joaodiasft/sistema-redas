import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function ReposicaoPage() {
  return (
    <ModuleScaffold
      title="Reposição"
      description="Fluxo: aluno → curso/turma(s) → módulo → faltas → data da reposição. Histórico claro de faltas e reposições."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard>
          <label className="text-xs font-semibold text-zinc-600">Aluno</label>
          <select className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
            <option>Buscar aluno…</option>
          </select>
        </PanelCard>
        <PanelCard>
          <p className="text-sm text-zinc-600">
            Com duas turmas, serão exibidos campos separados para cada vínculo. Integração com{" "}
            <code className="rounded bg-zinc-100 px-1">ReposicaoRegistro</code> e faltas em{" "}
            <code className="rounded bg-zinc-100 px-1">PresencaEncontro</code>.
          </p>
        </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
