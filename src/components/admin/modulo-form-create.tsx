"use client";

import { useActionState } from "react";
import { criarModulo, type ModuloActionState } from "@/app/(dashboard)/dashboard/modulos/actions";
import { PanelCard } from "@/components/admin/panel-card";
import type { Semestre } from "@prisma/client";

const initial: ModuloActionState = { ok: false };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

export function ModuloFormCreate({ semestres }: { semestres: Semestre[] }) {
  const [state, action, pending] = useActionState(criarModulo, initial);

  return (
    <PanelCard>
      <h2 className="text-sm font-semibold text-zinc-900">Novo módulo</h2>
      <p className="mt-1 text-xs text-zinc-500">Vinculado ao semestre; mês/ano alinham o calendário.</p>
      {state.error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Módulo criado.
        </p>
      ) : null}
      <form action={action} className="mt-4 space-y-3">
        <label className="block text-xs font-semibold text-zinc-600">
          Semestre *
          <select name="semestreId" required className={`${inputClass} mt-1`} defaultValue="">
            <option value="" disabled>
              Selecione…
            </option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-zinc-600">
          Número *
          <input name="numero" type="number" min={1} max={20} required className={`${inputClass} mt-1`} />
        </label>
        <label className="block text-xs font-semibold text-zinc-600">
          Código público (ex.: MD04)
          <input name="codigoPublico" className={`${inputClass} mt-1`} placeholder="MD04" />
        </label>
        <label className="block text-xs font-semibold text-zinc-600">
          Título
          <input name="titulo" className={`${inputClass} mt-1`} />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs font-semibold text-zinc-600">
            Mês ref.
            <input name="mesReferencia" type="number" min={1} max={12} className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Ano ref.
            <input name="anoReferencia" type="number" min={2024} max={2035} className={`${inputClass} mt-1`} />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-zinc-900 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Adicionar módulo"}
        </button>
      </form>
    </PanelCard>
  );
}
