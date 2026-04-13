import { ErpHeader } from "@/components/erp/erp-header";

export default function FinanceiroPage() {
  return (
    <>
      <ErpHeader titulo="Financeiro" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          <code className="rounded bg-zinc-100 px-1">ParcelaModulo</code> para 2º–5º módulos: status,
          comprovante, assinatura, data de pagamento. Relatórios de inadimplência.
        </p>
      </div>
    </>
  );
}
