"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  atualizarCurso,
  criarCurso,
  excluirCurso,
  type CursoActionState,
} from "@/app/(dashboard)/dashboard/cursos/actions";
import { PanelCard } from "@/components/admin/panel-card";
import type { Curso } from "@prisma/client";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d48]/40 focus:ring-2 focus:ring-[#e11d48]/10";

const initial: CursoActionState = { ok: false };

export function CursosCrud({ cursos }: { cursos: Curso[] }) {
  const [createState, createAction, createPending] = useActionState(criarCurso, initial);
  const [editState, editAction, editPending] = useActionState(atualizarCurso, initial);
  const [delState, delAction, delPending] = useActionState(excluirCurso, initial);
  const [editing, setEditing] = useState<Curso | null>(null);

  useEffect(() => {
    if (createState.ok || editState.ok) setEditing(null);
  }, [createState.ok, editState.ok]);

  return (
    <div className="space-y-6">
      <PanelCard className="max-w-lg">
        <h2 className="text-sm font-semibold text-zinc-900">Novo curso</h2>
        <p className="mt-1 text-xs text-zinc-500">Código único no sistema (ex.: 01, 02).</p>
        {createState.error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {createState.error}
          </p>
        ) : null}
        {createState.ok ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Curso criado.
          </p>
        ) : null}
        <form action={createAction} className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-zinc-600">
            Código *
            <input name="codigo" required className={`${inputClass} mt-1`} placeholder="01" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Nome *
            <input name="nome" required className={`${inputClass} mt-1`} placeholder="Redação" />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="ativo" defaultChecked className="h-4 w-4 rounded border-zinc-300" />
            Ativo
          </label>
          <button
            type="submit"
            disabled={createPending}
            className="w-full rounded-full bg-[#e11d48] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {createPending ? "Salvando…" : "Cadastrar curso"}
          </button>
        </form>
      </PanelCard>

      <PanelCard className="overflow-x-auto p-0">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Cursos cadastrados</h2>
        </div>
        {delState.error ? (
          <p className="mx-5 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {delState.error}
          </p>
        ) : null}
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Nome</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 w-32" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {cursos.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/80">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#e11d48]">{c.codigo}</td>
                <td className="px-5 py-3 font-medium text-zinc-900">{c.nome}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.ativo ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {c.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <form action={delAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        disabled={delPending}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editing ? (
          <div className="border-t border-zinc-100 bg-rose-50/30 px-5 py-4">
            <h3 className="text-sm font-semibold text-zinc-900">Editar curso</h3>
            {editState.error ? (
              <p className="mt-2 text-sm text-red-700">{editState.error}</p>
            ) : null}
            <form action={editAction} className="mt-3 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing.id} />
              <label className="block text-xs font-semibold text-zinc-600 sm:col-span-1">
                Código *
                <input
                  name="codigo"
                  required
                  defaultValue={editing.codigo}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600 sm:col-span-1">
                Nome *
                <input
                  name="nome"
                  required
                  defaultValue={editing.nome}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700 sm:col-span-2">
                <input
                  type="checkbox"
                  name="ativo"
                  defaultChecked={editing.ativo}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                Ativo
              </label>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={editPending}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {editPending ? "Salvando…" : "Salvar alterações"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </PanelCard>
    </div>
  );
}
