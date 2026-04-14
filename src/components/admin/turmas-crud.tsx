"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  atualizarTurma,
  criarTurma,
  excluirTurmaAction,
  type TurmaActionState,
} from "@/app/(dashboard)/dashboard/turmas/actions";
import { PanelCard } from "@/components/admin/panel-card";
import type { Curso, Turma } from "@prisma/client";

type TurmaRow = Turma & { curso: Curso };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d48]/40 focus:ring-2 focus:ring-[#e11d48]/10";

const dias = [
  { v: "", l: "—" },
  { v: "0", l: "Domingo" },
  { v: "1", l: "Segunda" },
  { v: "2", l: "Terça" },
  { v: "3", l: "Quarta" },
  { v: "4", l: "Quinta" },
  { v: "5", l: "Sexta" },
  { v: "6", l: "Sábado" },
];

const initial: TurmaActionState = { ok: false };

export function TurmasCrud({ cursos, turmas }: { cursos: Curso[]; turmas: TurmaRow[] }) {
  const [createState, createAction, createPending] = useActionState(criarTurma, initial);
  const [editState, editAction, editPending] = useActionState(atualizarTurma, initial);
  const [editing, setEditing] = useState<TurmaRow | null>(null);

  return (
    <div className="space-y-6">
      <PanelCard className="max-w-2xl">
        <h2 className="text-sm font-semibold text-zinc-900">Nova turma</h2>
        {createState.error ? (
          <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {createState.error}
          </p>
        ) : null}
        {createState.ok ? (
          <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Turma criada.
          </p>
        ) : null}
        <form action={createAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
            Curso *
            <select name="cursoId" required className={`${inputClass} mt-1`} defaultValue="">
              <option value="" disabled>
                Selecione…
              </option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.codigo})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Código *
            <input name="codigo" required className={`${inputClass} mt-1`} placeholder="R1" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Nome *
            <input name="nome" required className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Início
            <input name="horaInicio" className={`${inputClass} mt-1`} placeholder="18:00" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Fim
            <input name="horaFim" className={`${inputClass} mt-1`} placeholder="19:30" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Dia
            <select name="diaSemana" className={`${inputClass} mt-1`} defaultValue="">
              {dias.map((d) => (
                <option key={d.v || "x"} value={d.v}>
                  {d.l}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Capacidade
            <input
              name="capacidade"
              type="number"
              min={1}
              max={200}
              defaultValue={30}
              className={`${inputClass} mt-1`}
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
            Classe
            <select name="classe" className={`${inputClass} mt-1`} defaultValue="ENSINO_MEDIO">
              <option value="ENSINO_MEDIO">Ensino médio</option>
              <option value="ENSINO_FUNDAMENTAL">Ensino fundamental</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createPending}
              className="rounded-full bg-[#e11d48] px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {createPending ? "Salvando…" : "Cadastrar turma"}
            </button>
          </div>
        </form>
      </PanelCard>

      <PanelCard className="overflow-x-auto p-0">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Turmas</h2>
        </div>
        {editState.error ? (
          <p className="mx-5 mt-3 text-sm text-red-700">{editState.error}</p>
        ) : null}
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[0.65rem] font-semibold uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Dia</th>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Ativa</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {turmas.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50/80">
                <td className="px-4 py-3 text-zinc-800">{t.curso.nome}</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#e11d48]">{t.codigo}</td>
                <td className="px-4 py-3">{t.nome}</td>
                <td className="px-4 py-3 text-xs">{t.diaSemana ?? "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {t.horaInicio ?? "—"} – {t.horaFim ?? "—"}
                </td>
                <td className="px-4 py-3">{t.ativa ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(t)}
                      className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <form action={excluirTurmaAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
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
            <h3 className="text-sm font-semibold text-zinc-900">Editar turma</h3>
            <form action={editAction} className="mt-3 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing.id} />
              <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                Curso *
                <select
                  name="cursoId"
                  required
                  defaultValue={editing.cursoId}
                  className={`${inputClass} mt-1`}
                >
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Código *
                <input
                  name="codigo"
                  required
                  defaultValue={editing.codigo}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Nome *
                <input
                  name="nome"
                  required
                  defaultValue={editing.nome}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Início
                <input
                  name="horaInicio"
                  defaultValue={editing.horaInicio ?? ""}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Fim
                <input
                  name="horaFim"
                  defaultValue={editing.horaFim ?? ""}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Dia
                <select
                  name="diaSemana"
                  className={`${inputClass} mt-1`}
                  defaultValue={editing.diaSemana ?? ""}
                >
                  {dias.map((d) => (
                    <option key={d.v || "e"} value={d.v}>
                      {d.l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Capacidade
                <input
                  name="capacidade"
                  type="number"
                  min={1}
                  defaultValue={editing.capacidade}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600 sm:col-span-2">
                Classe
                <select
                  name="classe"
                  defaultValue={editing.classe}
                  className={`${inputClass} mt-1`}
                >
                  <option value="ENSINO_MEDIO">Ensino médio</option>
                  <option value="ENSINO_FUNDAMENTAL">Ensino fundamental</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700 sm:col-span-2">
                <input
                  type="checkbox"
                  name="ativa"
                  defaultChecked={editing.ativa}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                Turma ativa
              </label>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={editPending}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {editPending ? "Salvando…" : "Salvar"}
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
