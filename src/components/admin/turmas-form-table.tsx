"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { PanelCard } from "@/components/admin/panel-card";
import { criarTurma, excluirTurmaAction, type TurmaActionState } from "@/app/(dashboard)/dashboard/turmas/actions";
import type { Curso, Turma } from "@prisma/client";

type TurmaRow = Turma & { curso: Curso };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

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

export function TurmasFormTable({
  cursos,
  turmas,
  showFormOnly,
  showTableOnly,
}: {
  cursos: Curso[];
  turmas: TurmaRow[];
  showFormOnly?: boolean;
  showTableOnly?: boolean;
}) {
  const initial: TurmaActionState = { ok: false };
  const [state, action, pending] = useActionState(criarTurma, initial);

  if (showTableOnly) {
    return (
      <PanelCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Dia</th>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Cap.</th>
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {turmas.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50/80">
                <td className="px-4 py-3 text-zinc-800">{t.curso.nome}</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#ad1457]">{t.codigo}</td>
                <td className="px-4 py-3">{t.nome}</td>
                <td className="px-4 py-3 text-xs text-zinc-600">{t.diaSemana ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-zinc-600">
                  {t.horaInicio ?? "—"} – {t.horaFim ?? "—"}
                </td>
                <td className="px-4 py-3 tabular-nums">{t.capacidade}</td>
                <td className="px-4 py-3">
                  <form action={excluirTurmaAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="inline-flex rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Excluir turma"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelCard>
    );
  }

  return (
    <div className="space-y-4">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Turma criada com sucesso.
        </p>
      ) : null}
      <form action={action} className="space-y-3">
        <label className="block text-xs font-semibold text-zinc-600">
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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-zinc-600">
            Código *
            <input name="codigo" required className={`${inputClass} mt-1`} placeholder="R1" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Nome *
            <input name="nome" required className={`${inputClass} mt-1`} placeholder="Turma nome" />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-zinc-600">
            Início
            <input name="horaInicio" className={`${inputClass} mt-1`} placeholder="18:00" />
          </label>
          <label className="block text-xs font-semibold text-zinc-600">
            Fim
            <input name="horaFim" className={`${inputClass} mt-1`} placeholder="19:30" />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-zinc-600">
            Dia da semana
            <select name="diaSemana" className={`${inputClass} mt-1`} defaultValue="">
              {dias.map((d) => (
                <option key={d.v || "empty"} value={d.v}>
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
        </div>
        <label className="block text-xs font-semibold text-zinc-600">
          Classe
          <select name="classe" className={`${inputClass} mt-1`} defaultValue="ENSINO_MEDIO">
            <option value="ENSINO_MEDIO">Ensino médio</option>
            <option value="ENSINO_FUNDAMENTAL">Ensino fundamental</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#e11d74] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Cadastrar turma"}
        </button>
      </form>
    </div>
  );
}
