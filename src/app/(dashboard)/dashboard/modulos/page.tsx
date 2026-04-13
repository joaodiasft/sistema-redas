import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { prisma } from "@/lib/prisma";

export default async function ModulosPage() {
  const modulos = await prisma.moduloCurso.findMany({
    orderBy: [{ anoReferencia: "desc" }, { mesReferencia: "desc" }, { numero: "asc" }],
    include: { semestre: true },
  });

  return (
    <ModuleScaffold
      title="Módulos"
      description="Módulos da grade (MD01…), vínculo ao semestre e referência de mês/ano para gerar calendário de aulas conforme dias da semana das turmas."
    >
      <PanelCard className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Semestre</th>
              <th className="px-4 py-3">Nº</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Mês / ano ref.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {modulos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Nenhum módulo cadastrado. Crie semestre e módulos para vincular encontros e
                  presenças.
                </td>
              </tr>
            ) : (
              modulos.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-[#ad1457]">
                    {m.codigoPublico ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{m.semestre.nome}</td>
                  <td className="px-4 py-3">{m.numero}</td>
                  <td className="px-4 py-3">{m.titulo ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {m.mesReferencia != null && m.anoReferencia != null
                      ? `${m.mesReferencia}/${m.anoReferencia}`
                      : "—"}
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
