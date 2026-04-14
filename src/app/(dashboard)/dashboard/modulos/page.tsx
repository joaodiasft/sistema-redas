import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { ModuloFormCreate } from "@/components/admin/modulo-form-create";
import { prisma } from "@/lib/prisma";
import { excluirModuloAction } from "@/app/(dashboard)/dashboard/modulos/actions";

export default async function ModulosPage() {
  const [modulos, semestres] = await Promise.all([
    prisma.moduloCurso.findMany({
      orderBy: [{ anoReferencia: "desc" }, { mesReferencia: "desc" }, { numero: "asc" }],
      include: { semestre: true },
    }),
    prisma.semestre.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <ModuleScaffold
      title="Módulos"
      description="Módulos da grade (MD01…), vínculo ao semestre e referência de mês/ano para calendário e presença."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ModuloFormCreate semestres={semestres} />
        <PanelCard className="overflow-x-auto p-0 lg:col-span-2">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Semestre</th>
              <th className="px-4 py-3">Nº</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Mês / ano ref.</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {modulos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
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
                  <td className="px-4 py-3">
                    <form action={excluirModuloAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </PanelCard>
      </div>
    </ModuleScaffold>
  );
}
