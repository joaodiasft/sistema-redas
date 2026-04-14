import type { Metadata } from "next";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { DashboardAvisosPanel } from "@/components/dashboard/dashboard-avisos-panel";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Avisos — ERP",
  description: "Cadastro de avisos para alunos e professores",
};

export default async function AdminAvisosPage() {
  const [turmasFull, cursosList] = await Promise.all([
    prisma.turma.findMany({
      where: { ativa: true },
      include: { curso: true },
      orderBy: [{ cursoId: "asc" }, { nome: "asc" }],
    }),
    prisma.curso.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, codigo: true },
    }),
  ]);

  const turmasForAvisos = turmasFull.map((t) => ({
    id: t.id,
    nome: t.nome,
    codigo: t.codigo,
    cursoNome: t.curso.nome,
  }));

  return (
    <ModuleScaffold
      title="Avisos"
      description="Cadastre comunicados institucionais. Eles aparecem nos painéis de aluno e de professor conforme público (alunos/professores) e recorte (todas as turmas, curso ou turma específica)."
    >
      <DashboardAvisosPanel
        cursos={cursosList}
        turmas={turmasForAvisos}
        startWithFormOpen
      />
    </ModuleScaffold>
  );
}
