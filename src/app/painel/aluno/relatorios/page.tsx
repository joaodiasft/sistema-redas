import {
  AlunoRelatoriosClient,
  type RelatorioAlunoPayload,
} from "@/components/painel/aluno/aluno-relatorios-client";
import { prisma } from "@/lib/prisma";
import {
  alunoMatriculadoEmRedacao,
  requireAlunoPainel,
} from "@/lib/painel-aluno";

export default async function PainelAlunoRelatoriosPage() {
  const { aluno } = await requireAlunoPainel();
  const showRedacao = alunoMatriculadoEmRedacao(aluno);

  const [parcelas, presencas, entregas] = await Promise.all([
    prisma.parcelaModulo.findMany({
      where: { alunoId: aluno.id },
      orderBy: { moduloNumero: "asc" },
    }),
    prisma.presencaEncontro.findMany({
      where: { alunoId: aluno.id },
      orderBy: { dataAula: "desc" },
      include: { encontro: { include: { modulo: true } } },
    }),
    showRedacao
      ? prisma.entregaRedacao.findMany({
          where: { alunoId: aluno.id },
          orderBy: { dataRegistro: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const payload: RelatorioAlunoPayload = {
    aluno: {
      nomeCompleto: aluno.nomeCompleto,
      codigoPublico: aluno.codigoPublico,
      emailContato: aluno.emailContato,
      situacao: aluno.situacao,
      tipoPlano: aluno.tipoPlano,
      diaPagamento: aluno.diaPagamento,
    },
    matriculas: aluno.matriculas.map((m) => ({
      curso: m.curso.nome,
      turma: m.turma.nome,
      codigoTurma: m.turma.codigo,
    })),
    parcelas: parcelas.map((p) => ({
      moduloNumero: p.moduloNumero,
      status: p.status,
      valorBase: p.valorBase != null ? String(p.valorBase) : null,
      desconto: p.desconto != null ? String(p.desconto) : null,
      valorFinal: p.valorFinal != null ? String(p.valorFinal) : null,
      pagoEm: p.pagoEm ? p.pagoEm.toISOString() : null,
    })),
    presencas: presencas.map((p) => {
      const mod = p.encontro.modulo;
      const modLabel =
        mod.codigoPublico ?? `Modulo ${mod.numero}${mod.titulo ? ` - ${mod.titulo}` : ""}`;
      return {
        data: new Date(p.dataAula).toLocaleDateString("pt-BR"),
        modulo: modLabel,
        encontro: p.encontro.rotulo,
        presente: p.presente,
        reposicao: p.reposicao,
      };
    }),
    entregas: entregas.map((e) => ({
      data: new Date(e.dataRegistro).toLocaleString("pt-BR"),
      quantidade: e.quantidade,
      viaSecretaria: e.viaSecretaria,
      observacao: e.observacao,
    })),
    showRedacao,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Relatórios</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Gere PDFs apenas com as suas informações — prontos para guardar ou imprimir.
        </p>
      </div>
      <AlunoRelatoriosClient data={payload} />
    </div>
  );
}
