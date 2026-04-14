import { ErpHeader } from "@/components/erp/erp-header";

export default function UsuariosPage() {
  return (
    <>
      <ErpHeader titulo="Usuários & perfis" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          Três níveis em{" "}
          <code className="rounded bg-zinc-100 px-1">PerfilUsuario</code>:{" "}
          <strong className="font-medium text-zinc-800">ADMIN</strong> (acesso total ao ERP),{" "}
          <strong className="font-medium text-zinc-800">PROFESSOR</strong> e{" "}
          <strong className="font-medium text-zinc-800">ALUNO</strong> (painéis em{" "}
          <code className="rounded bg-zinc-100 px-1">/painel</code>, somente visualização).
        </p>
      </div>
    </>
  );
}
