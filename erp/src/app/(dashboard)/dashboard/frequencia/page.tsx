import { ErpHeader } from "@/components/erp/erp-header";

export default function FrequenciaPage() {
  return (
    <>
      <ErpHeader titulo="Frequência" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          Registros <code className="rounded bg-zinc-100 px-1">PresencaEncontro</code>: data, presente,
          reposição, entregou redação, referência de assinatura. Visão por turma / data / módulo.
        </p>
      </div>
    </>
  );
}
