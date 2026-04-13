import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function PresencaPage() {
  return (
    <ModuleScaffold
      title="Presença"
      description="Selecione curso, turma e módulo; liste os alunos da turma e marque presença individual por encontro."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {["Curso", "Turma", "Módulo / encontro"].map((label) => (
          <PanelCard key={label}>
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {label}
            </label>
            <select className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
              <option>Selecione…</option>
            </select>
          </PanelCard>
        ))}
      </div>
      <PanelCard className="mt-6">
        <p className="text-sm text-zinc-600">
          Após escolher turma e encontro, a lista de alunos matriculados aparecerá aqui com toggles
          de presença (integração com <code className="rounded bg-zinc-100 px-1">PresencaEncontro</code>
          ).
        </p>
      </PanelCard>
    </ModuleScaffold>
  );
}
