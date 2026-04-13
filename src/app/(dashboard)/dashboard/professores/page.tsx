import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { prisma } from "@/lib/prisma";

export default async function ProfessoresPage() {
  const professores = await prisma.professor.findMany({
    orderBy: { codigoPublico: "asc" },
    include: {
      turmas: { include: { turma: { include: { curso: true } } } },
      usuario: { select: { email: true } },
    },
  });

  return (
    <ModuleScaffold
      title="Professores"
      description="Cadastro com código Prof001… e vínculo a uma ou mais turmas."
    >
      <PanelCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Matéria</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Turmas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {professores.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Nenhum professor cadastrado.
                </td>
              </tr>
            ) : (
              professores.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/80">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-[#ad1457]">
                    {p.codigoPublico}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{p.nome}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.materia}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.usuario?.email ?? "—"}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-zinc-600">
                    {p.turmas.length === 0 ? (
                      "—"
                    ) : (
                      <ul className="space-y-0.5">
                        {p.turmas.map((pt) => (
                          <li key={pt.turmaId}>
                            {pt.turma.curso.nome} — {pt.turma.nome}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </PanelCard>
    </ModuleScaffold>
  );
}
