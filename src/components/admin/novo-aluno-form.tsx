"use client";

import { useActionState } from "react";
import { criarAluno, type CriarAlunoState } from "@/app/(dashboard)/dashboard/alunos/actions";

type TurmaRow = {
  id: string;
  codigo: string;
  nome: string;
  curso: { id: string; nome: string; codigo: string };
};

const initial: CriarAlunoState = { ok: false };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm outline-none transition focus:border-[#e11d74]/50 focus:bg-white focus:ring-2 focus:ring-[#e11d74]/15";

export function NovoAlunoForm({ turmas }: { turmas: TurmaRow[] }) {
  const [state, action, pending] = useActionState(criarAluno, initial);

  return (
    <form action={action} className="space-y-8">
      {state.error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          Identificação
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo *" htmlFor="nomeCompleto">
            <input
              id="nomeCompleto"
              name="nomeCompleto"
              required
              className={inputClass}
              placeholder="Nome do aluno"
            />
          </Field>
          <Field label="E-mail de login *" htmlFor="emailLogin">
            <input
              id="emailLogin"
              name="emailLogin"
              type="email"
              required
              className={inputClass}
              placeholder="aluno@email.com"
            />
          </Field>
          <Field label="Telefone *" htmlFor="telefone">
            <input
              id="telefone"
              name="telefone"
              required
              className={inputClass}
              placeholder="(00) 00000-0000"
            />
          </Field>
          <Field label="Responsável" htmlFor="responsavel">
            <input
              id="responsavel"
              name="responsavel"
              className={inputClass}
              placeholder="Nome do responsável"
            />
          </Field>
          <Field label="Situação *" htmlFor="situacao">
            <select id="situacao" name="situacao" className={inputClass} required>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="DEVENDO">Devendo</option>
            </select>
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          Matrícula (até 2 turmas)
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Selecione a turma; o curso é vinculado automaticamente.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Turma principal *" htmlFor="turma1">
            <select id="turma1" name="turma1" required className={inputClass}>
              <option value="">Selecione…</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.curso.nome} — {t.nome} ({t.codigo})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Segunda turma (opcional)" htmlFor="turma2">
            <select id="turma2" name="turma2" className={inputClass} defaultValue="">
              <option value="">Nenhuma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.curso.nome} — {t.nome}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          Plano financeiro
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Plano *" htmlFor="tipoPlano">
            <select id="tipoPlano" name="tipoPlano" className={inputClass} required>
              <option value="MENSAL">Mensal (cobrança recorrente)</option>
              <option value="BIMESTRAL">Bimestral</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="BOLSA_50">Bolsa 50%</option>
              <option value="BOLSA_100">Bolsa 100%</option>
            </select>
          </Field>
          <Field label="Dia do pagamento (mensal)" htmlFor="diaPagamento">
            <input
              id="diaPagamento"
              name="diaPagamento"
              type="number"
              min={1}
              max={28}
              className={inputClass}
              placeholder="Ex.: 10"
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-amber-800/90">
          Planos bimestral/trimestral: escolha de meses e valores detalhados poderão ser
          refinados no módulo financeiro.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          Acessos externos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Sofia — e-mail" htmlFor="sofiaEmail">
            <input id="sofiaEmail" name="sofiaEmail" type="email" className={inputClass} />
          </Field>
          <Field label="Sofia — senha" htmlFor="sofiaSenha">
            <input id="sofiaSenha" name="sofiaSenha" type="text" className={inputClass} />
          </Field>
          <Field label="Coredação — e-mail" htmlFor="coreEmail">
            <input id="coreEmail" name="coreEmail" type="email" className={inputClass} />
          </Field>
          <Field label="Coredação — senha (padrão sugerida EUSOU1000)" htmlFor="coreSenha">
            <input
              id="coreSenha"
              name="coreSenha"
              type="text"
              className={inputClass}
              placeholder="EUSOU1000"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 text-sm text-zinc-600">
        <strong className="text-zinc-800">Senha da plataforma:</strong> o primeiro acesso usará a
        senha padrão configurada em Configurações (atualmente equivalente a{" "}
        <code className="rounded bg-white px-1">123456</code>). O aluno poderá alterar depois do
        login.
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#e11d74] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c41062] disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Salvar aluno"}
        </button>
      </div>

    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-zinc-600">
        {label}
      </label>
      {children}
    </div>
  );
}
