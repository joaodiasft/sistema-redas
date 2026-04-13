import Link from "next/link";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { NovoAlunoForm } from "@/components/admin/novo-aluno-form";
import { prisma } from "@/lib/prisma";

export default async function NovoAlunoPage() {
  const turmas = await prisma.turma.findMany({
    where: { ativa: true },
    include: { curso: true },
    orderBy: [{ cursoId: "asc" }, { nome: "asc" }],
  });

  return (
    <ModuleScaffold
      title="Novo aluno"
      description="Cadastro completo com dados pessoais, matrícula (até 2 turmas), plano, acessos externos e credenciais da plataforma."
      actions={
        <Link
          href="/dashboard/alunos"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Voltar à lista
        </Link>
      }
    >
      <PanelCard>
        <NovoAlunoForm turmas={turmas} />
      </PanelCard>
    </ModuleScaffold>
  );
}
