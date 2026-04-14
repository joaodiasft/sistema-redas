"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { MonthCalendarView } from "@/components/dashboard/month-calendar-view";
import { buildMarkersForMonth } from "@/lib/calendar-markers";
import type { Curso, Turma } from "@prisma/client";

type TurmaRow = Turma & { curso: Curso };

type ModuloMini = {
  id: string;
  codigoPublico: string | null;
  numero: number;
  titulo: string | null;
} | null;

type AulaApi = {
  id: string;
  data: string;
  titulo: string | null;
  observacao: string | null;
  turma: TurmaRow;
  modulo: ModuloMini;
};

const inputClass =
  "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export function ProfessorCalendarioClient({ turmas }: { turmas: TurmaRow[] }) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const [mes, setMes] = useState(() => format(new Date(), "yyyy-MM"));
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `/api/painel-professor/aulas?mes=${encodeURIComponent(`${mes}-01`)}`,
        { credentials: "include", cache: "no-store" },
      );
      if (!r.ok) {
        setError("Não foi possível carregar o calendário.");
        setAulas([]);
        return;
      }
      const j = (await r.json()) as { aulas: AulaApi[] };
      setAulas(j.aulas ?? []);
    } catch {
      setError("Erro de rede.");
      setAulas([]);
    } finally {
      setLoading(false);
    }
  }, [mes]);

  useEffect(() => {
    void load();
  }, [load]);

  const atualizarTudo = useCallback(() => {
    startRefresh(() => {
      router.refresh();
      void load();
    });
  }, [router, load]);

  const refDate = useMemo(() => {
    const [y, m] = mes.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, 1);
  }, [mes]);

  const aulasPont = useMemo(
    () => aulas.map((a) => ({ data: parseISO(a.data), turma: a.turma })),
    [aulas],
  );

  const markers = useMemo(
    () => buildMarkersForMonth(refDate, turmas, aulasPont),
    [refDate, turmas, aulasPont],
  );

  if (turmas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <CalendarDays className="h-4 w-4 text-indigo-600" aria-hidden />
          Mês
          <input
            type="month"
            className={inputClass + " w-auto"}
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          />
        </label>
        {loading ? (
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Atualizando…
          </span>
        ) : null}
        <button
          type="button"
          onClick={atualizarTudo}
          disabled={loading || isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 text-indigo-600 ${loading || isRefreshing ? "animate-spin" : ""}`}
            aria-hidden
          />
          Atualizar
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <MonthCalendarView
            refDate={refDate}
            diasSemanaTurmas={turmas.map((t) => t.diaSemana)}
            markersByDay={markers}
          />
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Aulas lançadas no mês</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Inclui aulas extras do calendário; a grade recorrente aparece nos dias destacados.
          </p>
          <ul className="mt-4 max-h-[420px] space-y-2 overflow-y-auto text-sm">
            {aulas.length === 0 ? (
              <li className="text-zinc-500">Nenhuma aula extra neste mês.</li>
            ) : (
              aulas.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-2"
                >
                  <p className="font-medium text-zinc-900">
                    {format(parseISO(a.data), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {a.turma.curso.nome} — {a.turma.nome} ({a.turma.codigo})
                  </p>
                  {a.modulo ? (
                    <p className="text-xs text-indigo-700">
                      {a.modulo.codigoPublico ?? `Módulo ${a.modulo.numero}`}
                      {a.modulo.titulo ? ` · ${a.modulo.titulo}` : ""}
                    </p>
                  ) : null}
                  {a.titulo ? (
                    <p className="mt-1 text-xs text-zinc-500">{a.titulo}</p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
