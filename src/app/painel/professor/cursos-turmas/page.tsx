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
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        Nenhuma turma vinculada ao seu cadastro.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Cursos e turmas</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Somente turmas associadas ao seu perfil — visualização.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[0.65rem] font-semibold uppercase text-zinc-500">
            <tr>
              <th className="px-5 py-3 sm:px-6">Curso</th>
              <th className="px-3 py-3">Cód. curso</th>
              <th className="px-3 py-3">Turma</th>
              <th className="px-3 py-3">Cód. turma</th>
              <th className="px-3 py-3">Alunos</th>
              <th className="px-3 py-3">Início</th>
              <th className="px-3 py-3">Fim</th>
              <th className="px-3 py-3">Dia</th>
              <th className="px-5 py-3 sm:px-6">Classe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {vinculos.map((pt, i) => {
              const t = pt.turma;
              const c = t.curso;
              return (
                <tr key={pt.turmaId} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-3 font-medium text-zinc-900 sm:px-6">{c.nome}</td>
                  <td className="px-3 py-3 font-mono text-xs text-indigo-700">{c.codigo}</td>
                  <td className="px-3 py-3 text-zinc-800">{t.nome}</td>
                  <td className="px-3 py-3 font-mono text-xs font-semibold text-zinc-700">
                    {t.codigo}
                  </td>
                  <td className="px-3 py-3 font-semibold text-zinc-900">{counts[i]}</td>
                  <td className="px-3 py-3 text-zinc-600">{t.horaInicio ?? "—"}</td>
                  <td className="px-3 py-3 text-zinc-600">{t.horaFim ?? "—"}</td>
                  <td className="px-3 py-3 text-zinc-600">{labelDiaSemana(t.diaSemana)}</td>
                  <td className="px-5 py-3 text-zinc-600 sm:px-6">
                    {labelClasseTurma(t.classe)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
