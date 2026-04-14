import { prisma } from "@/lib/prisma";
import { requireProfessorPainel } from "@/lib/painel-professor";

export default async function PainelProfessorAlunosPage() {
  const { professor } = await requireProfessorPainel();
  const vinculos = professor.turmas;

  const porTurma = await Promise.all(
    vinculos.map(async (pt) => {
      const matriculas = await prisma.matricula.findMany({
        where: { turmaId: pt.turmaId },
        include: { aluno: true },
        orderBy: { aluno: { nomeCompleto: "asc" } },
      });
      return { pt, matriculas };
    }),
  );

  if (vinculos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-teal-200/80 bg-white/90 p-8 text-center text-sm text-zinc-500">
        Nenhuma turma vinculada — não há alunos para exibir.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Alunos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Listagem por turma — apenas alunos das turmas em que você está vinculado.
        </p>
      </div>

      <div className="space-y-6">
        {porTurma.map(({ pt, matriculas }) => (
          <section
            key={pt.turmaId}
            className="overflow-hidden rounded-2xl border border-zinc-100/90 bg-white/95 shadow-sm"
          >
            <div className="border-b border-teal-100/80 bg-teal-50/50 px-4 py-4 sm:px-6">
              <h2 className="font-semibold text-zinc-900">
                {pt.turma.curso.nome} — {pt.turma.nome}
              </h2>
              <p className="text-xs text-zinc-500">
                Turma {pt.turma.codigo} · {matriculas.length} aluno(s)
              </p>
            </div>
            {matriculas.length === 0 ? (
              <p className="p-5 text-sm text-zinc-500 sm:px-6">Nenhum aluno matriculado.</p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {matriculas.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6"
                  >
                    <span className="font-medium text-zinc-900">{m.aluno.nomeCompleto}</span>
                    <span className="font-mono text-xs text-teal-800">
                      {m.aluno.codigoPublico}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
