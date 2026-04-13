import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-brand-dark">
          ERP Curso de Redação
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-zinc-900">Entrar</h1>
        <p className="mt-1 text-center text-sm text-zinc-500">
          Acesso administrativo e do aluno (auth a implementar)
        </p>
        <form className="mt-8 space-y-4" action="#" method="post">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-brand focus:ring-2"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-zinc-700">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-brand focus:ring-2"
            />
          </div>
          <Link
            href="/dashboard"
            className="block w-full rounded-full bg-brand py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Entrar (demo)
          </Link>
        </form>
      </div>
      <p className="mt-6 text-center text-xs text-zinc-400">
        Domínio de produção:{" "}
        <a href="https://www.redacaonotamil.shop" className="text-brand underline">
          redacaonotamil.shop
        </a>
      </p>
    </div>
  );
}
