"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { salvarPresencas, type PresencaState } from "@/app/(dashboard)/dashboard/operacional/presenca/actions";

type TurmaOpt = { id: string; nome: string; codigo: string; curso: { nome: string } };
type EncontroOpt = {
  id: string;
  rotulo: string;
  ordem: number;
  moduloNumero: number;
  moduloTitulo: string | null;
  codigoModulo: string | null;
};

type AlunoOpt = { id: string; nomeCompleto: string; codigoPublico: string };

const initial: PresencaState = { ok: false };

export function PresencaFormClient({
  turmas,
  encontros,
}: {
  turmas: TurmaOpt[];
  encontros: EncontroOpt[];
}) {
  const [state, action, pending] = useActionState(salvarPresencas, initial);
  const [turmaId, setTurmaId] = useState("");
  const [alunos, setAlunos] = useState<AlunoOpt[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  useEffect(() => {
    if (!turmaId) {
      setAlunos([]);
      return;
    }
    let cancel = false;
    setLoadingAlunos(true);
    void (async () => {
      try {
        const r = await fetch(`/api/admin/turma-alunos?turmaId=${encodeURIComponent(turmaId)}`, {
          cache: "no-store",
        });
        if (!r.ok || cancel) return;
        const j = (await r.json()) as { alunos: AlunoOpt[] };
        if (!cancel) setAlunos(j.alunos);
      } finally {
        if (!cancel) setLoadingAlunos(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [turmaId]);

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

  return (
    <form action={action} className="space-y-6">
      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Presenças salvas com sucesso.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Turma</span>
          <select
            className={`${inputClass} mt-2`}
            value={turmaId}
            onChange={(e) => setTurmaId(e.target.value)}
            required
          >
            <option value="">Selecione…</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.curso.nome} — {t.nome} ({t.codigo})
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Encontro / módulo</span>
          <select name="encontroId" className={`${inputClass} mt-2`} required defaultValue="">
            <option value="" disabled>
              Selecione…
            </option>
            {encontros.map((e) => (
              <option key={e.id} value={e.id}>
                M{e.moduloNumero} · {e.rotulo}
                {e.codigoModulo ? ` (${e.codigoModulo})` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block max-w-xs">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Data da aula</span>
        <input
          name="dataAula"
          type="date"
          required
          className={`${inputClass} mt-2`}
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </label>

      <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
        <h3 className="text-sm font-semibold text-zinc-900">Alunos da turma</h3>
        {loadingAlunos ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando alunos…
          </p>
        ) : alunos.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Escolha uma turma para listar os alunos matriculados.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {alunos.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                <div>
                  <input type="hidden" name="alunoId" value={a.id} />
                  <p className="font-medium text-zinc-900">{a.nomeCompleto}</p>
                  <p className="text-xs text-zinc-400">{a.codigoPublico}</p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    name={`presente_${a.id}`}
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  Presente
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || !turmaId || alunos.length === 0}
        className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Registrar presenças"}
      </button>
    </form>
  );
}
