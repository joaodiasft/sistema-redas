import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ProfessorRelatoriosClient,
  type RelatorioProfessorPayload,
} from "@/components/painel/professor/professor-relatorios-client";
import { prisma } from "@/lib/prisma";
import {
  labelClasseTurma,
  labelDiaSemana,
  requireProfessorPainel,
  turmaIdsDoProfessor,
} from "@/lib/painel-professor";

export default async function PainelProfessorRelatoriosPage() {
  const { professor } = await requireProfessorPainel();
  const turmaIds = turmaIdsDoProfessor(professor);
  const now = new Date();
  const inicioMes = startOfMonth(now);
  const fimMes = endOfMonth(now);
  const mesRef = format(now, "MMMM yyyy", { locale: ptBR });

  if (turmaIds.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-teal-200/80 bg-white/90 p-8 text-center text-sm text-zinc-500">
        Sem turmas vinculadas — relatórios indisponíveis.
      </p>
    );
  }

  const [counts, aulasMes, matriculasPorTurma] = await Promise.all([
    Promise.all(
      professor.turmas.map((pt) =>
        prisma.matricula.count({ where: { turmaId: pt.turmaId } }),
      ),
    ),
    prisma.aulaAgendada.findMany({
      where: {
        turmaId: { in: turmaIds },
        data: { gte: inicioMes, lte: fimMes },
      },
      include: {
        turma: { include: { curso: true } },
        modulo: true,
      },
      orderBy: { data: "asc" },
    }),
    Promise.all(
      professor.turmas.map(async (pt) => {
        const matriculas = await prisma.matricula.findMany({
          where: { turmaId: pt.turmaId },
          include: { aluno: true },
          orderBy: { aluno: { nomeCompleto: "asc" } },
        });
        return { pt, matriculas };
      }),
    ),
  ]);

  const turmasPayload = professor.turmas.map((pt, i) => {
    const t = pt.turma;
    const c = t.curso;
    return {
      cursoNome: c.nome,
      cursoCodigo: c.codigo,
      turmaNome: t.nome,
      turmaCodigo: t.codigo,
      diaSemana: labelDiaSemana(t.diaSemana),
      horaInicio: t.horaInicio,
      horaFim: t.horaFim,
      classe: labelClasseTurma(t.classe),
      alunosCount: counts[i],
    };
  });

  const alunosPorTurma = matriculasPorTurma.map(({ pt, matriculas }) => ({
    turmaLabel: `${pt.turma.curso.nome} — ${pt.turma.nome} (${pt.turma.codigo})`,
    alunos: matriculas.map((m) => ({
      nome: m.aluno.nomeCompleto,
      codigo: m.aluno.codigoPublico,
    })),
  }));

  const frequenciaPorTurma = await Promise.all(
    matriculasPorTurma.map(async ({ pt, matriculas }) => {
      const alunoIds = matriculas.map((m) => m.alunoId);
      const pres =
        alunoIds.length > 0
          ? await prisma.presencaEncontro.findMany({
              where: { alunoId: { in: alunoIds } },
              select: { alunoId: true, presente: true },
            })
          : [];
      const map = new Map<string, { total: number; pres: number }>();
      for (const p of pres) {
        const cur = map.get(p.alunoId) ?? { total: 0, pres: 0 };
        cur.total += 1;
        if (p.presente) cur.pres += 1;
        map.set(p.alunoId, cur);
      }
      const linhas = matriculas.map((m) => {
        const st = map.get(m.alunoId) ?? { total: 0, pres: 0 };
        const fal = st.total - st.pres;
        const pct = st.total > 0 ? `${Math.round((st.pres / st.total) * 100)}%` : "—";
        return {
          nome: m.aluno.nomeCompleto,
          codigo: m.aluno.codigoPublico,
          presencas: st.pres,
          faltas: fal,
          pct,
        };
      });
      return {
        turmaLabel: `${pt.turma.curso.nome} — ${pt.turma.nome} (${pt.turma.codigo})`,
        linhas,
      };
    }),
  );

  const payload: RelatorioProfessorPayload = {
    professor: {
      nome: professor.nome,
      codigoPublico: professor.codigoPublico,
      materia: professor.materia,
    },
    mesRef,
    turmas: turmasPayload,
    alunosPorTurma,
    frequenciaPorTurma,
    aulasMes: aulasMes.map((a) => ({
      dataStr: format(a.data, "dd/MM/yyyy HH:mm", { locale: ptBR }),
      curso: a.turma.curso.nome,
      turma: a.turma.nome,
      codigoTurma: a.turma.codigo,
      modulo: a.modulo
        ? a.modulo.codigoPublico ?? `Modulo ${a.modulo.numero}`
        : "—",
      titulo: a.titulo ?? "—",
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Relatórios
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Exporte PDFs apenas com dados das turmas e alunos vinculados ao seu perfil.
        </p>
      </div>
      <ProfessorRelatoriosClient data={payload} />
    </div>
  );
}
