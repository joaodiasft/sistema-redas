import { PenLine, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  alunoMatriculadoEmRedacao,
  isCursoRedacao,
  requireAlunoPainel,
} from "@/lib/painel-aluno";

export default async function PainelAlunoRedacoesPage() {
  const { aluno } = await requireAlunoPainel();
  const show = alunoMatriculadoEmRedacao(aluno);

  if (!show) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <PenLine className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-bold text-zinc-900">Redações</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Esta área é exibida apenas para alunos matriculados no curso de{" "}
          <strong className="text-zinc-800">Redação</strong>. Sua matrícula atual não inclui esse
          curso.
        </p>
      </div>
    );
  }

  const matriculasRedacao = aluno.matriculas.filter((m) => isCursoRedacao(m.curso));

  const entregas = await prisma.entregaRedacao.findMany({
    where: { alunoId: aluno.id },
    orderBy: { dataRegistro: "desc" },
  });

  const totalQtd = entregas.reduce((s, e) => s + e.quantidade, 0);
  const ultimas4Semanas = entregas.filter(
    (e) =>
      Date.now() - new Date(e.dataRegistro).getTime() <
      28 * 24 * 60 * 60 * 1000,
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Redações entregues</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Histórico de entregas registradas pela secretaria ou equipe pedagógica.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-emerald-800">Total (quantidade)</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">{totalQtd}</p>
          <p className="mt-1 text-xs text-emerald-800">{entregas.length} registro(s)</p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500">
            <TrendingUp className="h-5 w-5" aria-hidden />
            <span className="text-xs font-bold uppercase">Atividade recente</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900">{ultimas4Semanas}</p>
          <p className="mt-1 text-xs text-zinc-500">Entregas nos últimos 28 dias</p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-bold uppercase text-zinc-400">Turma(s) Redação</p>
          <ul className="mt-2 space-y-1 text-sm font-medium text-zinc-800">
            {matriculasRedacao.map((m) => (
              <li key={m.id}>
                {m.turma.nome} <span className="text-zinc-500">({m.turma.codigo})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-zinc-900">Histórico</h2>
        </div>
        {entregas.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">Nenhuma entrega registrada ainda.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {entregas.map((e) => (
              <li key={e.id} className="px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-zinc-900">
                    {e.quantidade} redação(ões)
                  </p>
                  <time
                    className="text-xs text-zinc-500"
                    dateTime={e.dataRegistro.toISOString()}
                  >
                    {new Date(e.dataRegistro).toLocaleString("pt-BR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {e.viaSecretaria ? (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-800">
                      Via secretaria
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                      Entrega direta
                    </span>
                  )}
                </div>
                {e.observacao ? (
                  <p className="mt-2 text-sm text-zinc-600">{e.observacao}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-sm text-sky-900">
        <strong className="font-semibold">Panorama:</strong> use o volume de entregas e a
        regularidade nos últimos dias como referência de disciplina de estudo. Para correções ou
        notas, acompanhe com o professor ou a coordenação.
      </p>
    </div>
  );
}
