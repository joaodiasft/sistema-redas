import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { RelatoriosClient } from "@/components/admin/relatorios-client";
import { prisma } from "@/lib/prisma";

export default async function RelatoriosPage() {
  const [cursos, turmas, alunos] = await Promise.all([
    prisma.curso.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, codigo: true },
    }),
    prisma.turma.findMany({
      where: { ativa: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, codigo: true, cursoId: true },
    }),
    prisma.aluno.findMany({
      orderBy: { nomeCompleto: "asc" },
      select: { id: true, nomeCompleto: true, codigoPublico: true },
      take: 500,
    }),
  ]);

  const alunosOpts = alunos.map((a) => ({
    id: a.id,
    nome: a.nomeCompleto,
    codigoPublico: a.codigoPublico,
  }));

  return (
    <ModuleScaffold
      title="Relatórios"
      description="Dados dinâmicos do PostgreSQL: filtros por tipo, curso, turma, aluno e situação. Exportação em PDF."
    >
      <RelatoriosClient cursos={cursos} turmas={turmas} alunos={alunosOpts} />
    </ModuleScaffold>
  );
}
