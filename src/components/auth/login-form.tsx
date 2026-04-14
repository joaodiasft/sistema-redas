"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { whatsAppLink } from "@/lib/whatsapp";

const MSG_RECUPERAR =
  "esqueci minha senha, preciso recuperar";
const MSG_CRIAR_CONTA =
  "Olá! Não tenho conta e gostaria de solicitar um acesso à plataforma Redação Nota Mil.";
const MSG_SUPORTE =
  "Olá! Preciso de suporte na plataforma Redação Nota Mil.";

export function LoginForm() {
  const idEmail = useId();
  const idSenha = useId();
  const idLembrar = useId();
  const [showSenha, setShowSenha] = useState(false);
  const [socialHint, setSocialHint] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<"termos" | "privacidade" | null>(
    null,
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const senha = String(fd.get("senha") ?? "");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        perfil?: string;
      };
      if (!res.ok) {
        setLoginError(
          data.error ??
            (res.status === 401
              ? "E-mail ou senha incorretos. Verifique e tente novamente."
              : "Não foi possível entrar. Tente novamente."),
        );
        setLoginLoading(false);
        return;
      }
      const dest =
        data.perfil === "ALUNO"
          ? "/painel/aluno"
          : data.perfil === "PROFESSOR"
            ? "/painel/professor"
            : "/dashboard";
      // Navegação completa: evita duplo trabalho do router + refresh e sente-se mais rápido.
      window.location.assign(dest);
    } catch {
      setLoginError("Falha de conexão. Verifique a internet e tente de novo.");
      setLoginLoading(false);
    }
  }

  useEffect(() => {
    if (!legalModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLegalModal(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [legalModal]);

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-[1.75rem] border border-zinc-100/80 bg-white px-8 py-10 shadow-[0_24px_80px_-12px_rgba(216,27,96,0.12),0_12px_32px_-8px_rgba(15,23,42,0.08)] sm:px-10">
        <div className="text-center">
          <p className="font-semibold tracking-tight text-[#d81b60]">
            Redação Nota Mil
          </p>
          <p className="mt-1 text-sm font-medium tracking-wide text-zinc-500">
            Escrita para o sucesso
          </p>
        </div>
        <h1 className="mt-5 text-center text-[1.65rem] font-bold leading-tight tracking-tight text-zinc-900">
          Bem-vindo
        </h1>
        <p className="mt-2 text-center text-[0.9375rem] leading-relaxed text-zinc-500">
          Acesse sua conta para continuar sua jornada.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor={idEmail}
              className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-400"
            >
              E-mail
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                aria-hidden
              >
                <EnvelopeIcon />
              </span>
            <input
              id={idEmail}
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loginLoading}
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-11 pr-3.5 text-[0.9375rem] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#d81b60]/40 focus:bg-white focus:ring-2 focus:ring-[#d81b60]/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label
                htmlFor={idSenha}
                className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-400"
              >
                Senha
              </label>
              <a
                href={whatsAppLink(MSG_RECUPERAR)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.8125rem] font-medium text-[#d81b60] transition hover:text-[#ad1457]"
              >
                Esqueci minha senha
              </a>
            </div>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                aria-hidden
              >
                <LockIcon />
              </span>
              <input
                id={idSenha}
                name="senha"
                type={showSenha ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={loginLoading}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-11 pr-12 text-[0.9375rem] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#d81b60]/40 focus:bg-white focus:ring-2 focus:ring-[#d81b60]/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showSenha ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 select-none">
            <input
              id={idLembrar}
              name="lembrar"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-[#d81b60] focus:ring-[#d81b60]/30"
            />
            <span className="text-sm text-zinc-600">Lembrar de mim</span>
          </label>

          {loginError ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-center text-sm text-red-800"
              role="alert"
            >
              {loginError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loginLoading}
            className="relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#e91e8c] to-[#c2185b] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-4px_rgba(216,27,96,0.45)] transition hover:brightness-[1.05] enabled:active:scale-[0.99] disabled:cursor-wait disabled:opacity-90"
          >
            {loginLoading ? (
              <>
                <Spinner />
                <span>Entrando…</span>
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {socialHint ? (
          <p
            className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2.5 text-center text-xs font-medium text-amber-900"
            role="status"
          >
            {socialHint}
          </p>
        ) : null}

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Ou acesse com
          </span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setSocialHint("Login com Google — implementação futura.")
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200/90 bg-zinc-50 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
          >
            <GoogleIcon className="h-5 w-5" />
            Google
          </button>
          <button
            type="button"
            onClick={() =>
              setSocialHint("Login com Apple — implementação futura.")
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200/90 bg-zinc-50 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
          >
            <AppleIcon className="h-5 w-5" />
            Apple
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Não tem uma conta?{" "}
          <a
            href={whatsAppLink(MSG_CRIAR_CONTA)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#d81b60] hover:text-[#ad1457]"
          >
            Crie agora
          </a>
        </p>
      </div>

      <nav
        className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400"
        aria-label="Links institucionais"
      >
        <button
          type="button"
          onClick={() => setLegalModal("termos")}
          className="border-0 bg-transparent p-0 font-inherit text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:text-zinc-600"
        >
          Termos
        </button>
        <button
          type="button"
          onClick={() => setLegalModal("privacidade")}
          className="border-0 bg-transparent p-0 font-inherit text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:text-zinc-600"
        >
          Privacidade
        </button>
        <a
          href={whatsAppLink(MSG_SUPORTE)}
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-zinc-600"
        >
          Suporte
        </a>
      </nav>

      <LegalSheetPortal
        variant={legalModal}
        onClose={() => setLegalModal(null)}
      />

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-700 hover:underline"
        >
          ← Voltar à página inicial
        </Link>
      </p>
    </div>
  );
}

function LegalSheetPortal({
  variant,
  onClose,
}: {
  variant: "termos" | "privacidade" | null;
  onClose: () => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready || !variant || typeof document === "undefined") return null;
  return createPortal(
    <LegalSheet variant={variant} onClose={onClose} />,
    document.body,
  );
}

function LegalSheet({
  variant,
  onClose,
}: {
  variant: "termos" | "privacidade";
  onClose: () => void;
}) {
  const title = variant === "termos" ? "Termos de uso" : "Privacidade";
  const titleId = `legal-${variant}-title`;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(85vh,560px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#e91e8c] via-[#d81b60] to-[#ad1457]" />
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 pb-4 pt-5 sm:px-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#d81b60]/90">
              Redação Nota Mil
            </p>
            <h2
              id={titleId}
              className="mt-1 text-lg font-bold tracking-tight text-zinc-900"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-zinc-600 sm:px-6 sm:py-5">
          {variant === "termos" ? <TermosContent /> : <PrivacidadeContent />}
        </div>
        <div className="border-t border-zinc-100 bg-zinc-50/80 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

function TermosContent() {
  return (
    <div className="space-y-4">
      <p>
        Estes termos resumem as regras de uso da plataforma{" "}
        <strong className="font-semibold text-zinc-800">Redação Nota Mil</strong>{" "}
        de forma clara e objetiva.
      </p>
      <ul className="list-disc space-y-2 pl-4 marker:text-[#d81b60]">
        <li>
          A plataforma oferece ambiente para estudo, prática de redação e
          acompanhamento do curso, conforme o acesso concedido à sua conta.
        </li>
        <li>
          Você se compromete a fornecer dados verdadeiros no cadastro e a
          manter sua senha em sigilo. O uso da conta é pessoal e intransferível.
        </li>
        <li>
          Materiais, textos e recursos disponibilizados destinam-se ao uso
          educacional vinculado ao curso; a reprodução indevida pode violar
          direitos autorais.
        </li>
        <li>
          Podemos atualizar funcionalidades ou estes termos; em mudanças
          relevantes, buscaremos informar pelos canais habituais da plataforma.
        </li>
        <li>
          Dúvidas sobre estas condições podem ser esclarecidas pelo{" "}
          <strong className="font-semibold text-zinc-800">Suporte</strong>{" "}
          (WhatsApp).
        </li>
      </ul>
      <p className="rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
        Texto informativo. Para contratos ou documentos oficiais, consulte a
        equipe do curso.
      </p>
    </div>
  );
}

function PrivacidadeContent() {
  return (
    <div className="space-y-4">
      <p>
        Sua privacidade importa. Abaixo, um resumo em linguagem direta sobre
        como tratamos dados na{" "}
        <strong className="font-semibold text-zinc-800">Redação Nota Mil</strong>
        .
      </p>
      <ul className="list-disc space-y-2 pl-4 marker:text-[#d81b60]">
        <li>
          <strong className="font-semibold text-zinc-800">O que coletamos:</strong>{" "}
          dados necessários para criar e manter sua conta e o curso — por
          exemplo, nome, e-mail e informações de uso da plataforma (como progresso
          em atividades), conforme o que for pedido no cadastro.
        </li>
        <li>
          <strong className="font-semibold text-zinc-800">Para quê:</strong>{" "}
          autenticar o acesso, enviar comunicações sobre o curso, prestar
          suporte e melhorar a experiência na plataforma.
        </li>
        <li>
          <strong className="font-semibold text-zinc-800">Compartilhamento:</strong>{" "}
          não vendemos seus dados pessoais. Podemos envolver prestadores de
          serviço (hospedagem, e-mail etc.) sob obrigação de confidencialidade, ou
          divulgar dados se a lei exigir.
        </li>
        <li>
          <strong className="font-semibold text-zinc-800">Segurança:</strong>{" "}
          adotamos medidas razoáveis de proteção. Nenhum sistema é totalmente
          livre de riscos — use senha forte e não compartilhe seu login.
        </li>
        <li>
          <strong className="font-semibold text-zinc-800">Seus direitos:</strong>{" "}
          você pode pedir esclarecimentos ou correções pelos nossos canais de{" "}
          <strong className="font-semibold text-zinc-800">Suporte</strong>.
        </li>
      </ul>
      <p className="rounded-xl border border-[#d81b60]/15 bg-gradient-to-br from-[#fff5f9] to-white px-4 py-3 text-xs text-zinc-600">
        Este resumo visa transparência. Detalhes adicionais podem constar em
        políticas ou contratos específicos fornecidos pelo curso.
      </p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent"
      aria-hidden
    />
  );
}

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="11"
        width="16"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4l16 16M8 8.5C6.5 9.5 5.3 11 4.5 12c0 0 4 6 10 6 1.2 0 2.4-.2 3.5-.6M10.5 5.5c.8-.2 1.6-.3 2.5-.3 6 0 10 6 10 6-.7 1.1-1.6 2.2-2.6 3.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
