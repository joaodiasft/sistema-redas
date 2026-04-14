"use client";

import { Bell, Search, Settings } from "lucide-react";

export function AdminTopBar({ userLabel }: { userLabel: string }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[52px] shrink-0 items-center gap-3 border-b border-zinc-200/90 bg-white/95 px-4 py-2.5 backdrop-blur-md sm:min-h-14 sm:px-6 sm:py-3">
      <div className="relative hidden min-w-0 flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Buscar alunos, turmas ou notas…"
          className="admin-focus-ring w-full max-w-xl rounded-xl border border-zinc-200 bg-zinc-50/80 py-2.5 pl-9 pr-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition focus:border-[color:var(--admin-accent)]/35 focus:bg-white focus:ring-2 focus:ring-[color:var(--admin-accent)]/12"
          readOnly
          title="Busca em breve"
        />
      </div>
      <div className="flex min-h-[44px] flex-1 items-center justify-end gap-0.5 sm:gap-2">
        <button
          type="button"
          className="admin-focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 touch-manipulation transition hover:bg-zinc-100 hover:text-zinc-800 active:bg-zinc-200/80"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          className="admin-focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 touch-manipulation transition hover:bg-zinc-100 hover:text-zinc-800 active:bg-zinc-200/80"
          aria-label="Configurações"
        >
          <Settings className="h-5 w-5" aria-hidden />
        </button>
        <div className="ml-1 hidden min-w-0 flex-col items-end text-right sm:flex">
          <span className="truncate text-xs font-semibold text-zinc-900">Admin</span>
          <span className="max-w-[200px] truncate text-[0.65rem] text-zinc-500">{userLabel}</span>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--admin-accent)] to-pink-400 text-xs font-bold text-white shadow-inner"
          aria-hidden
        >
          AD
        </div>
      </div>
    </header>
  );
}
