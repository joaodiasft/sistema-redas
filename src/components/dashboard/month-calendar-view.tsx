import { buildMonthGrid, diasComAulaNoMes, type DiaMarker } from "@/lib/month-calendar";

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function MonthCalendarView({
  refDate,
  diasSemanaTurmas,
  markersByDay,
}: {
  refDate: Date;
  diasSemanaTurmas: (number | null)[];
  markersByDay?: Map<string, DiaMarker[]>;
}) {
  const marcados = diasComAulaNoMes(refDate, diasSemanaTurmas);
  const { cells, title } = buildMonthGrid(refDate, marcados, markersByDay);

  return (
    <div>
      <p className="mb-3 text-center text-sm font-semibold capitalize text-zinc-800">
        {title}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-400">
        {diasSemana.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => (
          <div
            key={c.date.toISOString()}
            className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition hover:ring-2 hover:ring-[#e11d74]/20 ${
              c.foraMes
                ? "text-zinc-300"
                : c.temAulaPrevista
                  ? "bg-gradient-to-br from-white to-zinc-50 text-zinc-800 shadow-sm ring-1 ring-zinc-100"
                  : "bg-zinc-50/90 text-zinc-600"
            }`}
            title={
              c.markers.length > 0
                ? c.markers.map((m) => m.label).join(" · ")
                : c.temAulaPrevista
                  ? "Aula prevista (grade)"
                  : undefined
            }
          >
            <span>{c.label}</span>
            {c.markers.length > 0 ? (
              <div className="absolute bottom-1.5 flex max-w-[90%] justify-center gap-0.5">
                {c.markers.slice(0, 4).map((m, i) => (
                  <span
                    key={`${m.cor}-${i}`}
                    className="h-1.5 w-1.5 shrink-0 rounded-full ring-1 ring-white/80"
                    style={{ backgroundColor: m.cor }}
                  />
                ))}
              </div>
            ) : c.temAulaPrevista && !c.foraMes ? (
              <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#e11d74]/90 ring-1 ring-white" />
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        Cores por curso. Pontos indicam turmas com aula naquele dia da semana ou aulas lançadas no
        calendário.
      </p>
    </div>
  );
}
