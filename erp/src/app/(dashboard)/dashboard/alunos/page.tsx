import { ErpHeader } from "@/components/erp/erp-header";

export default function AlunosPage() {
  return (
    <>
      <ErpHeader titulo="Alunos" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          CRUD de alunos ligado ao modelo <code className="rounded bg-zinc-100 px-1">Aluno</code> —
          cabeçalho da ficha: nome, turma, e-mail, telefone, Sofia, Coredação. Implementar listagem,
          filtros por turma e vínculo opcional com <code className="rounded bg-zinc-100 px-1">Usuario</code>.
        </p>
      </div>
    </>
  );
}
