import { Prisma, SituacaoAluno, StatusParcela } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type TipoRelatorio = "geral" | "curso" | "turma" | "aluno";

export type RelatorioPayload = {
  geradoEm: string;
  tipo: TipoRelatorio;
  filtros: {
    cursoId?: string | null;
    turmaId?: string | null;
    alunoId?: string | null;
    situacao?: SituacaoAluno | "TODOS";
  };
  resumo: {
    totalAlunos: number;
    ativos: number;
    inativos: number;
    devendo: number;
    turmas: number;
    cursos: number;
    professores: number;
    parcelasPendentes: number;
    parcelasAtrasadas: number;
    redacoes: number;
  };
  alunos: {
    codigo: string;
    nome: string;
    email: string;
    situacao: string;
    cursos: string;
    turmas: string;
  }[];
};

export async function montarRelatorio(opts: {
  tipo: TipoRelatorio;
  cursoId?: string | null;
  turmaId?: string | null;
  alunoId?: string | null;
  situacao?: SituacaoAluno | "TODOS";
}): Promise<RelatorioPayload> {
  const parts: Prisma.AlunoWhereInput[] = [];

  if (opts.situacao && opts.situacao !== "TODOS") {
    parts.push({ situacao: opts.situacao });
  }

  if (opts.tipo === "aluno" && opts.alunoId) {
    parts.push({ id: opts.alunoId });
  } else if (opts.tipo === "turma" && opts.turmaId) {
    parts.push({ matriculas: { some: { turmaId: opts.turmaId } } });
  } else if (opts.tipo === "curso" && opts.cursoId) {
    parts.push({ matriculas: { some: { cursoId: opts.cursoId } } });
  } else {
    if (opts.cursoId) {
      parts.push({ matriculas: { some: { cursoId: opts.cursoId } } });
    }
    if (opts.turmaId) {
      parts.push({ matriculas: { some: { turmaId: opts.turmaId } } });
    }
  }

  const where: Prisma.AlunoWhereInput = parts.length > 0 ? { AND: parts } : {};

  const [
    alunosRows,
    ativos,
    inativos,
    devendo,
    totalTurmas,
    totalCursos,
    totalProfessores,
    parcelasPendentes,
    parcelasAtrasadas,
    redSum,
  ] = await Promise.all([
    prisma.aluno.findMany({
      where,
      orderBy: { nomeCompleto: "asc" },
      include: {
        matriculas: { include: { curso: true, turma: true } },
      },
    }),
    prisma.aluno.count({ where: { ...where, situacao: SituacaoAluno.ATIVO } }),
    prisma.aluno.count({ where: { ...where, situacao: SituacaoAluno.INATIVO } }),
    prisma.aluno.count({ where: { ...where, situacao: SituacaoAluno.DEVENDO } }),
    prisma.turma.count({ where: { ativa: true } }),
    prisma.curso.count({ where: { ativo: true } }),
    prisma.professor.count(),
    prisma.parcelaModulo.count({ where: { status: StatusParcela.PENDENTE } }),
    prisma.parcelaModulo.count({ where: { status: StatusParcela.ATRASADO } }),
    prisma.entregaRedacao.aggregate({ _sum: { quantidade: true } }),
  ]);

  const alunos = alunosRows.map((a) => ({
    codigo: a.codigoPublico,
    nome: a.nomeCompleto,
    email: a.emailContato,
    situacao: a.situacao,
    cursos: a.matriculas.map((m) => m.curso.nome).join(", ") || "—",
    turmas: a.matriculas.map((m) => `${m.turma.codigo}`).join(", ") || "—",
  }));

  return {
    geradoEm: new Date().toISOString(),
    tipo: opts.tipo,
    filtros: {
      cursoId: opts.cursoId,
      turmaId: opts.turmaId,
      alunoId: opts.alunoId,
      situacao: opts.situacao ?? "TODOS",
    },
    resumo: {
      totalAlunos: alunosRows.length,
      ativos,
      inativos,
      devendo,
      turmas: totalTurmas,
      cursos: totalCursos,
      professores: totalProfessores,
      parcelasPendentes,
      parcelasAtrasadas,
      redacoes: redSum._sum.quantidade ?? 0,
    },
    alunos,
  };
}
