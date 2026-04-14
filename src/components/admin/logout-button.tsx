"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        window.location.href = "/login";
      }}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
