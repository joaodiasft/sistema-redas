import { ProfessorShell } from "@/components/painel/professor/professor-shell";
import { requireProfessorPainel } from "@/lib/painel-professor";

export default async function PainelProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { professor } = await requireProfessorPainel();

  return (
    <ProfessorShell professorNome={professor.nome} professorCodigo={professor.codigoPublico}>
      {children}
    </ProfessorShell>
  );
}
