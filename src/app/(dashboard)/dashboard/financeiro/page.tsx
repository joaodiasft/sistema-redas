import Link from "next/link";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { getFinanceiroExtendido } from "@/lib/finance-aggregates";
import { prisma } from "@/lib/prisma";

function fmtMoney(n: number | null | undefined) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FinanceiroPage() {
  const fin = await getFinanceiroExtendido();

  const alunosFin = await prisma.aluno.findMany({
    orderBy: { nomeCompleto: "asc" },
    include: {
      matriculas: { include: { curso: true, turma: true } },
      parcelas: { orderBy: { moduloNumero: "asc" } },
    },
    take: 80,
  });

  return (
    <ModuleScaffold
      title="Financeiro"
      description="Integrado ao cadastro: parcelas por módulo, histórico e situação do aluno."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Visão geral</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Recebido</dt>
              <dd className="font-semibold text-emerald-800">{fmtMoney(fin.totalRecebido)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Pendente</dt>
              <dd className="font-semibold text-amber-900">{fmtMoney(fin.totalPendente)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Inadimplentes</dt>
              <dd className="font-semibold text-rose-900">{fin.alunosInadimplentes}</dd>
            </div>
          </dl>
        </PanelCard>
        <PanelCard className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-900">Alunos e parcelas</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Status atualiza conforme cadastro de parcelas. Vínculo direto com turmas e cursos.
          </p>
          <div className="mt-4 max-h-[480px] overflow-auto rounded-xl border border-zinc-100">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="sticky top-0 bg-zinc-100/95 text-[0.65rem] font-semibold uppercase text-zinc-600">
                <tr>
                  <th className="px-3 py-2">Aluno</th>
                  <th className="px-3 py-2">Turmas</th>
                  <th className="px-3 py-2">Situação</th>
                  <th className="px-3 py-2">Parcelas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {alunosFin.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-50/80">
                    <td className="px-3 py-2">
                      <span className="font-medium text-zinc-900">{a.nomeCompleto}</span>
                      <br />
                      <span className="text-[0.65rem] text-zinc-400">{a.codigoPublico}</span>
                    </td>
                    <td className="px-3 py-2 text-zinc-600">
                      {a.matriculas.map((m) => m.turma.codigo).join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2">{a.situacao}</td>
                    <td className="px-3 py-2">
                      <ul className="space-y-0.5">
                        {a.parcelas.slice(0, 5).map((p) => (
                          <li key={p.id} className="tabular-nums text-zinc-700">
                            M{p.moduloNumero}: {p.status} ·{" "}
                            {fmtMoney(p.valorFinal != null ? Number(p.valorFinal) : null)}
                          </li>
                        ))}
                        {a.parcelas.length === 0 ? (
                          <li className="text-zinc-400">Sem parcelas</li>
                        ) : null}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/dashboard/alunos"
            className="mt-4 inline-block text-sm font-medium text-[#c41062] hover:underline"
          >
            Abrir cadastro de alunos →
          </Link>
        </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
