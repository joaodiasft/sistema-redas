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
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        Nenhuma turma vinculada — não há alunos para exibir.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Alunos</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Listagem por turma — apenas alunos das turmas em que você está vinculado.
        </p>
      </div>

      <div className="space-y-6">
        {porTurma.map(({ pt, matriculas }) => (
          <section
            key={pt.turmaId}
            className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm"
          >
            <div className="border-b border-zinc-100 bg-indigo-50/50 px-5 py-4 sm:px-6">
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
                    <span className="font-mono text-xs text-indigo-700">
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
