import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type DiaCalendario = {
  date: Date;
  label: string;
  diaSemana: number;
  temAulaPrevista: boolean;
  foraMes: boolean;
};

const weekOpts = { weekStartsOn: 1 as const };

export function buildMonthGrid(
  ref: Date,
  diasComAula: Set<string>,
): { cells: DiaCalendario[]; title: string } {
  const monthStart = startOfMonth(ref);
  const monthEnd = endOfMonth(ref);
  const title = format(ref, "MMMM yyyy", { locale: ptBR });

  const gridStart = startOfWeek(monthStart, weekOpts);
  const gridEnd = endOfWeek(monthEnd, weekOpts);

  const cells: DiaCalendario[] = [];

  for (const d of eachDayOfInterval({ start: gridStart, end: gridEnd })) {
    const key = format(d, "yyyy-MM-dd");
    const noMes = isWithinInterval(d, { start: monthStart, end: monthEnd });
    cells.push({
      date: d,
      label: format(d, "d"),
      diaSemana: getDay(d),
      temAulaPrevista: diasComAula.has(key),
      foraMes: !noMes,
    });
  }

  return { cells, title };
}

/** Marca dias do mês em que existe turma com aula nesse dia da semana. */
export function diasComAulaNoMes(
  ref: Date,
  diasSemanaTurmas: (number | null)[],
): Set<string> {
  const set = new Set<string>();
  const start = startOfMonth(ref);
  const end = endOfMonth(ref);
  const dias = new Set(
    diasSemanaTurmas.filter((d): d is number => d !== null && d >= 0 && d <= 6),
  );
  for (const d of eachDayOfInterval({ start, end })) {
    if (dias.has(getDay(d))) {
      set.add(format(d, "yyyy-MM-dd"));
    }
  }
  return set;
}
