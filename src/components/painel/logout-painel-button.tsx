"use client";

export function LogoutPainelButton() {
  return (
    <button
      type="button"
      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        window.location.href = "/login";
      }}
    >
      Sair
    </button>
  );
}
