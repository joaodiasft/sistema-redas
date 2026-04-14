import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { ModuleScaffold } from "@/components/admin/module-scaffold";
import { PanelCard } from "@/components/admin/panel-card";

export default function CursosTurmasHubPage() {
  return (
    <ModuleScaffold
      title="Cursos & turmas"
      description="Acesse o cadastro completo de cursos e de turmas em páginas dedicadas."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/cursos">
          <PanelCard className="h-full transition hover:border-[#e11d48]/25 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#e11d48]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Cursos</h2>
                <p className="mt-1 text-sm text-zinc-500">CRUD de cursos (código, nome, status).</p>
              </div>
            </div>
          </PanelCard>
        </Link>
        <Link href="/dashboard/turmas">
          <PanelCard className="h-full transition hover:border-[#e11d48]/25 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Turmas</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  CRUD de turmas (curso, horário, dia, capacidade).
                </p>
              </div>
            </div>
          </PanelCard>
        </Link>
      </div>
    </ModuleScaffold>
  );
}
