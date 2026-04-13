"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

const grupos: { titulo: string; itens: Item[] }[] = [
  {
    titulo: "Área geral",
    itens: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/relatorios", label: "Relatórios" },
      { href: "/dashboard/calendario-geral", label: "Calendário geral" },
    ],
  },
  {
    titulo: "Cadastro",
    itens: [
      { href: "/dashboard/alunos", label: "Alunos" },
      { href: "/dashboard/cursos-turmas", label: "Cursos & turmas" },
      { href: "/dashboard/professores", label: "Professores" },
      { href: "/dashboard/modulos", label: "Módulos" },
    ],
  },
  {
    titulo: "Operacional",
    itens: [
      { href: "/dashboard/operacional/presenca", label: "Presença" },
      { href: "/dashboard/operacional/reposicao", label: "Reposição" },
      { href: "/dashboard/operacional/calendario", label: "Calendário operacional" },
      { href: "/dashboard/operacional/financeiro", label: "Financeiro" },
      { href: "/dashboard/operacional/redacao", label: "Entrega de redação" },
    ],
  },
  {
    titulo: "Configurações",
    itens: [
      { href: "/dashboard/configuracoes", label: "Visão geral" },
      { href: "/dashboard/configuracoes/acesso-aluno", label: "Limite de acesso" },
      { href: "/dashboard/configuracoes/sistema", label: "Sistema" },
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
    <div className="flex h-full flex-col border-r border-zinc-200/80 bg-white">
      <div className="border-b border-zinc-100 px-4 py-4">
        <span className="text-lg font-bold tracking-tight text-[#c41062]">
          Redação Nota Mil
        </span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Painel administrativo
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Módulos admin">
        {grupos.map((g) => (
          <div key={g.titulo} className="mb-4">
            <p className="mb-1.5 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400">
              {g.titulo}
            </p>
            <ul className="space-y-0.5">
              {g.itens.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                      ativo(item.href)
                        ? "bg-gradient-to-r from-[#fde7f1] to-white text-[#ad1457]"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-zinc-100 p-3">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-center text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Site público
        </Link>
      </div>
    </div>
  );
}
