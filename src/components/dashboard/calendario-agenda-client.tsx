"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { MonthCalendarView } from "@/components/dashboard/month-calendar-view";
import { buildMarkersForMonth } from "@/lib/calendar-markers";
import type { Curso, Turma } from "@prisma/client";

type TurmaRow = Turma & { curso: Curso };

type ModuloRow = { id: string; codigoPublico: string | null; numero: number; titulo: string | null };
type ProfRow = { id: string; nome: string; codigoPublico: string };

type AulaApi = {
  id: string;
  data: string;
  titulo: string | null;
  observacao: string | null;
  turma: TurmaRow;
  modulo: ModuloRow | null;
  professor: ProfRow | null;
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

export function CalendarioAgendaClient({
  turmas,
  modulos,
  professores,
}: {
  turmas: TurmaRow[];
  modulos: ModuloRow[];
  professores: ProfRow[];
}) {
  const [mes, setMes] = useState(() => format(new Date(), "yyyy-MM"));
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refDate = useMemo(() => {
    const [y, m] = mes.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, 1);
  }, [mes]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/aulas?mes=${encodeURIComponent(mes + "-01")}`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error("Falha ao carregar aulas");
      const j = (await r.json()) as { aulas: AulaApi[] };
      setAulas(j.aulas);
    } catch {
      setAulas([]);
      setError("Não foi possível carregar o calendário.");
    } finally {
      setLoading(false);
    }
  }, [mes]);

  useEffect(() => {
    void load();
  }, [load]);

  const diasSemanaTurmas = turmas.map((t) => t.diaSemana);
  const aulasPont = aulas.map((a) => ({
    data: parseISO(a.data),
    turma: a.turma,
  }));
  const markers = buildMarkersForMonth(refDate, turmas, aulasPont);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const dataStr = String(fd.get("data") ?? "");
    const turmaId = String(fd.get("turmaId") ?? "");
    const body = {
      data: dataStr,
      turmaId,
      moduloId: String(fd.get("moduloId") ?? "") || null,
      professorId: String(fd.get("professorId") ?? "") || null,
      titulo: String(fd.get("titulo") ?? "").trim() || null,
      observacao: String(fd.get("observacao") ?? "").trim() || null,
    };

    try {
      const r = await fetch(editingId ? `/api/admin/aulas/${editingId}` : "/api/admin/aulas", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) {
        setError(j.error ?? "Erro ao salvar");
        return;
      }
      e.currentTarget.reset();
      setEditingId(null);
      await load();
    } catch {
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir esta aula do calendário?")) return;
    const r = await fetch(`/api/admin/aulas/${id}`, { method: "DELETE" });
    if (r.ok) await load();
  }

  function startEdit(a: AulaApi) {
    setEditingId(a.id);
    const form = document.getElementById("form-aula") as HTMLFormElement | null;
    if (!form) return;
    (form.elements.namedItem("data") as HTMLInputElement).value = format(
      parseISO(a.data),
      "yyyy-MM-dd'T'HH:mm",
    );
    (form.elements.namedItem("turmaId") as HTMLSelectElement).value = a.turma.id;
    (form.elements.namedItem("moduloId") as HTMLSelectElement).value = a.modulo?.id ?? "";
    (form.elements.namedItem("professorId") as HTMLSelectElement).value = a.professor?.id ?? "";
    (form.elements.namedItem("titulo") as HTMLInputElement).value = a.titulo ?? "";
    (form.elements.namedItem("observacao") as HTMLTextAreaElement).value = a.observacao ?? "";
    form.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <CalendarDays className="h-4 w-4" aria-hidden />
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
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Sincronizando…
            </span>
          ) : null}
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <MonthCalendarView
            refDate={refDate}
            diasSemanaTurmas={diasSemanaTurmas}
            markersByDay={markers}
          />
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900">Aulas do período</h3>
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
            {aulas.length === 0 ? (
              <li className="text-zinc-500">Nenhuma aula extra lançada neste mês.</li>
            ) : (
              aulas.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-zinc-900">
                      {format(parseISO(a.data), "dd/MM HH:mm", { locale: ptBR })} · {a.turma.curso.nome}{" "}
                      — {a.turma.nome}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {a.professor?.nome ?? "Professor não definido"} ·{" "}
                      {a.modulo?.codigoPublico ?? `Mód. ${a.modulo?.numero ?? "—"}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(a.id)}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-gradient-to-b from-white to-zinc-50/50 p-4 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <Plus className="h-4 w-4" aria-hidden />
          {editingId ? "Editar aula" : "Nova aula"}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          Curso e horário base vêm da turma; aqui você registra ocorrências e observações.
        </p>
        {error ? (
          <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-800">
            {error}
          </p>
        ) : null}
        <form id="form-aula" className="mt-4 space-y-3" onSubmit={(e) => void onCreate(e)}>
          <label className="block text-xs font-semibold text-zinc-600">
            Data e hora *
            <input name="data" type="datetime-local" required className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Turma *
            <select name="turmaId" required className={`${inputClass} mt-1`} defaultValue="">
              <option value="" disabled>
                Selecione…
              </option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.curso.nome} — {t.nome} ({t.codigo})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Módulo
            <select name="moduloId" className={`${inputClass} mt-1`}>
              <option value="">—</option>
              {modulos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.codigoPublico ?? `Módulo ${m.numero}`}
                  {m.titulo ? ` — ${m.titulo}` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Professor
            <select name="professorId" className={`${inputClass} mt-1`}>
              <option value="">—</option>
              {professores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.codigoPublico})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Título (opcional)
            <input name="titulo" className={`${inputClass} mt-1`} placeholder="Ex.: Prova simulado" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Observação
            <textarea name="observacao" rows={2} className={`${inputClass} mt-1 resize-none`} />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#e11d74] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Salvando…" : editingId ? "Atualizar" : "Lançar aula"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  const form = document.getElementById("form-aula") as HTMLFormElement | null;
                  form?.reset();
                }}
                className="rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
              >
                Cancelar edição
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
