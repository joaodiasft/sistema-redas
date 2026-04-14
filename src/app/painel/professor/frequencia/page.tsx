import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  assertTurmaDoProfessor,
  requireProfessorPainel,
  turmaIdsDoProfessor,
} from "@/lib/painel-professor";

export default async function PainelProfessorFrequenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ turma?: string }>;
}) {
  const { professor } = await requireProfessorPainel();
  const ids = turmaIdsDoProfessor(professor);
  const params = await searchParams;
  let turmaId = params.turma ?? "";
  if (!turmaId || !assertTurmaDoProfessor(professor, turmaId)) {
    turmaId = ids[0] ?? "";
  }

  if (!turmaId) {
    return (
      <p className="rounded-2xl border border-dashed border-teal-200/80 bg-white/90 p-8 text-center text-sm text-zinc-500">
        Nenhuma turma disponível para consulta de frequência.
      </p>
    );
  }

  const turmaAtual = professor.turmas.find((pt) => pt.turmaId === turmaId)!;

  const matriculas = await prisma.matricula.findMany({
    where: { turmaId },
    include: { aluno: true },
    orderBy: { aluno: { nomeCompleto: "asc" } },
  });
  const alunoIds = matriculas.map((m) => m.alunoId);

  const presencas =
    alunoIds.length > 0
      ? await prisma.presencaEncontro.findMany({
          where: { alunoId: { in: alunoIds } },
          select: { alunoId: true, presente: true },
        })
      : [];

  const map = new Map<string, { total: number; pres: number }>();
  for (const p of presencas) {
    const cur = map.get(p.alunoId) ?? { total: 0, pres: 0 };
    cur.total += 1;
    if (p.presente) cur.pres += 1;
    map.set(p.alunoId, cur);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Frequência por turma
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Consulta de presenças e percentual — somente turmas vinculadas a você.
        </p>
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {professor.turmas.map((pt) => {
          const on = pt.turmaId === turmaId;
          return (
            <Link
              key={pt.turmaId}
              href={`/painel/professor/frequencia?turma=${pt.turmaId}`}
              className={`snap-start whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition sm:py-2 ${
                on
                  ? "bg-teal-700 text-white shadow-md shadow-teal-900/10 ring-1 ring-teal-600/30"
                  : "border border-zinc-200/90 bg-white text-zinc-700 hover:border-teal-200 hover:bg-teal-50/40"
              }`}
            >
              {pt.turma.codigo}
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-teal-100/90 bg-teal-50/50 px-4 py-3 text-sm text-teal-950 sm:px-5">
        <strong className="font-semibold">{turmaAtual.turma.curso.nome}</strong>
        {" — "}
        {turmaAtual.turma.nome}
      </div>

      {matriculas.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhum aluno nesta turma.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-zinc-100/90 bg-white/95 shadow-sm md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-100 bg-teal-50/40 text-[0.65rem] font-semibold uppercase tracking-wide text-teal-900/70">
                <tr>
                  <th className="px-5 py-3.5 lg:px-6">Aluno</th>
                  <th className="px-3 py-3.5">Código</th>
                  <th className="px-3 py-3.5">Presenças</th>
                  <th className="px-3 py-3.5">Faltas</th>
                  <th className="px-5 py-3.5 lg:px-6">% freq.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {matriculas.map((m) => {
                  const st = map.get(m.alunoId) ?? { total: 0, pres: 0 };
                  const faltas = st.total - st.pres;
                  const pct =
                    st.total > 0 ? Math.round((st.pres / st.total) * 100) : null;
                  return (
                    <tr key={m.id} className="transition hover:bg-teal-50/15">
                      <td className="px-5 py-3.5 font-medium text-zinc-900 lg:px-6">
                        {m.aluno.nomeCompleto}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs text-teal-800">
                        {m.aluno.codigoPublico}
                      </td>
                      <td className="px-3 py-3.5 tabular-nums text-emerald-700">{st.pres}</td>
                      <td className="px-3 py-3.5 tabular-nums text-zinc-600">{faltas}</td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-zinc-900 lg:px-6">
                        {pct !== null ? `${pct}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {matriculas.map((m) => {
              const st = map.get(m.alunoId) ?? { total: 0, pres: 0 };
              const faltas = st.total - st.pres;
              const pct =
                st.total > 0 ? Math.round((st.pres / st.total) * 100) : null;
              return (
                <li
                  key={m.id}
                  className="rounded-2xl border border-zinc-100/90 bg-white/95 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-snug text-zinc-900">{m.aluno.nomeCompleto}</p>
                    <span className="shrink-0 font-mono text-xs text-teal-800">{m.aluno.codigoPublico}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-zinc-100 pt-3 text-center text-sm">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase text-zinc-400">Pres.</p>
                      <p className="font-semibold tabular-nums text-emerald-700">{st.pres}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase text-zinc-400">Faltas</p>
                      <p className="font-semibold tabular-nums text-zinc-600">{faltas}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase text-zinc-400">Freq.</p>
                      <p className="font-semibold tabular-nums text-zinc-900">
                        {pct !== null ? `${pct}%` : "—"}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
