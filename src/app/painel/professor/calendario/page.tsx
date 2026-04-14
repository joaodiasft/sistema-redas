import { ProfessorCalendarioClient } from "@/components/painel/professor/professor-calendario-client";
import { requireProfessorPainel } from "@/lib/painel-professor";

export default async function PainelProfessorCalendarioPage() {
  const { professor } = await requireProfessorPainel();
  const turmas = professor.turmas.map((pt) => pt.turma);

  if (turmas.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-teal-200/80 bg-white/90 p-8 text-center text-sm text-zinc-500">
        Sem turmas vinculadas — calendário indisponível.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Calendário de aulas
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Grade recorrente das suas turmas + aulas extras registradas no sistema (somente leitura).
        </p>
      </div>
      <ProfessorCalendarioClient turmas={turmas} />
    </div>
  );
}
