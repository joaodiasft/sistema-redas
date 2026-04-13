import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { prisma } from "@/lib/prisma";

export default async function AcessoAlunoPage() {
  const alunos = await prisma.aluno.findMany({
    orderBy: { nomeCompleto: "asc" },
    include: { usuario: { select: { email: true, acessoExpiraEm: true } } },
  });

  return (
    <ModuleScaffold
      title="Limite de acesso (aluno)"
      description="Defina data em que o acesso do aluno à plataforma expira (campo acessoExpiraEm no usuário)."
    >
      <PanelCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.7rem] font-semibold uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Aluno</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Acesso expira</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {alunos.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">{a.nomeCompleto}</td>
                <td className="px-4 py-3 text-zinc-600">{a.usuario?.email ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {a.usuario?.acessoExpiraEm
                    ? new Date(a.usuario.acessoExpiraEm).toLocaleDateString("pt-BR")
                    : "Sem limite"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelCard>
      <p className="mt-4 text-xs text-zinc-500">
        Formulário de edição por linha e validação no login serão conectados em seguida.
      </p>
    </ModuleScaffold>
  );
}
