"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-top-bar";

export function AdminShell({
  children,
  userLabel,
}: {
  children: React.ReactNode;
  userLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-app-bg isolate min-h-dvh pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <a
        href="#admin-main"
        className="fixed left-4 top-0 z-[100] -translate-y-full rounded-b-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[color:var(--admin-accent)] focus:ring-offset-2 motion-reduce:transition-none"
      >
        Ir para o conteúdo principal
      </a>
      <div className="mx-auto box-border max-w-[1680px] p-3 sm:p-4 md:p-6">
        <div className="flex min-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-2xl border border-[color:var(--admin-frame-border)] bg-[var(--admin-surface)] shadow-[var(--admin-elevation-shell)] sm:min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-3rem)]">
          {open ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            />
          ) : null}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] transform border-r border-zinc-100 bg-white transition-transform duration-200 ease-out motion-reduce:transition-none lg:static lg:z-0 lg:max-w-none lg:translate-x-0 ${
              open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </aside>
          <main
            id="admin-main"
            tabIndex={-1}
            className="flex min-h-0 min-w-0 flex-1 flex-col scroll-mt-4 bg-[var(--admin-main-surface)] outline-none"
          >
            <div className="flex items-center gap-2 border-b border-zinc-200/80 bg-white px-3 py-2.5 pl-[max(0.75rem,env(safe-area-inset-left))] lg:hidden">
              <button
                type="button"
                className="admin-focus-ring flex h-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 touch-manipulation hover:bg-zinc-50 active:bg-zinc-100"
                aria-label="Abrir menu"
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900">Painel</p>
                <p className="truncate text-xs text-zinc-500">{userLabel}</p>
              </div>
            </div>
            <AdminTopBar userLabel={userLabel} />
            <div className="flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
