import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function ConfigSistemaPage() {
  return (
    <ModuleScaffold
      title="Configurações do sistema"
      description="Senha padrão do primeiro acesso, regras de bloqueio e parâmetros gerais (tabela ConfiguracaoSistema)."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Senha padrão (alunos)</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Valor de referência para novos cadastros (hash armazenado em{" "}
            <code className="rounded bg-zinc-100 px-1">ConfiguracaoSistema</code>).
          </p>
          <p className="mt-3 text-sm text-zinc-700">
            Plano textual do primeiro acesso: <strong>123456</strong> (ajuste via seed ou futura
            edição segura).
          </p>
        </PanelCard>
        <PanelCard>
          <h2 className="text-sm font-semibold text-zinc-900">Administrador</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Alteração de senha do admin por fluxo dedicado (recomendado: confirmação por e-mail ou
            senha atual).
          </p>
        </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
