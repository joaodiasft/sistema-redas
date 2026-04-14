import { ProfessorCalendarioClient } from "@/components/painel/professor/professor-calendario-client";
import { requireProfessorPainel } from "@/lib/painel-professor";

export default async function PainelProfessorCalendarioPage() {
  const { professor } = await requireProfessorPainel();
  const turmas = professor.turmas.map((pt) => pt.turma);

  if (turmas.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        Sem turmas vinculadas — calendário indisponível.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Calendário de aulas</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Grade recorrente das suas turmas + aulas extras registradas no sistema (somente leitura).
        </p>
      </div>
      <ProfessorCalendarioClient turmas={turmas} />
    </div>
  );
}
