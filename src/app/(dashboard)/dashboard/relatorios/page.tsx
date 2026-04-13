import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function RelatoriosPage() {
  return (
    <ModuleScaffold
      title="Relatórios"
      description="Relatório geral, por curso, turma ou aluno — dados cadastrais, frequência, reposições, financeiro, módulos e redações."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Filtros</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Selecione o tipo de relatório e aplique filtros (curso, turma, período, aluno).
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-semibold text-zinc-600">Tipo</label>
            <select className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
              <option>Relatório geral do sistema</option>
              <option>Por curso</option>
              <option>Por turma</option>
              <option>Por aluno</option>
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-600">Curso</label>
                <select className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
                  <option>Todos</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600">Turma</label>
                <select className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
                  <option>Todas</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Gerar visualização
            </button>
          </div>
        </PanelCard>
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Conteúdo do relatório</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-600">
            <li>Dados cadastrais e situação</li>
            <li>Frequência e reposições</li>
            <li>Financeiro e parcelas por módulo</li>
            <li>Módulos cursados e redações entregues</li>
            <li>Turma e curso vinculados</li>
          </ul>
          <p className="mt-4 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-500">
            A exportação (PDF/Excel) e o detalhamento por aluno serão conectados às consultas
            Prisma já modeladas.
          </p>
        </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
