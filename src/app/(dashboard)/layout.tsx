import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSessionFromCookies } from "@/lib/auth-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session || session.perfil !== "ADMIN") {
    redirect("/login");
  }

  return <AdminShell userLabel={session.email}>{children}</AdminShell>;
}
