import { buildMonthGrid, diasComAulaNoMes } from "@/lib/month-calendar";

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function MonthCalendarView({
  refDate,
  diasSemanaTurmas,
}: {
  refDate: Date;
  diasSemanaTurmas: (number | null)[];
}) {
  const marcados = diasComAulaNoMes(refDate, diasSemanaTurmas);
  const { cells, title } = buildMonthGrid(refDate, marcados);

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
            className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium ${
              c.foraMes
                ? "text-zinc-300"
                : c.temAulaPrevista
                  ? "bg-gradient-to-br from-[#fde7f1] to-white text-[#9d174d] ring-1 ring-[#fbcfe8]"
                  : "bg-zinc-50 text-zinc-600"
            }`}
          >
            {c.label}
            {c.temAulaPrevista && !c.foraMes ? (
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#e11d74]" />
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Dias com marca rosa: há turma agendada nesse dia da semana (conforme cadastro).
      </p>
    </div>
  );
}
