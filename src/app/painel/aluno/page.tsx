import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutPainelButton } from "@/components/painel/logout-painel-button";
import { getSessionFromCookies } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export default async function PainelAlunoPage() {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "ALUNO") {
    redirect("/login");
  }

  const aluno = await prisma.aluno.findFirst({
    where: { usuarioId: session.userId },
    include: { matriculas: { include: { turma: true, curso: true } } },
  });

  return (
    <div className="min-h-screen bg-[#f4f2f5]">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c41062]">
          Área do aluno
        </p>
        <h1 className="text-xl font-bold text-zinc-900">Olá, {session.email}</h1>
      </header>
      <main className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Seus vínculos</h2>
          {aluno?.matriculas.length ? (
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              {aluno.matriculas.map((m) => (
                <li key={m.id}>
                  <strong className="text-zinc-800">{m.curso.nome}</strong> — {m.turma.nome}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">Nenhuma turma vinculada ainda.</p>
          )}
        </div>
        <p className="text-center text-sm text-zinc-500">
          O painel completo do aluno (aulas, redações, financeiro) será expandido aqui.
        </p>
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
