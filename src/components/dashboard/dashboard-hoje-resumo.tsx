import { format, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Curso, Turma } from "@prisma/client";

type TurmaRow = Turma & { curso: Curso };

export function DashboardHojeResumo({
  turmas,
  modulosTitulos,
}: {
  turmas: TurmaRow[];
  modulosTitulos: string[];
}) {
  const hoje = new Date();
  const dow = getDay(hoje);
  const lista = turmas.filter((t) => t.diaSemana === dow);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {format(hoje, "EEEE, d 'de' MMMM", { locale: ptBR })}
      </p>
      {lista.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-4 text-sm text-zinc-500">
          Nenhuma turma com aula recorrente neste dia da semana.
        </p>
      ) : (
        <ul className="space-y-2">
          {lista.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <span className="font-medium text-zinc-900">{t.curso.nome}</span>
              <span className="text-zinc-600">
                {t.nome} · {t.horaInicio ?? "—"}–{t.horaFim ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
          Módulos ativos (semestre)
        </p>
        {modulosTitulos.length === 0 ? (
          <p className="mt-1 text-xs text-zinc-400">Nenhum módulo listado.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {modulosTitulos.map((m) => (
              <li
                key={m}
                className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[0.7rem] font-medium text-violet-900 ring-1 ring-violet-100"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
