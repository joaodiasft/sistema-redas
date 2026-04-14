import { SituacaoAluno, StatusParcela } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ValorPorRef = { nome: string; valor: number };

export async function getFinanceiroExtendido() {
  const [
    somaPago,
    somaPendente,
    inadimplentesCount,
    parcelasPendentes,
    parcelasAtrasadas,
  ] = await Promise.all([
    prisma.parcelaModulo.aggregate({
      where: { status: StatusParcela.PAGO },
      _sum: { valorFinal: true },
    }),
    prisma.parcelaModulo.aggregate({
      where: { status: { in: [StatusParcela.PENDENTE, StatusParcela.ATRASADO] } },
      _sum: { valorFinal: true },
    }),
    prisma.aluno.count({
      where: {
        OR: [
          { situacao: SituacaoAluno.DEVENDO },
          { parcelas: { some: { status: StatusParcela.ATRASADO } } },
        ],
      },
    }),
    prisma.parcelaModulo.count({ where: { status: StatusParcela.PENDENTE } }),
    prisma.parcelaModulo.count({ where: { status: StatusParcela.ATRASADO } }),
  ]);

  const pendentesDetalhe = await prisma.parcelaModulo.findMany({
    where: { status: { in: [StatusParcela.PENDENTE, StatusParcela.ATRASADO] } },
    select: {
      valorFinal: true,
      alunoId: true,
      aluno: {
        select: {
          matriculas: {
            select: {
              curso: { select: { id: true, nome: true } },
              turma: { select: { id: true, nome: true, codigo: true } },
            },
          },
        },
      },
    },
  });

  const porCurso = new Map<string, number>();
  const porTurma = new Map<string, number>();

  for (const p of pendentesDetalhe) {
    const v = p.valorFinal ? Number(p.valorFinal) : 0;
    const mats = p.aluno.matriculas;
    if (mats.length === 0) {
      const k = "Sem matrícula ativa";
      porCurso.set(k, (porCurso.get(k) ?? 0) + v);
      porTurma.set(k, (porTurma.get(k) ?? 0) + v);
      continue;
    }
    const n = mats.length;
    const parte = v / n;
    for (const m of mats) {
      const ck = m.curso.nome;
      porCurso.set(ck, (porCurso.get(ck) ?? 0) + parte);
      const tk = `${m.turma.codigo} · ${m.turma.nome}`;
      porTurma.set(tk, (porTurma.get(tk) ?? 0) + parte);
    }
  }

  const valorPago = somaPago._sum.valorFinal ? Number(somaPago._sum.valorFinal) : 0;
  const valorPendenteTotal = somaPendente._sum.valorFinal
    ? Number(somaPendente._sum.valorFinal)
    : 0;

  const valorPorCurso: ValorPorRef[] = [...porCurso.entries()]
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);
  const valorPorTurma: ValorPorRef[] = [...porTurma.entries()]
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);

  return {
    totalRecebido: valorPago,
    totalPendente: valorPendenteTotal,
    /** Referência: soma em aberto (sem vencimento explícito no modelo). */
    previsaoMesReferencia: valorPendenteTotal,
    alunosInadimplentes: inadimplentesCount,
    parcelasPendentes,
    parcelasAtrasadas,
    valorPorCurso,
    valorPorTurma,
  };
}
