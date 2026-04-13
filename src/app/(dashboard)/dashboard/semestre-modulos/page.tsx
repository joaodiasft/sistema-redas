import { ErpHeader } from "@/components/erp/erp-header";

export default function SemestreModulosPage() {
  return (
    <>
      <ErpHeader titulo="Semestre & módulos" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          Cadastro de <code className="rounded bg-zinc-100 px-1">Semestre</code>,{" "}
          <code className="rounded bg-zinc-100 px-1">ModuloCurso</code> (2º–5º) e{" "}
          <code className="rounded bg-zinc-100 px-1">Encontro</code> (I–IV). Espelha a grade da
          ficha impressa para gerar linhas de frequência e material.
        </p>
      </div>
    </>
  );
}
