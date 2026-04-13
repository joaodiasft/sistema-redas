"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({
  children,
  userLabel,
}: {
  children: React.ReactNode;
  userLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f2f5]">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-[1px] lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:static lg:z-0 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar onNavigate={() => setOpen(false)} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200/80 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:hidden">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 p-2 text-zinc-700 hover:bg-zinc-50"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900">Admin</p>
            <p className="truncate text-xs text-zinc-500">{userLabel}</p>
          </div>
        </header>
        {children}
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
