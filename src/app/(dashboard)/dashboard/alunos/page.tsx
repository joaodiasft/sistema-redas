import Link from "next/link";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { prisma } from "@/lib/prisma";

const situacaoLabel: Record<string, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  DEVENDO: "Devendo",
};

export default async function AlunosPage() {
  const alunos = await prisma.aluno.findMany({
    orderBy: { codigoPublico: "asc" },
    include: {
      matriculas: {
        include: { curso: true, turma: true },
      },
      usuario: { select: { email: true } },
    },
  });

  return (
    <ModuleScaffold
      title="Cadastro de alunos"
      description="Listagem geral, situação e vínculos com curso/turma (até 2 matrículas por aluno)."
      actions={
        <Link
          href="/dashboard/alunos/novo"
          className="inline-flex rounded-full bg-[#e11d74] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#c41062]"
        >
          + Novo aluno
        </Link>
      }
    >
      <PanelCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Situação</th>
              <th className="px-4 py-3">Turmas / cursos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {alunos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Nenhum aluno cadastrado. Use &quot;Novo aluno&quot; para incluir o primeiro registro.
                </td>
              </tr>
            ) : (
              alunos.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50/80">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-[#ad1457]">
                    {a.codigoPublico}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{a.nomeCompleto}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.usuario?.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        a.situacao === "ATIVO"
                          ? "bg-emerald-50 text-emerald-800"
                          : a.situacao === "DEVENDO"
                            ? "bg-amber-50 text-amber-900"
                            : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {situacaoLabel[a.situacao] ?? a.situacao}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-xs text-zinc-600">
                    {a.matriculas.length === 0 ? (
                      <span className="text-zinc-400">Sem matrícula</span>
                    ) : (
                      <ul className="space-y-1">
                        {a.matriculas.map((m) => (
                          <li key={m.id}>
                            <span className="font-medium text-zinc-800">{m.turma.nome}</span>
                            <span className="text-zinc-400"> · </span>
                            {m.curso.nome}
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
