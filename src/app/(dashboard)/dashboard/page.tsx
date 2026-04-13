import Link from "next/link";
import { StatsBarChart } from "@/components/dashboard/stats-bar-chart";
import { MonthCalendarView } from "@/components/dashboard/month-calendar-view";
import { PageHeader } from "@/components/admin/page-header";
import { PanelCard } from "@/components/admin/panel-card";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { prisma } from "@/lib/prisma";

function fmtMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const [avisos, turmas] = await Promise.all([
    prisma.avisoSistema.findMany({
      where: { ativo: true },
      orderBy: [{ prioridade: "desc" }, { criadoEm: "desc" }],
      take: 6,
    }),
    prisma.turma.findMany({
      where: { ativa: true },
      select: { diaSemana: true },
    }),
  ]);

  const diasSemanaTurmas = turmas.map((t) => t.diaSemana);
  const refDate = new Date();

  const cards = [
    {
      label: "Alunos cadastrados",
      value: stats.totalAlunos,
      hint: "todos os registros",
      tone: "from-violet-500/10 to-white",
    },
    {
      label: "Alunos ativos",
      value: stats.alunosAtivos,
      hint: "situação ativa",
      tone: "from-emerald-500/10 to-white",
    },
    {
      label: "Inativos",
      value: stats.alunosInativos,
      hint: "cadastro inativo",
      tone: "from-zinc-400/10 to-white",
    },
    {
      label: "Devendo",
      value: stats.alunosDevendo,
      hint: "financeiro em atraso",
      tone: "from-amber-500/12 to-white",
    },
    {
      label: "Cursos",
      value: stats.totalCursos,
      hint: "cadastros ativos",
      tone: "from-sky-500/10 to-white",
    },
    {
      label: "Turmas",
      value: stats.totalTurmas,
      hint: "turmas ativas",
      tone: "from-fuchsia-500/10 to-white",
    },
    {
      label: "Professores",
      value: stats.totalProfessores,
      hint: "cadastro",
      tone: "from-indigo-500/10 to-white",
    },
    {
      label: "Módulos",
      value: stats.totalModulos,
      hint: "semestre / grade",
      tone: "from-rose-500/10 to-white",
    },
    {
      label: "Redações entregues",
      value: stats.redacoesEntregues,
      hint: "soma das quantidades",
      tone: "from-pink-500/10 to-white",
    },
    {
      label: "Faltas (registros)",
      value: stats.faltas,
      hint: "presença ausente",
      tone: "from-orange-500/12 to-white",
    },
    {
      label: "Reposições",
      value: stats.reposicoes,
      hint: "presença + registros",
      tone: "from-cyan-500/10 to-white",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumo acadêmico, financeiro e operacional. Os números refletem os dados cadastrados no sistema."
        actions={
          <Link
            href="/dashboard/alunos"
            className="inline-flex items-center justify-center rounded-full bg-[#e11d74] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-500/25 transition hover:bg-[#c41062]"
          >
            Novo aluno
          </Link>
        }
      />
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`rounded-2xl border border-zinc-100 bg-gradient-to-br ${c.tone} p-4 shadow-sm`}
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-500">
                {c.label}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900">{c.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{c.hint}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <PanelCard className="xl:col-span-2">
            <h2 className="text-sm font-semibold text-zinc-900">Comparativo de cadastros</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Visão rápida de volumes principais (alunos, turmas, equipe e módulos).
            </p>
            <div className="mt-4">
              <StatsBarChart stats={stats} />
            </div>
          </PanelCard>

          <PanelCard>
            <h2 className="text-sm font-semibold text-zinc-900">Resumo financeiro</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-2 border-b border-zinc-100 pb-2">
                <dt className="text-zinc-500">Parcelas pendentes</dt>
                <dd className="font-semibold text-zinc-900">{stats.financeiro.parcelasPendentes}</dd>
              </div>
              <div className="flex justify-between gap-2 border-b border-zinc-100 pb-2">
                <dt className="text-zinc-500">Parcelas atrasadas</dt>
                <dd className="font-semibold text-amber-700">
                  {stats.financeiro.parcelasAtrasadas}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500">Valor pendente (ref.)</dt>
                <dd className="font-bold text-[#ad1457]">
                  {fmtMoney(stats.financeiro.valorPendente)}
                </dd>
              </div>
            </dl>
            <Link
              href="/dashboard/operacional/financeiro"
              className="mt-4 block text-center text-sm font-medium text-[#c41062] hover:underline"
            >
              Abrir financeiro por aluno →
            </Link>
          </PanelCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PanelCard>
            <h2 className="text-sm font-semibold text-zinc-900">Calendário do mês</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Destaque nos dias em que existe turma cadastrada para esse dia da semana.
            </p>
            <div className="mt-4">
              <MonthCalendarView refDate={refDate} diasSemanaTurmas={diasSemanaTurmas} />
            </div>
            <Link
              href="/dashboard/calendario-geral"
              className="mt-4 block text-center text-sm font-medium text-[#c41062] hover:underline"
            >
              Calendário geral completo →
            </Link>
          </PanelCard>

          <PanelCard>
            <h2 className="text-sm font-semibold text-zinc-900">Avisos importantes</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Mensagens internas para a equipe administrativa.
            </p>
            <ul className="mt-4 space-y-3">
              {avisos.length === 0 ? (
                <li className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-6 text-center text-sm text-zinc-500">
                  Nenhum aviso cadastrado.
                </li>
              ) : (
                avisos.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-3"
                  >
                    <p className="font-semibold text-zinc-900">{a.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{a.mensagem}</p>
                  </li>
                ))
              )}
            </ul>
          </PanelCard>
        </div>
      </div>
    </>
  );
}
