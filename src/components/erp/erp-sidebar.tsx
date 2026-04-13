"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Painel" },
  { href: "/dashboard/alunos", label: "Alunos" },
  { href: "/dashboard/turmas", label: "Turmas" },
  { href: "/dashboard/semestre-modulos", label: "Semestre & módulos" },
  { href: "/dashboard/frequencia", label: "Frequência" },
  { href: "/dashboard/materiais", label: "Materiais" },
  { href: "/dashboard/financeiro", label: "Financeiro" },
  { href: "/dashboard/relatorios", label: "Relatórios" },
  { href: "/dashboard/usuarios", label: "Usuários & perfis" },
  { href: "/dashboard/configuracoes", label: "Configurações" },
];

export function ErpSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-4 py-4">
        <span className="text-lg font-bold text-brand">Redação</span>
        <span className="block text-xs font-medium text-zinc-500">ERP pedagógico</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Módulos do sistema">
        {itens.map((item) => {
          const ativo =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                ativo
                  ? "bg-brand-soft text-brand-dark"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-100 p-3 space-y-1">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-center text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Site público
        </Link>
        <Link
          href="/login"
          className="block rounded-lg px-3 py-2 text-center text-sm text-zinc-500 hover:bg-zinc-50"
        >
          Sair
        </Link>
      </div>
    </aside>
  );
}
