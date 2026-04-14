import { redirect } from "next/navigation";

/** Rota legada: a frequência operacional está em Presença. */
export default function FrequenciaPage() {
  redirect("/dashboard/operacional/presenca");
}
