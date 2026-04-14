import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Banknote,
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  RefreshCw,
  School,
  UserMinus,
  Users,
  Users2,
  XCircle,
} from "lucide-react";
import { endOfMonth, startOfMonth } from "date-fns";
import { StatsBarChart } from "@/components/dashboard/stats-bar-chart";
import { MonthCalendarView } from "@/components/dashboard/month-calendar-view";
import { PageHeader } from "@/components/admin/page-header";
import { PanelCard } from "@/components/admin/panel-card";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { getFinanceiroExtendido } from "@/lib/finance-aggregates";
import { buildMarkersForMonth } from "@/lib/calendar-markers";
import { prisma } from "@/lib/prisma";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { DashboardFinancePanel } from "@/components/dashboard/dashboard-finance-panel";
import { DashboardAvisosPanel } from "@/components/dashboard/dashboard-avisos-panel";
import { DashboardHojeResumo } from "@/components/dashboard/dashboard-hoje-resumo";

export default async function DashboardPage() {
  const refDate = new Date();

  const [stats, fin, turmasFull, cursosList, semestreAtivo, aulasPontuaisMes] = await Promise.all([
    getDashboardStats(),
    getFinanceiroExtendido(),
    prisma.turma.findMany({
      where: { ativa: true },
      include: { curso: true },
      orderBy: [{ cursoId: "asc" }, { nome: "asc" }],
    }),
    prisma.curso.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, codigo: true },
    }),
    prisma.semestre.findFirst({
      where: { ativo: true },
      include: {
        modulos: { orderBy: { numero: "asc" }, take: 12 },
      },
    }),
    prisma.aulaAgendada.findMany({
      where: {
        data: { gte: startOfMonth(refDate), lte: endOfMonth(refDate) },
      },
      include: { turma: { include: { curso: true } } },
    }),
  ]);

  const diasSemanaTurmas = turmasFull.map((t) => t.diaSemana);
  const markers = buildMarkersForMonth(
    refDate,
    turmasFull,
    aulasPontuaisMes.map((a) => ({ data: a.data, turma: a.turma })),
  );

  const modulosTitulos =
    semestreAtivo?.modulos.map(
      (m) => m.codigoPublico ?? `Módulo ${m.numero}`,
    ) ?? [];

  const turmasForAvisos = turmasFull.map((t) => ({
    id: t.id,
    nome: t.nome,
    codigo: t.codigo,
    cursoNome: t.curso.nome,
  }));

  const pctAtivos =
    stats.totalAlunos > 0
      ? Math.round((stats.alunosAtivos / stats.totalAlunos) * 100)
      : 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão executiva: cadastros, financeiro, calendário e comunicação. Dados sincronizados com o PostgreSQL."
        actions={
          <Link
            href="/dashboard/alunos/novo"
            className="inline-flex items-center justify-center rounded-full bg-[#e11d74] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-500/25 transition hover:bg-[#c41062]"
          >
            Novo aluno
          </Link>
        }
      />
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DashboardStatCard
            label="Total de alunos"
            value={stats.totalAlunos}
            hint="Cadastro geral"
            Icon={Users}
            accent="bg-violet-500"
            trend={{ dir: "flat", label: `${pctAtivos}% ativos` }}
          />
          <DashboardStatCard
            label="Alunos ativos"
            value={stats.alunosAtivos}
            hint="Situação ativa"
            Icon={Activity}
            accent="bg-emerald-500"
          />
          <DashboardStatCard
            label="Inativos"
            value={stats.alunosInativos}
            hint="Cadastro inativo"
            Icon={UserMinus}
            accent="bg-zinc-400"
          />
          <DashboardStatCard
            label="Devendo"
            value={stats.alunosDevendo}
            hint="Situação financeira"
            Icon={AlertTriangle}
            accent="bg-amber-500"
          />
          <DashboardStatCard
            label="Turmas"
            value={stats.totalTurmas}
            hint="Turmas ativas"
            Icon={School}
            accent="bg-fuchsia-500"
          />
          <DashboardStatCard
            label="Cursos"
            value={stats.totalCursos}
            hint="Cursos ativos"
            Icon={BookOpen}
            accent="bg-sky-500"
          />
          <DashboardStatCard
            label="Professores"
            value={stats.totalProfessores}
            hint="Equipe docente"
            Icon={GraduationCap}
            accent="bg-indigo-500"
          />
          <DashboardStatCard
            label="Redações entregues"
            value={stats.redacoesEntregues}
            hint="Soma das quantidades"
            Icon={FileText}
            accent="bg-pink-500"
          />
          <DashboardStatCard
            label="Faltas"
            value={stats.faltas}
            hint="Registros de ausência"
            Icon={XCircle}
            accent="bg-orange-500"
          />
          <DashboardStatCard
            label="Reposições"
            value={stats.reposicoes}
            hint="Presença + registros"
            Icon={RefreshCw}
            accent="bg-cyan-500"
          />
          <DashboardStatCard
            label="Módulos"
            value={stats.totalModulos}
            hint="Grade do semestre"
            Icon={Layers}
            accent="bg-rose-500"
          />
          <DashboardStatCard
            label="Financeiro (pendente)"
            value={fin.totalPendente.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            hint="Parcelas em aberto"
            Icon={Banknote}
            accent="bg-[#ad1457]"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <PanelCard className="xl:col-span-2">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Comparativo de cadastros</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Legenda: cada barra mostra o volume total daquele indicador no sistema.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <StatsBarChart stats={stats} />
            </div>
          </PanelCard>

          <PanelCard>
            <h2 className="text-base font-semibold text-zinc-900">Resumo financeiro</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Integrado a parcelas por módulo e situação do aluno.
            </p>
            <div className="mt-4">
              <DashboardFinancePanel fin={fin} />
            </div>
          </PanelCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PanelCard>
            <h2 className="text-base font-semibold text-zinc-900">Calendário do mês</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Estilo agenda: cores por curso; pontos extras para aulas lançadas no calendário
              operacional.
            </p>
            <div className="mt-4">
              <MonthCalendarView
                refDate={refDate}
                diasSemanaTurmas={diasSemanaTurmas}
                markersByDay={markers}
              />
            </div>
            <DashboardHojeResumo turmas={turmasFull} modulosTitulos={modulosTitulos} />
            <Link
              href="/dashboard/calendario-geral"
              className="mt-4 block text-center text-sm font-medium text-[#c41062] hover:underline"
            >
              Calendário geral completo →
            </Link>
          </PanelCard>

          <PanelCard>
            <div className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-[#ad1457]" aria-hidden />
              <h2 className="text-base font-semibold text-zinc-900">Avisos importantes</h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Comunicação interna com prioridade e histórico. Destaque automático para urgências.
            </p>
            <div className="mt-4">
              <DashboardAvisosPanel cursos={cursosList} turmas={turmasForAvisos} />
            </div>
          </PanelCard>
        </div>
      </div>
    </>
  );
}
