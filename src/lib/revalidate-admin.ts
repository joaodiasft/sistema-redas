import { revalidatePath } from "next/cache";

/** Atualiza métricas e widgets do painel principal após alterações nos dados. */
export function revalidateAdminDashboard() {
  revalidatePath("/dashboard", "layout");
}
