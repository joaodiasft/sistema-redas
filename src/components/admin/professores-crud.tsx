"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  atualizarProfessor,
  criarProfessor,
  excluirProfessor,
  type ProfessorActionState,
} from "@/app/(dashboard)/dashboard/professores/actions";
import { PanelCard } from "@/components/admin/panel-card";
import type { Curso, Professor, Turma, Usuario } from "@prisma/client";

type ProfRow = Professor & {
  usuario: Pick<Usuario, "email"> | null;
  turmas: { turma: Turma & { curso: Curso } }[];
};
type TurmaOpt = Turma & { curso: Curso };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d48]/40 focus:ring-2 focus:ring-[#e11d48]/10";

const initial: ProfessorActionState = { ok: false };

export function ProfessoresCrud({
  professores,
  turmas,
}: {
  professores: ProfRow[];
  turmas: TurmaOpt[];
}) {
  const [cState, cAction, cPending] = useActionState(criarProfessor, initial);
  const [eState, eAction, ePending] = useActionState(atualizarProfessor, initial);
  const [xState, xAction, xPending] = useActionState(excluirProfessor, initial);
  const [editing, setEditing] = useState<ProfRow | null>(null);

  const turmasIdsFor = (p: ProfRow) => new Set(p.turmas.map((t) => t.turma.id));

  return (
    <div className="space-y-6">
      <PanelCard className="max-w-2xl">
        <h2 className="text-sm font-semibold text-zinc-900">Novo professor</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Código Prof001… gerado automaticamente. Opcional: login com e-mail e senha.
        </p>
        {cState.error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {cState.error}
          </p>
        ) : null}
        {cState.ok ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Professor cadastrado.
          </p>
        ) : null}
        <form action={cAction} className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-zinc-600">
            Nome completo *
            <input name="nome" required className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Matéria *
            <input name="materia" required className={`${inputClass} mt-1`} placeholder="Redação" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-zinc-600">
              E-mail (login)
              <input name="emailLogin" type="email" className={`${inputClass} mt-1`} />
            </label>
            <label className="block text-xs font-semibold text-zinc-600">
              Senha (se criar login)
              <input
                name="senhaPlano"
                type="password"
                className={`${inputClass} mt-1`}
                placeholder="redas2026"
              />
            </label>
          </div>
          <fieldset className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3">
            <legend className="px-1 text-xs font-semibold text-zinc-600">Turmas (opcional)</legend>
            <ul className="mt-2 max-h-40 space-y-1.5 overflow-y-auto text-sm">
              {turmas.map((t) => (
                <li key={t.id}>
                  <label className="flex items-center gap-2 text-zinc-700">
                    <input type="checkbox" name="turmaId" value={t.id} className="h-4 w-4 rounded border-zinc-300" />
                    <span>
                      {t.curso.nome} — {t.nome} ({t.codigo})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <button
            type="submit"
            disabled={cPending}
            className="rounded-full bg-[#e11d48] px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {cPending ? "Salvando…" : "Cadastrar professor"}
          </button>
        </form>
      </PanelCard>

      <PanelCard className="overflow-x-auto p-0">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Professores</h2>
        </div>
        {eState.error ? (
          <p className="mx-5 mt-3 text-sm text-red-700">{eState.error}</p>
        ) : null}
        {xState.error ? (
          <p className="mx-5 mt-3 text-sm text-red-700">{xState.error}</p>
        ) : null}
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[0.65rem] font-semibold uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Matéria</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Turmas</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {professores.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50/80">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#e11d48]">
                  {p.codigoPublico}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">{p.nome}</td>
                <td className="px-4 py-3 text-zinc-600">{p.materia}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">{p.usuario?.email ?? "—"}</td>
                <td className="max-w-xs px-4 py-3 text-xs text-zinc-600">
                  {p.turmas.length === 0
                    ? "—"
                    : p.turmas.map((pt) => `${pt.turma.curso.nome} ${pt.turma.codigo}`).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <form action={xAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        disabled={xPending}
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
            <h3 className="text-sm font-semibold text-zinc-900">Editar professor e turmas</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Login não é alterado aqui. Para mudar e-mail/senha, use usuários (em evolução).
            </p>
            <form action={eAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={editing.id} />
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
                Matéria *
                <input
                  name="materia"
                  required
                  defaultValue={editing.materia}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <fieldset className="rounded-xl border border-zinc-100 bg-white p-3">
                <legend className="px-1 text-xs font-semibold text-zinc-600">Turmas</legend>
                <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto text-sm">
                  {turmas.map((t) => (
                    <li key={t.id}>
                      <label className="flex items-center gap-2 text-zinc-700">
                        <input
                          type="checkbox"
                          name="turmaId"
                          value={t.id}
                          defaultChecked={turmasIdsFor(editing).has(t.id)}
                          className="h-4 w-4 rounded border-zinc-300"
                        />
                        {t.curso.nome} — {t.nome} ({t.codigo})
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={ePending}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {ePending ? "Salvando…" : "Salvar"}
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
