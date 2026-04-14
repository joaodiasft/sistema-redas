import { AlunoShell } from "@/components/painel/aluno/aluno-shell";
import {
  alunoMatriculadoEmRedacao,
  requireAlunoPainel,
} from "@/lib/painel-aluno";

export default async function PainelAlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { aluno } = await requireAlunoPainel();
  const showRedacoes = alunoMatriculadoEmRedacao(aluno);

  return (
    <AlunoShell
      alunoNome={aluno.nomeCompleto}
      alunoCodigo={aluno.codigoPublico}
      showRedacoes={showRedacoes}
    >
      {children}
    </AlunoShell>
  );
}
