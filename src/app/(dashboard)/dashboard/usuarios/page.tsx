import { ErpHeader } from "@/components/erp/erp-header";

export default function UsuariosPage() {
  return (
    <>
      <ErpHeader titulo="Usuários & perfis" />
      <div className="flex-1 p-6">
        <p className="max-w-2xl text-sm text-zinc-600">
          <code className="rounded bg-zinc-100 px-1">Usuario</code> com{" "}
          <code className="rounded bg-zinc-100 px-1">PerfilUsuario</code>: admin, coordenador,
          professor, recepção, aluno. Integrar NextAuth ou similar em produção.
        </p>
      </div>
    </>
  );
}
