import Link from "next/link";
import { addDays, endOfMonth, format, getDay, startOfDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Users,
} from "lucide-react";
import { MonthCalendarView } from "@/components/dashboard/month-calendar-view";
import { buildMarkersForMonth } from "@/lib/calendar-markers";
import { prisma } from "@/lib/prisma";
import {
  labelDiaSemana,
  requireProfessorPainel,
  turmaIdsDoProfessor,
} from "@/lib/painel-professor";

export default async function PainelProfessorDashboardPage() {
  const { professor } = await requireProfessorPainel();
  const turmaIds = turmaIdsDoProfessor(professor);
  const turmasFull = professor.turmas.map((pt) => pt.turma);
  const cursoIds = [...new Set(turmasFull.map((t) => t.cursoId))];
  const cursosCount = cursoIds.length;
  const turmasCount = turmasFull.length;

  const now = new Date();
  const inicioMes = startOfMonth(now);
  const fimMes = endOfMonth(now);
  const hoje = startOfDay(now);

  const [
    matriculasRows,
    aulasMes,
    presRows,
    avisos,
  ] = await Promise.all([
    turmaIds.length
      ? prisma.matricula.findMany({
          where: { turmaId: { in: turmaIds } },
          select: { alunoId: true },
        })
      : Promise.resolve([]),
    turmaIds.length
      ? prisma.aulaAgendada.findMany({
          where: {
            turmaId: { in: turmaIds },
            data: { gte: inicioMes, lte: fimMes },
          },
          include: { turma: { include: { curso: true } } },
        })
      : Promise.resolve([]),
    turmaIds.length
      ? prisma.matricula
          .findMany({
            where: { turmaId: { in: turmaIds } },
            select: { alunoId: true },
            distinct: ["alunoId"],
          })
          .then(async (m) => {
            const ids = m.map((x) => x.alunoId);
            if (ids.length === 0) return [];
            return prisma.presencaEncontro.findMany({
              where: { alunoId: { in: ids } },
              select: { presente: true },
            });
          })
      : Promise.resolve([]),
    turmaIds.length
      ? prisma.avisoSistema.findMany({
          where: {
            ativo: true,
            enviarProfessores: true,
            OR: [
              { paraTodasTurmas: true },
              { turmaId: { in: turmaIds } },
              ...(cursoIds.length ? [{ cursoId: { in: cursoIds } }] : []),
            ],
          },
          orderBy: [{ prioridade: "desc" }, { criadoEm: "desc" }],
          take: 6,
        })
      : Promise.resolve([]),
  ]);

  const alunoIds = [...new Set(matriculasRows.map((m) => m.alunoId))];
  const totalAlunos = alunoIds.length;
  const totalPres = presRows.length;
  const presentes = presRows.filter((p) => p.presente).length;
  const pctTurmas =
    totalPres > 0 ? Math.round((presentes / totalPres) * 100) : null;

  const aulasPontuais = aulasMes.map((a) => ({
    data: a.data,
    turma: a.turma,
  }));
  const markers = buildMarkersForMonth(now, turmasFull, aulasPontuais);

  type ProxItem = { data: Date; titulo: string; subtitulo: string };
  const proximos: ProxItem[] = [];
  for (let i = 0; i < 14; i++) {
    const d = addDays(hoje, i);
    const dow = getDay(d);
    for (const t of turmasFull) {
      if (t.diaSemana === null || t.diaSemana !== dow) continue;
      proximos.push({
        data: d,
        titulo: `${t.curso.nome} — ${t.nome}`,
        subtitulo: `${labelDiaSemana(dow)} · ${t.horaInicio ?? "?"}–${t.horaFim ?? "?"}`,
      });
    }
  }
  const extrasProximas = await prisma.aulaAgendada.findMany({
    where: {
      turmaId: { in: turmaIds },
      data: { gte: hoje, lte: addDays(hoje, 14) },
    },
    include: { turma: { include: { curso: true } }, modulo: true },
    orderBy: { data: "asc" },
    take: 30,
  });
  for (const a of extrasProximas) {
    proximos.push({
      data: a.data,
      titulo: a.titulo ?? `Aula · ${a.turma.curso.nome} ${a.turma.codigo}`,
      subtitulo: format(a.data, "dd/MM HH:mm", { locale: ptBR }),
    });
  }
  proximos.sort((a, b) => a.data.getTime() - b.data.getTime());
  const proximosUnicos = proximos.slice(0, 8);

  const quick = [
    {
      href: "/painel/professor/cursos-turmas",
      label: "Cursos e turmas",
      desc: "Suas turmas vinculadas",
      icon: GraduationCap,
      className:
        "from-teal-500/15 to-teal-600/5 text-teal-900 border-teal-100",
    },
    {
      href: "/painel/professor/alunos",
      label: "Alunos",
      desc: "Por turma",
      icon: Users,
      className: "from-violet-500/10 to-violet-600/5 text-violet-800 border-violet-100",
    },
    {
      href: "/painel/professor/frequencia",
      label: "Frequência",
      desc: "Consulta por turma",
      icon: ClipboardCheck,
      className: "from-emerald-500/10 to-emerald-600/5 text-emerald-800 border-emerald-100",
    },
    {
      href: "/painel/professor/calendario",
      label: "Calendário",
      desc: "Aulas do mês",
      icon: CalendarDays,
      className: "from-sky-500/10 to-sky-600/5 text-sky-800 border-sky-100",
    },
    {
      href: "/painel/professor/relatorios",
      label: "Relatórios",
      desc: "Exportar PDF",
      icon: BarChart3,
      className: "from-rose-500/10 to-rose-600/5 text-rose-800 border-rose-100",
    },
  ];

  if (turmaIds.length === 0) {
    return (
      <div className="painel-card-hero border-dashed border-teal-200/80 bg-white/90 p-8 text-center sm:p-10">
        <GraduationCap className="mx-auto h-12 w-12 text-teal-400" aria-hidden />
        <h1 className="mt-4 font-display text-xl font-semibold text-zinc-900">Nenhuma turma vinculada</h1>
        <p className="painel-prose-muted mx-auto mt-3">
          Peça à secretaria para associar turmas ao seu cadastro de professor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="painel-card-hero relative overflow-hidden bg-gradient-to-br from-teal-50/90 via-white to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700/90">
            Painel pedagógico
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Olá, {professor.nome.split(" ")[0]}
          </h1>
          <p className="painel-prose-muted mt-2">
            Visualização das suas turmas e alunos — sem edição. Dados restritos ao seu vínculo na
            plataforma.
          </p>
          <p className="mt-3 text-xs font-medium text-zinc-600">
            {professor.materia} · {professor.codigoPublico}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
          Visão geral
        </h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="painel-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Cursos</p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-zinc-900">{cursosCount}</p>
            <p className="mt-1 text-xs text-zinc-600">Nos quais você leciona</p>
          </div>
          <div className="painel-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Turmas</p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-zinc-900">{turmasCount}</p>
            <p className="mt-1 text-xs text-zinc-600">Turmas vinculadas a você</p>
          </div>
          <div className="painel-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Alunos</p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-zinc-900">{totalAlunos}</p>
            <p className="mt-1 text-xs text-zinc-600">Matrículas nas suas turmas</p>
          </div>
          <div className="painel-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Aulas extras (mês)</p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-zinc-900">{aulasMes.length}</p>
            <p className="mt-1 text-xs text-zinc-600">Lançamentos no calendário · {format(now, "MMMM yyyy", { locale: ptBR })}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="painel-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
            <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
            Frequência geral (suas turmas)
          </h2>
          <p className="mt-4 text-4xl font-bold tabular-nums text-zinc-900">
            {pctTurmas !== null ? `${pctTurmas}%` : "—"}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {totalPres > 0
              ? `${presentes} presenças em ${totalPres} registros (todos os alunos das suas turmas)`
              : "Ainda não há registros de presença."}
          </p>
          {pctTurmas !== null ? (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{ width: `${Math.min(100, pctTurmas)}%` }}
              />
            </div>
          ) : null}
        </div>

        <div className="painel-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            Próximos dias
          </h2>
          <ul className="mt-4 space-y-3">
            {proximosUnicos.length === 0 ? (
              <li className="text-sm text-zinc-500">Sem aulas previstas nos próximos 14 dias.</li>
            ) : (
              proximosUnicos.map((p, i) => (
                <li
                  key={`${p.data.toISOString()}-${i}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-zinc-50 bg-zinc-50/50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{p.titulo}</p>
                    <p className="text-xs text-zinc-500">{p.subtitulo}</p>
                  </div>
                  <time className="shrink-0 text-xs font-semibold text-teal-700">
                    {format(p.data, "dd/MM", { locale: ptBR })}
                  </time>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="painel-card p-4 sm:p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
            Calendário do mês (resumo)
          </h2>
          <MonthCalendarView
            refDate={now}
            diasSemanaTurmas={turmasFull.map((t) => t.diaSemana)}
            markersByDay={markers}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">Avisos</h2>
          {avisos.length === 0 ? (
            <p className="painel-card p-5 text-sm text-zinc-600">
              Nenhum aviso no momento.
            </p>
          ) : (
            <ul className="space-y-3">
              {avisos.slice(0, 4).map((a) => (
                <li
                  key={a.id}
                  className="rounded-2xl border border-amber-100/80 bg-amber-50/40 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-amber-800">
                    <Bell className="h-4 w-4 shrink-0" aria-hidden />
                    <p className="text-sm font-semibold text-zinc-900">{a.titulo}</p>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs text-zinc-600">{a.mensagem}</p>
                  <p className="mt-2 text-[0.65rem] text-zinc-400">
                    {format(a.criadoEm, "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
                className={`painel-interactive painel-focus-ring-prof group flex items-center gap-4 rounded-2xl border bg-gradient-to-br p-5 shadow-sm motion-safe:transition-[box-shadow,transform] motion-safe:duration-200 hover:shadow-md motion-safe:hover:-translate-y-px ${q.className}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{q.label}</p>
                  <p className="text-xs text-zinc-600">{q.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
