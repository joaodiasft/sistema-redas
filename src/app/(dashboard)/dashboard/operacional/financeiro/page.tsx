import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function FinanceiroOperacionalPage() {
  return (
    <ModuleScaffold
      title="Financeiro por aluno"
      description="Selecione aluno, módulo, desconto e confirme pagamento. Resumo: plano, valores, situação e módulos pagos/pendentes."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard>
          <label className="text-xs font-semibold text-zinc-600">Aluno</label>
          <select className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
            <option>Selecione…</option>
          </select>
          <label className="mt-4 block text-xs font-semibold text-zinc-600">Módulo</label>
          <select className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
            <option>—</option>
          </select>
        </PanelCard>
        <PanelCard>
          <h3 className="text-sm font-semibold text-zinc-900">Resumo (preview)</h3>
          <dl className="mt-3 space-y-2 text-sm text-zinc-600">
            <div className="flex justify-between">
              <dt>Valor base</dt>
              <dd>—</dd>
            </div>
            <div className="flex justify-between">
              <dt>Desconto</dt>
              <dd>—</dd>
            </div>
            <div className="flex justify-between font-semibold text-zinc-900">
              <dt>Final</dt>
              <dd>—</dd>
            </div>
          </dl>
          <button
            type="button"
            className="mt-4 w-full rounded-full bg-[#e11d74] py-2.5 text-sm font-semibold text-white"
          >
            Confirmar pagamento
          </button>
        </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
