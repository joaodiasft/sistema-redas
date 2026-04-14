"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { registrarReposicao, type ReposicaoState } from "@/app/(dashboard)/dashboard/operacional/reposicao/actions";
import type { ModuloParaResolver } from "@/lib/modulo-por-data";
import { resolverModuloParaData, rotuloModuloCurto } from "@/lib/modulo-por-data";

type AlunoOpt = { id: string; nomeCompleto: string; codigoPublico: string };

const initial: ReposicaoState = { ok: false };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

export function ReposicaoFormClient({
  alunos,
  modulosResolver,
}: {
  alunos: AlunoOpt[];
  modulosResolver: ModuloParaResolver[];
}) {
  const [state, action, pending] = useActionState(registrarReposicao, initial);
  const [dataReposicao, setDataReposicao] = useState(() => new Date().toISOString().slice(0, 10));
  const [moduloRef, setModuloRef] = useState("");

  const dataRef = useMemo(() => {
    const d = new Date(dataReposicao + "T12:00:00");
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [dataReposicao]);

  useEffect(() => {
    if (modulosResolver.length === 0) return;
    const mod = resolverModuloParaData(modulosResolver, dataRef);
    setModuloRef(mod ? rotuloModuloCurto(mod) : "");
  }, [dataRef, modulosResolver]);

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Reposição registrada.
        </p>
      ) : null}

      <label className="block text-xs font-semibold text-zinc-600">
        Aluno *
        <select name="alunoId" required className={`${inputClass} mt-1`} defaultValue="">
          <option value="" disabled>
            Selecione…
          </option>
          {alunos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.codigoPublico} — {a.nomeCompleto}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-semibold text-zinc-600">
        Data da reposição *
        <input
          name="dataReposicao"
          type="date"
          required
          className={`${inputClass} mt-1`}
          value={dataReposicao}
          onChange={(e) => setDataReposicao(e.target.value)}
        />
      </label>
      <label className="block text-xs font-semibold text-zinc-600">
        Referência do módulo (preenchido pela data; pode editar)
        <input
          name="moduloRef"
          className={`${inputClass} mt-1`}
          placeholder="Ex.: MD02"
          value={moduloRef}
          onChange={(e) => setModuloRef(e.target.value)}
        />
      </label>
      <label className="block text-xs font-semibold text-zinc-600">
        Descrição da falta / observação
        <textarea name="descricaoFalta" rows={3} className={`${inputClass} mt-1 resize-none`} />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#e11d74] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Registrar reposição"}
      </button>
    </form>
  );
}
