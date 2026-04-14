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
    { href: "/painel/aluno/financeiro", label: "Financ.", icon: Wallet },
    { href: "/painel/aluno/frequencia", label: "Freq.", icon: BookOpen },
    { href: "/painel/aluno/avisos", label: "Avisos", icon: Bell },
  ];
  if (showRedacoes) {
    base.push({ href: "/painel/aluno/redacoes", label: "Redações", icon: PenLine });
  }
  base.push({ href: "/painel/aluno/relatorios", label: "PDF", icon: BarChart3 });
  return base;
};

function active(pathname: string, href: string) {
  if (href === "/painel/aluno") return pathname === "/painel/aluno";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkDesk =
  "painel-interactive painel-focus-ring-aluno flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium";
const linkDeskOn = "bg-rose-50 text-rose-950 shadow-sm ring-1 ring-rose-100";
const linkDeskOff = "text-zinc-600 hover:bg-white/80 hover:text-zinc-900";

const btnIcon =
  "painel-interactive painel-focus-ring-aluno flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-white text-zinc-700 shadow-sm hover:border-rose-200 hover:bg-rose-50/50 lg:hidden";

const btnGhost =
  "painel-interactive painel-focus-ring-aluno ml-1 flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm hover:border-zinc-300 hover:bg-zinc-50";

const linkSite =
  "painel-interactive painel-focus-ring-aluno ml-1 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800";

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
    <div className="painel-aluno-bg isolate min-h-dvh text-zinc-900">
      <a
        href="#painel-main"
        className="fixed left-4 top-0 z-[100] -translate-y-full rounded-b-xl bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 motion-reduce:transition-none"
      >
        Ir para o conteúdo principal
      </a>
      <header className="sticky top-0 z-40 border-b border-rose-200/50 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className={btnIcon}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-tight text-rose-800">
                Redação Nota Mil
              </p>
              <p className="truncate text-xs text-zinc-500">
                <span className="font-medium text-zinc-700">{alunoNome}</span>
                <span className="text-zinc-400"> · {alunoCodigo}</span>
              </p>
            </div>
          </div>
          <div className="hidden flex-wrap items-center justify-end gap-1 lg:flex">
            {items.map((item) => {
              const Icon = item.icon;
              const on = active(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkDesk} ${on ? linkDeskOn : linkDeskOff}`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.label.split(" ")[0]}</span>
                </Link>
              );
            })}
            <Link href="/" className={linkSite}>
              <FileText className="h-4 w-4" aria-hidden />
              Site
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                window.location.href = "/login";
              }}
              className={btnGhost}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-rose-100/80 bg-white px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Menu do aluno">
              {items.map((item) => {
                const Icon = item.icon;
                const on = active(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`painel-interactive painel-focus-ring-aluno flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium ${
                      on ? "bg-rose-50 text-rose-950 ring-1 ring-rose-100" : "text-zinc-700 hover:bg-zinc-50"
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
                className="painel-interactive painel-focus-ring-aluno flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Site público
              </Link>
              <button
                type="button"
                className="painel-interactive painel-focus-ring-aluno flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50"
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

      <main
        id="painel-main"
        tabIndex={-1}
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-6 sm:px-6 sm:py-8 lg:py-10"
      >
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-rose-100/90 bg-white/95 pb-nav-safe shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden"
        aria-label="Atalhos"
      >
        <div className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-0 overflow-x-auto px-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const Icon = item.icon;
            const on = active(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`painel-interactive painel-focus-ring-aluno flex min-h-[3.5rem] min-w-[4.5rem] shrink-0 snap-start flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[0.65rem] font-semibold leading-tight active:scale-[0.98] motion-reduce:active:scale-100 ${
                  on ? "text-rose-900" : "text-zinc-500"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    on ? "bg-rose-100 text-rose-900" : "bg-zinc-100/80 text-zinc-500"
                  }`}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
                </span>
                <span className="max-w-[4.75rem] truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="h-[4.5rem] sm:h-20 lg:hidden" aria-hidden />
    </div>
  );
}
