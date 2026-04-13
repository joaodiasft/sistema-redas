import { SituacaoAluno, StatusParcela } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalAlunos,
    alunosAtivos,
    alunosInativos,
    alunosDevendo,
    totalCursos,
    totalTurmas,
    totalProfessores,
    totalModulos,
    entregasAgg,
    faltas,
    reposicoesPresenca,
    reposicoesRegistro,
    parcelasPendentes,
    parcelasAtrasadas,
    somaPendente,
  ] = await Promise.all([
    prisma.aluno.count(),
    prisma.aluno.count({ where: { situacao: SituacaoAluno.ATIVO } }),
    prisma.aluno.count({ where: { situacao: SituacaoAluno.INATIVO } }),
    prisma.aluno.count({ where: { situacao: SituacaoAluno.DEVENDO } }),
    prisma.curso.count({ where: { ativo: true } }),
    prisma.turma.count({ where: { ativa: true } }),
    prisma.professor.count(),
    prisma.moduloCurso.count(),
    prisma.entregaRedacao.aggregate({ _sum: { quantidade: true } }),
    prisma.presencaEncontro.count({ where: { presente: false } }),
    prisma.presencaEncontro.count({ where: { reposicao: true } }),
    prisma.reposicaoRegistro.count(),
    prisma.parcelaModulo.count({ where: { status: StatusParcela.PENDENTE } }),
    prisma.parcelaModulo.count({ where: { status: StatusParcela.ATRASADO } }),
    prisma.parcelaModulo.aggregate({
      where: {
        status: { in: [StatusParcela.PENDENTE, StatusParcela.ATRASADO] },
      },
      _sum: { valorFinal: true },
    }),
  ]);

  const valorPendenteNum = somaPendente._sum.valorFinal
    ? Number(somaPendente._sum.valorFinal)
    : 0;

  return {
    totalAlunos,
    alunosAtivos,
    alunosInativos,
    alunosDevendo,
    totalCursos,
    totalTurmas,
    totalProfessores,
    totalModulos,
    redacoesEntregues: entregasAgg._sum.quantidade ?? 0,
    faltas,
    reposicoes: reposicoesPresenca + reposicoesRegistro,
    financeiro: {
      parcelasPendentes,
      parcelasAtrasadas,
      valorPendente: valorPendenteNum,
    },
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
