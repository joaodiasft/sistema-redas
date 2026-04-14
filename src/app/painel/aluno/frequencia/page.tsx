import { CalendarDays, RefreshCw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAlunoPainel } from "@/lib/painel-aluno";

export default async function PainelAlunoFrequenciaPage() {
  const { aluno } = await requireAlunoPainel();

  const [presencas, reposicoes] = await Promise.all([
    prisma.presencaEncontro.findMany({
      where: { alunoId: aluno.id },
      orderBy: { dataAula: "desc" },
      include: {
        encontro: { include: { modulo: true } },
      },
    }),
    prisma.reposicaoRegistro.findMany({
      where: { alunoId: aluno.id },
      orderBy: { dataReposicao: "desc" },
      take: 50,
    }),
  ]);

  const total = presencas.length;
  const presentes = presencas.filter((p) => p.presente).length;
  const faltas = total - presentes;
  const pct = total > 0 ? Math.round((presentes / total) * 100) : null;

  const turmaLabels = aluno.matriculas.map(
    (m) => `${m.curso.nome} — ${m.turma.nome}`,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Frequência</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Registros de presença por encontro e módulo. Dados lançados pela equipe do curso.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">Turma(s)</p>
          <p className="mt-2 text-sm font-medium text-zinc-900">
            {turmaLabels.length ? turmaLabels.join(" · ") : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-800">Presenças</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">{presentes}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-rose-800">Faltas</p>
          <p className="mt-2 text-3xl font-bold text-rose-900">{faltas}</p>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-violet-800">Percentual</p>
          <p className="mt-2 text-3xl font-bold text-violet-900">{pct !== null ? `${pct}%` : "—"}</p>
          <p className="mt-1 text-xs text-violet-800">{total} registro(s)</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4 sm:px-6">
          <CalendarDays className="h-5 w-5 text-zinc-400" aria-hidden />
          <h2 className="font-semibold text-zinc-900">Histórico de aulas</h2>
        </div>
        {presencas.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">Ainda não há presenças registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.65rem] font-semibold uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Data</th>
                  <th className="px-3 py-3">Módulo</th>
                  <th className="px-3 py-3">Encontro</th>
                  <th className="px-3 py-3">Presença</th>
                  <th className="px-5 py-3 sm:px-6">Reposição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {presencas.map((p) => {
                  const mod = p.encontro.modulo;
                  const modLabel =
                    mod.codigoPublico ?? `Módulo ${mod.numero}${mod.titulo ? ` — ${mod.titulo}` : ""}`;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/50">
                      <td className="whitespace-nowrap px-5 py-3 text-zinc-800 sm:px-6">
                        {new Date(p.dataAula).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-3 py-3 text-zinc-700">{modLabel}</td>
                      <td className="px-3 py-3 text-zinc-700">{p.encontro.rotulo}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            p.presente
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {p.presente ? "Presente" : "Falta"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-600 sm:px-6">
                        {p.reposicao ? "Sim" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reposicoes.length > 0 ? (
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4 sm:px-6">
            <RefreshCw className="h-5 w-5 text-violet-500" aria-hidden />
            <h2 className="font-semibold text-zinc-900">Reposições</h2>
          </div>
          <ul className="divide-y divide-zinc-100">
            {reposicoes.map((r) => (
              <li key={r.id} className="px-5 py-4 sm:px-6">
                <p className="font-medium text-zinc-900">
                  {new Date(r.dataReposicao).toLocaleDateString("pt-BR")}
                  {r.moduloRef ? (
                    <span className="ml-2 text-xs font-normal text-zinc-500">· {r.moduloRef}</span>
                  ) : null}
                </p>
                {r.descricaoFalta ? (
                  <p className="mt-1 text-sm text-zinc-600">{r.descricaoFalta}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
