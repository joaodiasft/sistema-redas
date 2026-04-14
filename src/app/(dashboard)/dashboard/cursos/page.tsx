import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { CursosCrud } from "@/components/admin/cursos-crud";
import { prisma } from "@/lib/prisma";

export default async function CursosPage() {
  const cursos = await prisma.curso.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <ModuleScaffold
      title="Cursos"
      description="CRUD de cursos: código único, nome e status. Só é possível excluir cursos sem turmas vinculadas."
    >
      <CursosCrud cursos={cursos} />
    </ModuleScaffold>
  );
}
