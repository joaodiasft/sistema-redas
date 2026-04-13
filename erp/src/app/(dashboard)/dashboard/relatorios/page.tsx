import { ErpHeader } from "@/components/erp/erp-header";

export default function RelatoriosPage() {
  return (
    <>
      <ErpHeader titulo="Relatórios" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          Exportações (CSV/PDF), frequência consolidada, financeiro por turma, acompanhamento de
          redações entregues.
        </p>
      </div>
    </>
  );
}
