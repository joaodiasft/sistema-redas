import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from "date-fns";
import type { Curso, Turma } from "@prisma/client";
import type { DiaMarker } from "@/lib/month-calendar";

const PALETTE = ["#e11d74", "#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0d9488"];

export function colorForCursoId(cursoId: string): string {
  let h = 0;
  for (let i = 0; i < cursoId.length; i++) h += cursoId.charCodeAt(i);
  return PALETTE[h % PALETTE.length];
}

/** Marcações por dia (yyyy-MM-dd) para turmas recorrentes + aulas pontuais. */
export function buildMarkersForMonth(
  ref: Date,
  turmas: (Turma & { curso: Curso })[],
  aulasPontuais: {
    data: Date;
    turma: Turma & { curso: Curso };
  }[],
): Map<string, DiaMarker[]> {
  const byDay = new Map<string, DiaMarker[]>();
  const start = startOfMonth(ref);
  const end = endOfMonth(ref);

  const push = (key: string, m: DiaMarker) => {
    const arr = byDay.get(key) ?? [];
    if (!arr.some((x) => x.label === m.label && x.cor === m.cor)) {
      arr.push(m);
      byDay.set(key, arr);
    }
  };

  for (const d of eachDayOfInterval({ start, end })) {
    const key = format(d, "yyyy-MM-dd");
    const dow = getDay(d);
    for (const t of turmas) {
      if (t.diaSemana === null || t.diaSemana !== dow) continue;
      const cor = colorForCursoId(t.cursoId);
      push(key, { cor, label: `${t.curso.nome} · ${t.codigo}` });
    }
  }

  for (const a of aulasPontuais) {
    const key = format(a.data, "yyyy-MM-dd");
    const cor = colorForCursoId(a.turma.cursoId);
    push(key, {
      cor,
      label: a.turma.curso.nome + " · " + a.turma.codigo,
    });
  }

  return byDay;
}
