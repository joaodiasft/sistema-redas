import Link from "next/link";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function ConfigHubPage() {
  return (
    <ModuleScaffold
      title="Configurações"
      description="Ajuste limites de acesso dos alunos e parâmetros gerais do sistema."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/configuracoes/acesso-aluno">
          <PanelCard className="h-full transition hover:border-[#fbcfe8] hover:shadow-md">
            <h2 className="text-base font-semibold text-zinc-900">Limite de acesso</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Data de expiração do acesso do aluno à plataforma.
            </p>
          </PanelCard>
        </Link>
        <Link href="/dashboard/configuracoes/sistema">
          <PanelCard className="h-full transition hover:border-[#fbcfe8] hover:shadow-md">
            <h2 className="text-base font-semibold text-zinc-900">Sistema</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Senhas padrão, regras e parâmetros internos.
            </p>
          </PanelCard>
        </Link>
      </div>
    </ModuleScaffold>
  );
}
