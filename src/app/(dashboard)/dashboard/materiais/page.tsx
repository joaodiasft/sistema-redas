import { redirect } from "next/navigation";

/** Materiais por módulo/encontro: use cadastro de módulos e presença. */
export default function MateriaisPage() {
  redirect("/dashboard/modulos");
}
