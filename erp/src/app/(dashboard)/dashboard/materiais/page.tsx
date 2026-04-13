import { ErpHeader } from "@/components/erp/erp-header";

export default function MateriaisPage() {
  return (
    <>
      <ErpHeader titulo="Materiais" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          <code className="rounded bg-zinc-100 px-1">MaterialEncontro</code>: proposta, material da
          aula, pasta — por aluno e encontro (equivalente ao “P” na ficha).
        </p>
      </div>
    </>
  );
}
