"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Layers,
  ListOrdered,
  PenLine,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const grupos: { titulo: string; itens: Item[] }[] = [
  {
    titulo: "Área geral",
    itens: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/avisos", label: "Avisos", icon: Bell },
      { href: "/dashboard/relatorios", label: "Relatórios", icon: BarChart3 },
      { href: "/dashboard/calendario-geral", label: "Calendário geral", icon: CalendarDays },
    ],
  },
  {
    titulo: "Cadastro",
    itens: [
      { href: "/dashboard/alunos", label: "Alunos", icon: Users },
      { href: "/dashboard/cursos-turmas", label: "Cursos & turmas", icon: Layers },
      { href: "/dashboard/turmas", label: "Turmas", icon: ListOrdered },
      { href: "/dashboard/professores", label: "Professores", icon: GraduationCap },
      { href: "/dashboard/modulos", label: "Módulos", icon: PenLine },
    ],
  },
  {
    titulo: "Operacional",
    itens: [
      { href: "/dashboard/operacional/presenca", label: "Presença", icon: ClipboardCheck },
      { href: "/dashboard/operacional/reposicao", label: "Reposição", icon: Calendar },
      { href: "/dashboard/operacional/calendario", label: "Calendário operacional", icon: CalendarDays },
      { href: "/dashboard/operacional/financeiro", label: "Financeiro", icon: Wallet },
      { href: "/dashboard/operacional/redacao", label: "Entrega de redação", icon: PenLine },
    ],
  },
  {
    titulo: "Configurações",
    itens: [
      { href: "/dashboard/configuracoes", label: "Visão geral", icon: Settings },
      { href: "/dashboard/configuracoes/acesso-aluno", label: "Limite de acesso", icon: Users },
      { href: "/dashboard/configuracoes/sistema", label: "Sistema", icon: Settings },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  function ativo(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-zinc-100 px-4 py-5">
        <span className="font-display text-lg font-bold tracking-tight text-[color:var(--admin-accent)]">
          Redação Nota Mil
        </span>
        <span className="mt-0.5 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-zinc-400">
          Gestão escolar
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Módulos admin">
        {grupos.map((g) => (
          <div key={g.titulo} className="mb-5">
            <p className="mb-2 px-3 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400">
              {g.titulo}
            </p>
            <ul className="space-y-0.5">
              {g.itens.map((item) => {
                const Icon = item.icon;
                const on = ativo(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`admin-focus-ring flex items-center gap-3 rounded-l-lg py-2.5 pl-3 pr-2 text-sm font-medium transition motion-reduce:transition-none ${
                        on
                          ? "admin-nav-link-active border-r-[3px] border-[color:var(--admin-accent)] text-rose-950 shadow-sm"
                          : "border-r-[3px] border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${on ? "text-[color:var(--admin-accent)]" : "text-zinc-400"}`}
                        aria-hidden
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-zinc-100 p-3 space-y-1">
        <Link
          href="/dashboard/alunos/novo"
          onClick={onNavigate}
          className="admin-focus-ring flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-[color:var(--admin-accent)] px-3 py-2.5 text-sm font-semibold text-[color:var(--admin-accent-foreground)] shadow-md shadow-rose-500/25 transition hover:bg-[color:var(--admin-accent-hover)] active:scale-[0.99] motion-reduce:active:scale-100"
        >
          + Novo aluno
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Site público
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
