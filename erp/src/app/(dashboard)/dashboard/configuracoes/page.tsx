import { ErpHeader } from "@/components/erp/erp-header";

export default function ConfiguracoesPage() {
  return (
    <>
      <ErpHeader titulo="Configurações" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          Dados da instituição, integrações (e-mail, WhatsApp API), políticas de senha, ambiente e
          chaves (.env).
        </p>
      </div>
    </>
  );
}
