import { Bell, Megaphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAlunoPainel } from "@/lib/painel-aluno";

const nivelLabel: Record<string, string> = {
  BAIXA: "Geral",
  MEDIA: "Importante",
  ALTA: "Destaque",
};

export default async function PainelAlunoAvisosPage() {
  const { aluno } = await requireAlunoPainel();
  const turmaIds = [...new Set(aluno.matriculas.map((m) => m.turmaId))];
  const cursoIds = [...new Set(aluno.matriculas.map((m) => m.cursoId))];

  const avisos = await prisma.avisoSistema.findMany({
    where: {
      ativo: true,
      enviarAlunos: true,
      OR: [
        { paraTodasTurmas: true },
        ...(turmaIds.length ? [{ turmaId: { in: turmaIds } }] : []),
        ...(cursoIds.length ? [{ cursoId: { in: cursoIds } }] : []),
      ],
    },
    orderBy: [{ prioridade: "desc" }, { criadoEm: "desc" }],
    take: 80,
  });

  const destaque = avisos.filter((a) => a.prioridadeNivel === "ALTA" || a.prioridade >= 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Avisos</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Comunicados do curso direcionados à sua turma ou curso. Sem dados de outros alunos.
        </p>
      </div>

      {destaque.length > 0 ? (
        <section className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-rose-700">
            <Megaphone className="h-5 w-5" aria-hidden />
            <h2 className="text-sm font-bold uppercase tracking-wide">Em destaque</h2>
          </div>
          <ul className="mt-4 space-y-4">
            {destaque.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-rose-100 bg-white/90 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-zinc-900">{a.titulo}</p>
                  <time
                    className="text-xs text-zinc-500"
                    dateTime={a.criadoEm.toISOString()}
                  >
                    {new Date(a.criadoEm).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                  {a.mensagem}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-center gap-2 text-zinc-500">
          <Bell className="h-5 w-5" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wide">Todos os avisos</h2>
        </div>
        {avisos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
            Nenhum aviso disponível no momento.
          </p>
        ) : (
          <ul className="space-y-3">
            {avisos.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:border-zinc-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-lg font-semibold text-zinc-900">{a.titulo}</p>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase text-zinc-600">
                    {nivelLabel[a.prioridadeNivel] ?? a.prioridadeNivel}
                  </span>
                </div>
                <time
                  className="mt-1 block text-xs text-zinc-500"
                  dateTime={a.criadoEm.toISOString()}
                >
                  {new Date(a.criadoEm).toLocaleString("pt-BR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </time>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
                  {a.mensagem}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
