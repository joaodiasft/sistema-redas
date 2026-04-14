"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  Home,
  LogOut,
  Menu,
  PenLine,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

const nav = (
  showRedacoes: boolean,
): { href: string; label: string; icon: typeof Home }[] => {
  const base: { href: string; label: string; icon: typeof Home }[] = [
    { href: "/painel/aluno", label: "Início", icon: Home },
    { href: "/painel/aluno/financeiro", label: "Financeiro", icon: Wallet },
    { href: "/painel/aluno/frequencia", label: "Frequência", icon: BookOpen },
    { href: "/painel/aluno/avisos", label: "Avisos", icon: Bell },
  ];
  if (showRedacoes) {
    base.push({ href: "/painel/aluno/redacoes", label: "Redações", icon: PenLine });
  }
  base.push({ href: "/painel/aluno/relatorios", label: "Relatórios", icon: BarChart3 });
  return base;
};

function active(pathname: string, href: string) {
  if (href === "/painel/aluno") return pathname === "/painel/aluno";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AlunoShell({
  alunoNome,
  alunoCodigo,
  showRedacoes,
  children,
}: {
  alunoNome: string;
  alunoCodigo: string;
  showRedacoes: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = nav(showRedacoes);

  return (
    <div className="min-h-screen bg-[#f8f7fa] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-sm lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-[#be123c]">
                Redação Nota Mil
              </p>
              <p className="truncate text-xs text-zinc-500">
                <span className="font-medium text-zinc-700">{alunoNome}</span>
                <span className="text-zinc-400"> · {alunoCodigo}</span>
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-1 lg:flex">
            {items.map((item) => {
              const Icon = item.icon;
              const on = active(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                    on
                      ? "bg-rose-50 text-[#be123c] shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="ml-2 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Site
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                window.location.href = "/login";
              }}
              className="ml-1 flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-zinc-100 bg-white px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Menu do aluno">
              {items.map((item) => {
                const Icon = item.icon;
                const on = active(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      on ? "bg-rose-50 text-[#be123c]" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Site público
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sair
              </button>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex gap-1 overflow-x-auto border-t border-zinc-200/80 bg-white/95 px-2 py-2 backdrop-blur-md lg:hidden"
        aria-label="Atalhos"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const on = active(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[4.25rem] shrink-0 flex-col items-center gap-0.5 rounded-lg py-1 text-[0.65rem] font-semibold ${
                on ? "text-[#be123c]" : "text-zinc-500"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="max-w-[4.5rem] truncate text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="h-16 lg:hidden" aria-hidden />
    </div>
  );
}
