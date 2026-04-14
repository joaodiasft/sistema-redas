import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  ClipboardCheck,
  PenLine,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  alunoMatriculadoEmRedacao,
  formatBRL,
  labelSituacaoAluno,
  labelStatusParcela,
  labelTipoPlano,
  requireAlunoPainel,
} from "@/lib/painel-aluno";

export default async function PainelAlunoDashboardPage() {
  const { aluno } = await requireAlunoPainel();
  const turmaIds = [...new Set(aluno.matriculas.map((m) => m.turmaId))];
  const cursoIds = [...new Set(aluno.matriculas.map((m) => m.cursoId))];
  const showRedacoes = alunoMatriculadoEmRedacao(aluno);

  const [parcelas, presencas, entregasAgg, avisos, reposicoesCount] = await Promise.all([
    prisma.parcelaModulo.findMany({
      where: { alunoId: aluno.id },
      orderBy: { moduloNumero: "asc" },
    }),
    prisma.presencaEncontro.findMany({
      where: { alunoId: aluno.id },
      include: { encontro: { include: { modulo: true } } },
    }),
    prisma.entregaRedacao.aggregate({
      where: { alunoId: aluno.id },
      _sum: { quantidade: true },
      _count: { id: true },
    }),
    prisma.avisoSistema.findMany({
      where: {
        ativo: true,
        enviarAlunos: true,
        OR: [
          { paraTodasTurmas: true },
          ...(turmaIds.length ? [{ turmaId: { in: turmaIds } }] : []),
          ...(cursoIds.length ? [{ cursoId: { in: cursoIds } }] : []),
        ],
      },
      orderBy: [{ prioridade: "desc" }, { criadoEm: "desc" }],
      take: 6,
    }),
    prisma.reposicaoRegistro.count({ where: { alunoId: aluno.id } }),
  ]);

  const totalFreq = presencas.length;
  const presentes = presencas.filter((p) => p.presente).length;
  const pctFreq =
    totalFreq > 0 ? Math.round((presentes / totalFreq) * 100) : null;

  const parcelasPagas = parcelas.filter((p) => p.status === "PAGO").length;
  const parcelasPendentes = parcelas.filter((p) =>
    ["PENDENTE", "ATRASADO"].includes(p.status),
  ).length;
  const totalRedacoes = entregasAgg._sum.quantidade ?? 0;

  const quick = [
    {
      href: "/painel/aluno/financeiro",
      label: "Financeiro",
      desc: "Parcelas e plano",
      icon: Wallet,
      color: "from-rose-500/10 to-rose-600/5 text-rose-700 border-rose-100",
    },
    {
      href: "/painel/aluno/frequencia",
      label: "Frequência",
      desc: "Presenças e faltas",
      icon: ClipboardCheck,
      color: "from-violet-500/10 to-violet-600/5 text-violet-700 border-violet-100",
    },
    {
      href: "/painel/aluno/avisos",
      label: "Avisos",
      desc: "Comunicados",
      icon: Bell,
      color: "from-amber-500/10 to-amber-600/5 text-amber-800 border-amber-100",
    },
    ...(showRedacoes
      ? [
          {
            href: "/painel/aluno/redacoes",
            label: "Redações",
            desc: "Entregas registradas",
            icon: PenLine,
            color:
              "from-emerald-500/10 to-emerald-600/5 text-emerald-800 border-emerald-100",
          },
        ]
      : []),
    {
      href: "/painel/aluno/relatorios",
      label: "Relatórios",
      desc: "Exportar PDF",
      icon: BookOpen,
      color: "from-sky-500/10 to-sky-600/5 text-sky-800 border-sky-100",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="painel-card-hero relative overflow-hidden bg-gradient-to-br from-[#fff1f3] via-white to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600/90">
            Seu painel
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Olá, {aluno.nomeCompleto.split(" ")[0]}!
          </h1>
          <p className="painel-prose-muted mt-2">
            Acompanhe turmas, financeiro, frequência e avisos. Tudo aqui é só da sua
            matrícula — modo consulta.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
            <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-100">
              Código: <strong className="text-zinc-900">{aluno.codigoPublico}</strong>
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-100">
              Plano: {labelTipoPlano(aluno.tipoPlano)}
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-100">
              Situação: {labelSituacaoAluno(aluno.situacao)}
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
          Matrículas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {aluno.matriculas.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500">
              Nenhuma turma vinculada. Procure a secretaria.
            </p>
          ) : (
            aluno.matriculas.map((m) => (
              <div
                key={m.id}
                className="painel-card p-5"
              >
                <p className="text-xs font-semibold uppercase text-rose-600/80">
                  {m.curso.nome}
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{m.turma.nome}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Turma {m.turma.codigo}
                  {m.turma.horaInicio && m.turma.horaFim
                    ? ` · ${m.turma.horaInicio}–${m.turma.horaFim}`
                    : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
          Resumo rápido
        </h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="painel-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <Wallet className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase">Financeiro</span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-900">
              {parcelasPagas}/{parcelas.length || 0}
            </p>
            <p className="text-xs text-zinc-600">Módulos pagos (total no cadastro)</p>
            {parcelasPendentes > 0 ? (
              <p className="mt-2 text-xs font-medium text-amber-700">
                {parcelasPendentes} pendente(s) ou atrasada(s)
              </p>
            ) : parcelas.length > 0 ? (
              <p className="mt-2 text-xs font-medium text-emerald-700">Parcelas em dia</p>
            ) : null}
          </div>

          <div className="painel-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <TrendingUp className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase">Frequência</span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-900">
              {pctFreq !== null ? `${pctFreq}%` : "—"}
            </p>
            <p className="text-xs text-zinc-600">
              {totalFreq > 0
                ? `${presentes} presenças em ${totalFreq} registros`
                : "Sem registros de presença ainda"}
            </p>
            {reposicoesCount > 0 ? (
              <p className="mt-2 text-xs text-violet-700">
                {reposicoesCount} reposição(ões) registrada(s)
              </p>
            ) : null}
          </div>

          <div className="painel-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <PenLine className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase">Redações</span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-900">
              {showRedacoes ? totalRedacoes : "—"}
            </p>
            <p className="text-xs text-zinc-600">
              {showRedacoes
                ? `${entregasAgg._count.id} registro(s) de entrega`
                : "Curso de redação não detectado na matrícula"}
            </p>
          </div>

          <div className="painel-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <Bell className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase">Avisos</span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-900">{avisos.length}</p>
            <p className="text-xs text-zinc-600">Comunicados para você</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
          Acesso rápido
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                className={`painel-interactive painel-focus-ring-aluno group flex items-center gap-4 rounded-2xl border bg-gradient-to-br p-5 shadow-sm motion-safe:transition-[box-shadow,transform] motion-safe:duration-200 hover:shadow-md motion-safe:hover:-translate-y-px ${q.color}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{q.label}</p>
                  <p className="text-xs text-zinc-600">{q.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-600" />
              </Link>
            );
          })}
        </div>
      </section>

      {avisos.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
              Avisos recentes
            </h2>
            <Link
              href="/painel/aluno/avisos"
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <ul className="space-y-3">
            {avisos.slice(0, 3).map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-zinc-100/90 bg-white/95 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-zinc-900">{a.titulo}</p>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[0.65rem] font-medium text-zinc-600">
                    {new Date(a.criadoEm).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{a.mensagem}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {parcelas.length > 0 ? (
        <section className="painel-card p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Próximos módulos (financeiro)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-[0.65rem] font-semibold uppercase text-zinc-400">
                  <th className="pb-2 pr-3">Módulo</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Valor final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {parcelas.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3 font-medium text-zinc-800">#{p.moduloNumero}</td>
                    <td className="py-2 pr-3 text-zinc-600">{labelStatusParcela(p.status)}</td>
                    <td className="py-2 pr-3">{formatBRL(p.valorFinal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/painel/aluno/financeiro"
            className="mt-4 inline-flex text-sm font-semibold text-rose-600 hover:underline"
          >
            Ver financeiro completo
          </Link>
        </section>
      ) : null}
    </div>
  );
}
