import { prisma } from "@/lib/prisma";
import {
  labelClasseTurma,
  labelDiaSemana,
  requireProfessorPainel,
} from "@/lib/painel-professor";

export default async function PainelProfessorCursosTurmasPage() {
  const { professor } = await requireProfessorPainel();
  const vinculos = professor.turmas;

  const counts = await Promise.all(
    vinculos.map((pt) =>
      prisma.matricula.count({ where: { turmaId: pt.turmaId } }),
    ),
  );

  if (vinculos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-teal-200/80 bg-white/90 p-8 text-center text-sm text-zinc-500">
        Nenhuma turma vinculada ao seu cadastro.
      </p>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Cursos e turmas
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Somente turmas associadas ao seu perfil — visualização.
        </p>
      </div>

      {/* Desktop / tablet: tabela */}
      <div className="hidden overflow-x-auto rounded-2xl border border-zinc-100/90 bg-white/95 shadow-sm md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-teal-50/40 text-[0.65rem] font-semibold uppercase tracking-wide text-teal-900/70">
            <tr>
              <th className="px-5 py-3.5 lg:px-6">Curso</th>
              <th className="px-3 py-3.5">Cód. curso</th>
              <th className="px-3 py-3.5">Turma</th>
              <th className="px-3 py-3.5">Cód. turma</th>
              <th className="px-3 py-3.5">Alunos</th>
              <th className="px-3 py-3.5">Início</th>
              <th className="px-3 py-3.5">Fim</th>
              <th className="px-3 py-3.5">Dia</th>
              <th className="px-5 py-3.5 lg:px-6">Classe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {vinculos.map((pt, i) => {
              const t = pt.turma;
              const c = t.curso;
              return (
                <tr key={pt.turmaId} className="transition hover:bg-teal-50/20">
                  <td className="px-5 py-3.5 font-medium text-zinc-900 lg:px-6">{c.nome}</td>
                  <td className="px-3 py-3.5 font-mono text-xs text-teal-800">{c.codigo}</td>
                  <td className="px-3 py-3.5 text-zinc-800">{t.nome}</td>
                  <td className="px-3 py-3.5 font-mono text-xs font-semibold text-zinc-700">
                    {t.codigo}
                  </td>
                  <td className="px-3 py-3.5 font-semibold tabular-nums text-zinc-900">{counts[i]}</td>
                  <td className="px-3 py-3.5 text-zinc-600">{t.horaInicio ?? "—"}</td>
                  <td className="px-3 py-3.5 text-zinc-600">{t.horaFim ?? "—"}</td>
                  <td className="px-3 py-3.5 text-zinc-600">{labelDiaSemana(t.diaSemana)}</td>
                  <td className="px-5 py-3.5 text-zinc-600 lg:px-6">
                    {labelClasseTurma(t.classe)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="space-y-4 md:hidden">
        {vinculos.map((pt, i) => {
          const t = pt.turma;
          const c = t.curso;
          return (
            <li
              key={pt.turmaId}
              className="overflow-hidden rounded-2xl border border-zinc-100/90 bg-white/95 shadow-sm"
            >
              <div className="border-b border-teal-100/80 bg-teal-50/50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-800/90">
                  {c.nome}
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{t.nome}</p>
                <p className="mt-0.5 font-mono text-xs text-teal-800">
                  {c.codigo} · turma {t.codigo}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-3 px-4 py-4 text-sm">
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase text-zinc-400">Alunos</dt>
                  <dd className="font-semibold tabular-nums text-zinc-900">{counts[i]}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase text-zinc-400">Classe</dt>
                  <dd className="text-zinc-700">{labelClasseTurma(t.classe)}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase text-zinc-400">Dia</dt>
                  <dd className="text-zinc-700">{labelDiaSemana(t.diaSemana)}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase text-zinc-400">Horário</dt>
                  <dd className="text-zinc-700">
                    {t.horaInicio ?? "—"} – {t.horaFim ?? "—"}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
