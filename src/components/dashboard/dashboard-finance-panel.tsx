import Link from "next/link";
import type { getFinanceiroExtendido } from "@/lib/finance-aggregates";

function fmtMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Fin = Awaited<ReturnType<typeof getFinanceiroExtendido>>;

export function DashboardFinancePanel({ fin }: { fin: Fin }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-800/80">
            Total recebido
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-emerald-900">
            {fmtMoney(fin.totalRecebido)}
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/90 to-white p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-amber-900/80">
            Total pendente
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-amber-950">
            {fmtMoney(fin.totalPendente)}
          </p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/80 to-white p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-sky-900/80">
            Previsão (referência)
          </p>
          <p className="mt-1 text-sm font-semibold text-sky-950">
            {fmtMoney(fin.previsaoMesReferencia)}
          </p>
          <p className="mt-0.5 text-[0.65rem] text-sky-700/90">Base: parcelas em aberto</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/80 to-white p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-rose-900/80">
            Inadimplentes
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-rose-950">
            {fin.alunosInadimplentes}
          </p>
          <p className="mt-0.5 text-[0.65rem] text-rose-700/90">alunos (devendo ou atraso)</p>
        </div>
      </div>

      <dl className="space-y-2 border-t border-zinc-100 pt-4 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Parcelas pendentes</dt>
          <dd className="font-semibold tabular-nums text-zinc-900">{fin.parcelasPendentes}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Parcelas atrasadas</dt>
          <dd className="font-semibold tabular-nums text-amber-800">{fin.parcelasAtrasadas}</dd>
        </div>
      </dl>

      {fin.valorPorCurso.length > 0 ? (
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
            Pendente por curso (rateado)
          </p>
          <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-xs">
            {fin.valorPorCurso.slice(0, 6).map((r) => (
              <li key={r.nome} className="flex justify-between gap-2 text-zinc-700">
                <span className="truncate">{r.nome}</span>
                <span className="shrink-0 font-medium tabular-nums">{fmtMoney(r.valor)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {fin.valorPorTurma.length > 0 ? (
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
            Pendente por turma (rateado)
          </p>
          <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-xs">
            {fin.valorPorTurma.slice(0, 6).map((r) => (
              <li key={r.nome} className="flex justify-between gap-2 text-zinc-700">
                <span className="truncate">{r.nome}</span>
                <span className="shrink-0 font-medium tabular-nums">{fmtMoney(r.valor)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link
        href="/dashboard/financeiro"
        className="block rounded-xl bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Abrir financeiro completo
      </Link>
    </div>
  );
}
