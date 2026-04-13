import { ErpHeader } from "@/components/erp/erp-header";

export default function TurmasPage() {
  return (
    <>
      <ErpHeader titulo="Turmas" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          Gestão de <code className="rounded bg-zinc-100 px-1">Turma</code> (nome, horário, ativa).
          Base para filtrar alunos e relatórios.
        </p>
      </div>
    </>
  );
}
