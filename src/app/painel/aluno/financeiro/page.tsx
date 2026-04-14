import { CreditCard, PiggyBank } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  formatBRL,
  labelSituacaoAluno,
  labelStatusParcela,
  labelTipoPlano,
  requireAlunoPainel,
} from "@/lib/painel-aluno";

export default async function PainelAlunoFinanceiroPage() {
  const { aluno } = await requireAlunoPainel();
  const parcelas = await prisma.parcelaModulo.findMany({
    where: { alunoId: aluno.id },
    orderBy: { moduloNumero: "asc" },
  });

  const pagos = parcelas.filter((p) => p.status === "PAGO");
  const pendentes = parcelas.filter((p) => p.status === "PENDENTE");
  const atrasados = parcelas.filter((p) => p.status === "ATRASADO");
  const isentos = parcelas.filter((p) => p.status === "ISENTO");

  const situacaoFinanceira =
    aluno.situacao === "DEVENDO"
      ? "Pendente"
      : aluno.situacao === "INATIVO"
        ? "Inativo"
        : atrasados.length > 0
          ? "Com parcelas atrasadas"
          : "Em dia";

  const bolsaLabel =
    aluno.tipoPlano === "BOLSA_50"
      ? "Bolsa 50%"
      : aluno.tipoPlano === "BOLSA_100"
        ? "Bolsa 100%"
        : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Financeiro</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Consulta das parcelas por módulo. Valores cadastrados pela secretaria.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/80 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700">
            <PiggyBank className="h-5 w-5" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-wide">Plano</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-zinc-900">
            {labelTipoPlano(aluno.tipoPlano)}
          </p>
          {bolsaLabel ? (
            <p className="mt-2 text-sm font-medium text-rose-800">{bolsaLabel}</p>
          ) : null}
          <p className="mt-3 text-xs text-zinc-600">
            Dia de pagamento:{" "}
            <strong className="text-zinc-800">
              {aluno.diaPagamento != null ? `dia ${aluno.diaPagamento}` : "—"}
            </strong>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <CreditCard className="h-5 w-5" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-wide">Situação</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-zinc-900">{situacaoFinanceira}</p>
          <p className="mt-1 text-sm text-zinc-600">
            Cadastro: {labelSituacaoAluno(aluno.situacao)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              Pagos: {pagos.length}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-900">
              Pendentes: {pendentes.length}
            </span>
            {atrasados.length > 0 ? (
              <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-800">
                Atrasados: {atrasados.length}
              </span>
            ) : null}
            {isentos.length > 0 ? (
              <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                Isentos: {isentos.length}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-zinc-900">Parcelas por módulo</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Vencimento estimado: dia {aluno.diaPagamento ?? "—"} de cada mês (conforme contrato).
          </p>
        </div>
        {parcelas.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">
            Nenhuma parcela cadastrada ainda para sua conta.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.65rem] font-semibold uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Módulo</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Valor base</th>
                  <th className="px-3 py-3">Desconto</th>
                  <th className="px-3 py-3">Valor final</th>
                  <th className="px-5 py-3 sm:px-6">Pago em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {parcelas.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900 sm:px-6">
                      #{p.moduloNumero}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.status === "PAGO"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "ATRASADO"
                              ? "bg-red-100 text-red-800"
                              : p.status === "ISENTO"
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {labelStatusParcela(p.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-zinc-700">{formatBRL(p.valorBase)}</td>
                    <td className="px-3 py-3 text-zinc-700">{formatBRL(p.desconto)}</td>
                    <td className="px-3 py-3 font-medium text-zinc-900">
                      {formatBRL(p.valorFinal)}
                    </td>
                    <td className="px-5 py-3 text-zinc-600 sm:px-6">
                      {p.pagoEm
                        ? new Date(p.pagoEm).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
