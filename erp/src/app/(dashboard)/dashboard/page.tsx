import { ErpHeader } from "@/components/erp/erp-header";

export default function DashboardPage() {
  return (
    <>
      <ErpHeader titulo="Painel" />
      <div className="flex-1 space-y-6 p-6">
        <p className="text-sm text-zinc-600">
          Visão geral do ERP: métricas de alunos, frequência, parcelas e materiais (dados virão do
          Prisma após seed e telas CRUD).
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Alunos ativos", v: "—" },
            { k: "Turmas", v: "—" },
            { k: "Faltas (7 dias)", v: "—" },
            { k: "Parcelas pendentes", v: "—" },
          ].map((card) => (
            <div
              key={card.k}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{card.k}</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{card.v}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
