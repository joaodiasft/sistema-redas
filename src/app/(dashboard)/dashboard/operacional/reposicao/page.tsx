import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { ReposicaoFormClient } from "@/components/admin/reposicao-form-client";
import { prisma } from "@/lib/prisma";

export default async function ReposicaoPage() {
  const [alunos, ultimas] = await Promise.all([
    prisma.aluno.findMany({
      orderBy: { nomeCompleto: "asc" },
      select: { id: true, nomeCompleto: true, codigoPublico: true },
      take: 400,
    }),
    prisma.reposicaoRegistro.findMany({
      orderBy: { criadoEm: "desc" },
      take: 15,
      include: {
        aluno: { select: { nomeCompleto: true, codigoPublico: true } },
      },
    }),
  ]);

  const faltasRecentes = await prisma.presencaEncontro.findMany({
    where: { presente: false },
    orderBy: { dataAula: "desc" },
    take: 20,
    include: {
      aluno: { select: { id: true, nomeCompleto: true, codigoPublico: true } },
      encontro: { select: { rotulo: true } },
    },
  });

  return (
    <ModuleScaffold
      title="Reposição"
      description="Registre reposições vinculadas ao aluno; use faltas recentes como referência."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard>
          <ReposicaoFormClient alunos={alunos} />
        </PanelCard>
        <div className="space-y-4">
          <PanelCard>
            <h2 className="text-sm font-semibold text-zinc-900">Faltas recentes (referência)</h2>
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs text-zinc-600">
              {faltasRecentes.length === 0 ? (
                <li>Nenhuma falta registrada ainda.</li>
              ) : (
                faltasRecentes.map((f) => (
                  <li key={f.id} className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-2 py-1.5">
                    <span className="font-medium text-zinc-800">{f.aluno.nomeCompleto}</span> ·{" "}
                    {f.encontro.rotulo} · {new Date(f.dataAula).toLocaleDateString("pt-BR")}
                  </li>
                ))
              )}
            </ul>
          </PanelCard>
          <PanelCard>
            <h2 className="text-sm font-semibold text-zinc-900">Últimas reposições</h2>
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs text-zinc-600">
              {ultimas.map((r) => (
                <li key={r.id} className="rounded-lg border border-zinc-100 px-2 py-1.5">
                  <span className="font-medium">{r.aluno.nomeCompleto}</span> ·{" "}
                  {new Date(r.dataReposicao).toLocaleDateString("pt-BR")}
                  {r.descricaoFalta ? ` · ${r.descricaoFalta}` : ""}
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </div>
    </ModuleScaffold>
  );
}
