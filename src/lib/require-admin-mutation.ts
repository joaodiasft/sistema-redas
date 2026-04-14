import { getSessionFromCookies } from "@/lib/auth-server";

/** Mensagem para ações de formulário (server actions) quando não é ADMIN. */
export const ADMIN_MUTATION_DENIED =
  "Não autorizado. Apenas administradores podem alterar dados.";

/** Retorna mensagem de erro se a sessão não for de administrador; caso contrário `null`. */
export async function assertAdminMutation(): Promise<string | null> {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "ADMIN") return ADMIN_MUTATION_DENIED;
  return null;
}
