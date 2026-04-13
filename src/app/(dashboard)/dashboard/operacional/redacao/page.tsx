import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function RedacaoEntregaPage() {
  return (
    <ModuleScaffold
      title="Entrega de redação"
      description="Somente alunos do curso de redação. Registre quantidade e se houve entrega na secretaria."
    >
      <PanelCard>
        <label className="text-xs font-semibold text-zinc-600">Aluno (curso redação)</label>
        <select className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
          <option>Selecione…</option>
        </select>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-zinc-600">Quantidade</label>
            <input
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" className="rounded border-zinc-300" />
              Entrega na secretaria
            </label>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Histórico persistido em <code className="rounded bg-zinc-100 px-1">EntregaRedacao</code>.
        </p>
      </PanelCard>
    </ModuleScaffold>
  );
}
