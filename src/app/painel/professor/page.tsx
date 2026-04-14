import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutPainelButton } from "@/components/painel/logout-painel-button";
import { getSessionFromCookies } from "@/lib/auth-server";

export default async function PainelProfessorPage() {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "PROFESSOR") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f2f5]">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c41062]">
          Área do professor
        </p>
        <h1 className="text-xl font-bold text-zinc-900">{session.email}</h1>
      </header>
      <main className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">
            Em breve: turmas, frequência e materiais vinculados ao seu cadastro.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <LogoutPainelButton />
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-[#c41062] hover:underline">
            Site público
          </Link>
        </div>
      </main>
    </div>
  );
}
