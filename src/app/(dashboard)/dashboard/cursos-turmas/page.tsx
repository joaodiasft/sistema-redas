import Link from "next/link";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";
import { prisma } from "@/lib/prisma";

const classeLabel: Record<string, string> = {
  ENSINO_FUNDAMENTAL: "Ensino fundamental",
  ENSINO_MEDIO: "Ensino médio",
};

const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function CursosTurmasPage() {
  const cursos = await prisma.curso.findMany({
    orderBy: { nome: "asc" },
    include: {
      turmas: { orderBy: { nome: "asc" } },
    },
  });

  return (
    <ModuleScaffold
      title="Cursos & turmas"
      description="Organização de cursos, códigos, turmas, horários e classe (fundamental / médio)."
      actions={
        <span className="text-xs text-zinc-500">
          CRUD completo em evolução — estrutura de dados pronta no banco.
        </span>
      }
    >
      <div className="space-y-6">
        {cursos.map((c) => (
          <PanelCard key={c.id}>
            <div className="flex flex-col gap-2 border-b border-zinc-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#c41062]">
                  {c.codigo}
                </p>
                <h2 className="text-lg font-bold text-zinc-900">{c.nome}</h2>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.ativo ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {c.ativo ? "Curso ativo" : "Inativo"}
              </span>
            </div>
            {c.turmas.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">Nenhuma turma neste curso.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {c.turmas.map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-col gap-1 rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-semibold text-zinc-900">{t.nome}</span>
                      <span className="text-zinc-400"> · </span>
                      <span className="font-mono text-sm text-zinc-600">{t.codigo}</span>
                      <p className="text-xs text-zinc-500">
                        {t.horaInicio && t.horaFim
                          ? `${t.horaInicio} – ${t.horaFim}`
                          : "Horário a definir"}{" "}
                        · {t.diaSemana != null ? dias[t.diaSemana] : "—"} ·{" "}
                        {classeLabel[t.classe] ?? t.classe} · capacidade {t.capacidade}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>
        ))}
        {cursos.length === 0 ? (
          <PanelCard>
            <p className="text-sm text-zinc-600">Nenhum curso cadastrado.</p>
            <Link href="/dashboard/alunos" className="mt-2 inline-block text-sm text-[#c41062]">
              Voltar ao painel
            </Link>
          </PanelCard>
        ) : null}
      </div>
    </ModuleScaffold>
  );
}
