import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-dark">404</p>
      <h1 className="text-center text-2xl font-bold text-zinc-900">Página não encontrada</h1>
      <p className="max-w-md text-center text-sm text-zinc-600">
        O caminho não existe neste site. Se você acabou de configurar o domínio, confira na Vercel se o{" "}
        <strong>Root Directory</strong> do projeto está como <code className="rounded bg-zinc-200 px-1">erp</code>.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Página inicial
        </Link>
        <Link
          href="/login"
          className="rounded-full border-2 border-brand px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-soft"
        >
          Login do sistema
        </Link>
      </div>
    </div>
  );
}
