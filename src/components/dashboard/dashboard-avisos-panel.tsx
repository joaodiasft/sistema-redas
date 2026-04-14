"use client";

import { useCallback, useEffect, useState } from "react";
import { BellPlus, Loader2 } from "lucide-react";

type CursoOpt = { id: string; nome: string; codigo: string };
type TurmaOpt = { id: string; nome: string; codigo: string; cursoNome: string };

type AvisoRow = {
  id: string;
  titulo: string;
  mensagem: string;
  prioridadeNivel: "BAIXA" | "MEDIA" | "ALTA";
  criadoEm: string;
  paraTodasTurmas: boolean;
  enviarAlunos: boolean;
  enviarProfessores: boolean;
  curso: CursoOpt | null;
  turma: { id: string; nome: string; codigo: string } | null;
};

const prioridadeBadge: Record<string, string> = {
  ALTA: "bg-rose-100 text-rose-900 ring-rose-200",
  MEDIA: "bg-amber-100 text-amber-900 ring-amber-200",
  BAIXA: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export function DashboardAvisosPanel({
  cursos,
  turmas,
}: {
  cursos: CursoOpt[];
  turmas: TurmaOpt[];
}) {
  const [avisos, setAvisos] = useState<AvisoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/avisos", { cache: "no-store" });
      if (!r.ok) throw new Error("Falha ao carregar avisos");
      const j = (await r.json()) as { avisos: AvisoRow[] };
      setAvisos(j.avisos);
    } catch {
      setAvisos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const paraTodas = fd.get("paraTodasTurmas") === "on";
    const body = {
      titulo: String(fd.get("titulo") ?? "").trim(),
      mensagem: String(fd.get("mensagem") ?? "").trim(),
      prioridadeNivel: String(fd.get("prioridadeNivel") ?? "MEDIA"),
      paraTodasTurmas: paraTodas,
      enviarAlunos: fd.get("enviarAlunos") === "on",
      enviarProfessores: fd.get("enviarProfessores") === "on",
      cursoId: paraTodas ? null : String(fd.get("cursoId") ?? "") || null,
      turmaId: paraTodas ? null : String(fd.get("turmaId") ?? "") || null,
    };

    try {
      const r = await fetch("/api/admin/avisos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) {
        setError(j.error ?? "Erro ao salvar");
        return;
      }
      e.currentTarget.reset();
      setOpen(false);
      await load();
    } catch {
      setError("Erro de rede.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-zinc-500">
          Histórico completo abaixo. Novos avisos ficam registrados com data e prioridade.
        </p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-full bg-[#e11d74] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-500/20 transition hover:bg-[#c41062]"
        >
          <BellPlus className="h-4 w-4" aria-hidden />
          Criar aviso
        </button>
      </div>

      {open ? (
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-white p-4 shadow-inner"
        >
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-zinc-600">Título *</span>
              <input name="titulo" required className={`${input} mt-1`} placeholder="Ex.: Reunião de pais" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-zinc-600">Descrição *</span>
              <textarea
                name="mensagem"
                required
                rows={3}
                className={`${input} mt-1 resize-none`}
                placeholder="Detalhes do aviso…"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-zinc-600">Prioridade</span>
              <select name="prioridadeNivel" className={`${input} mt-1`} defaultValue="MEDIA">
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </label>
            <label className="flex items-end gap-2 pb-1">
              <input
                type="checkbox"
                name="paraTodasTurmas"
                defaultChecked
                className="h-4 w-4 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700">Todas as turmas</span>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-zinc-600">Curso (se filtrar)</span>
              <select name="cursoId" className={`${input} mt-1`}>
                <option value="">—</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-zinc-600">Turma (se filtrar)</span>
              <select name="turmaId" className={`${input} mt-1`}>
                <option value="">—</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.cursoNome} — {t.nome}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="enviarAlunos"
                  defaultChecked
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-700">Visível / direcionado a alunos</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="enviarProfessores" className="h-4 w-4 rounded border-zinc-300" />
                <span className="text-sm text-zinc-700">Visível / direcionado a professores</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Salvando…" : "Salvar aviso"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando avisos…
        </div>
      ) : avisos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum aviso no histórico.
        </p>
      ) : (
        <ul className="max-h-[min(420px,50vh)] space-y-3 overflow-y-auto pr-1">
          {avisos.map((a) => (
            <li
              key={a.id}
              className={`rounded-xl border px-3 py-3 shadow-sm transition hover:shadow-md ${
                a.prioridadeNivel === "ALTA"
                  ? "border-rose-200 bg-gradient-to-br from-rose-50/90 to-white"
                  : "border-zinc-100 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900">{a.titulo}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ring-1 ${prioridadeBadge[a.prioridadeNivel] ?? prioridadeBadge.MEDIA}`}
                >
                  {a.prioridadeNivel === "ALTA" ? "Urgente" : a.prioridadeNivel}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{a.mensagem}</p>
              <p className="mt-2 text-[0.65rem] text-zinc-400">
                {new Date(a.criadoEm).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                {a.paraTodasTurmas
                  ? " · Todas as turmas"
                  : a.turma
                    ? ` · ${a.turma.codigo}`
                    : a.curso
                      ? ` · ${a.curso.nome}`
                      : ""}
                {a.enviarAlunos ? " · Alunos" : ""}
                {a.enviarProfessores ? " · Professores" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
