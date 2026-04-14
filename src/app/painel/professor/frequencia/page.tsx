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
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Frequência por turma</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Consulta de presenças e percentual — somente turmas vinculadas a você.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {professor.turmas.map((pt) => {
          const on = pt.turmaId === turmaId;
          return (
            <Link
              key={pt.turmaId}
              href={`/painel/professor/frequencia?turma=${pt.turmaId}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                on
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-indigo-200"
              }`}
            >
              {pt.turma.codigo}
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-indigo-50/40 px-4 py-3 text-sm text-indigo-950">
        <strong className="font-semibold">{turmaAtual.turma.curso.nome}</strong>
        {" — "}
        {turmaAtual.turma.nome}
      </div>

      {matriculas.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhum aluno nesta turma.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[0.65rem] font-semibold uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3 sm:px-6">Aluno</th>
                <th className="px-3 py-3">Código</th>
                <th className="px-3 py-3">Presenças</th>
                <th className="px-3 py-3">Faltas</th>
                <th className="px-5 py-3 sm:px-6">% freq.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {matriculas.map((m) => {
                const st = map.get(m.alunoId) ?? { total: 0, pres: 0 };
                const faltas = st.total - st.pres;
                const pct =
                  st.total > 0 ? Math.round((st.pres / st.total) * 100) : null;
                return (
                  <tr key={m.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900 sm:px-6">
                      {m.aluno.nomeCompleto}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-indigo-700">
                      {m.aluno.codigoPublico}
                    </td>
                    <td className="px-3 py-3 text-emerald-700">{st.pres}</td>
                    <td className="px-3 py-3 text-zinc-600">{faltas}</td>
                    <td className="px-5 py-3 font-semibold text-zinc-900 sm:px-6">
                      {pct !== null ? `${pct}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
