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
    <div className="admin-app-bg min-h-screen">
      <div className="mx-auto max-w-[1680px] p-3 sm:p-4 md:p-6">
        <div className="flex min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-2xl border border-zinc-800/20 bg-white shadow-2xl shadow-black/40">
          {open ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            />
          ) : null}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-100 bg-white transition-transform duration-200 ease-out lg:static lg:z-0 lg:translate-x-0 ${
              open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </aside>
          <div className="flex min-w-0 flex-1 flex-col bg-[#fafafa]">
            <div className="flex items-center gap-2 border-b border-zinc-200/80 bg-white px-3 py-2 lg:hidden">
              <button
                type="button"
                className="rounded-lg border border-zinc-200 p-2 text-zinc-700 hover:bg-zinc-50"
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
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
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
