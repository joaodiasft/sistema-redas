"use client";

import { Bell, Search, Settings } from "lucide-react";

export function AdminTopBar({ userLabel }: { userLabel: string }) {
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-zinc-200/90 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="relative hidden min-w-0 flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Buscar alunos, turmas ou notas…"
          className="w-full max-w-xl rounded-xl border border-zinc-200 bg-zinc-50/80 py-2 pl-9 pr-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition focus:border-[#e11d48]/30 focus:bg-white focus:ring-2 focus:ring-[#e11d48]/10"
          readOnly
          title="Busca em breve"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
        <button
          type="button"
          className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="Configurações"
        >
          <Settings className="h-5 w-5" />
        </button>
        <div className="ml-1 hidden min-w-0 flex-col items-end text-right sm:flex">
          <span className="truncate text-xs font-semibold text-zinc-900">Admin</span>
          <span className="max-w-[200px] truncate text-[0.65rem] text-zinc-500">{userLabel}</span>
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e11d48] to-[#f472b6] text-xs font-bold text-white shadow-inner"
          aria-hidden
        >
          AD
        </div>
      </div>
    </header>
  );
}
