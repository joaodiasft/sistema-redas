"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { revalidateAdminDashboard } from "@/lib/revalidate-admin";
import { revalidatePainelProfessor } from "@/lib/revalidate-paineis";
import { assertAdminMutation } from "@/lib/require-admin-mutation";

export type ModuloActionState = { ok: boolean; error?: string };

export async function criarModulo(
  _prev: ModuloActionState,
  formData: FormData,
): Promise<ModuloActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const semestreId = String(formData.get("semestreId") ?? "").trim();
  const numero = Number(formData.get("numero") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim() || null;
  const codigoPublico = String(formData.get("codigoPublico") ?? "").trim() || null;
  const mesReferencia = formData.get("mesReferencia")
    ? Number(formData.get("mesReferencia"))
    : null;
  const anoReferencia = formData.get("anoReferencia")
    ? Number(formData.get("anoReferencia"))
    : null;

  if (!semestreId || !Number.isFinite(numero)) {
    return { ok: false, error: "Semestre e número do módulo são obrigatórios." };
  }

  try {
    await prisma.moduloCurso.create({
      data: {
        semestreId,
        numero,
        titulo,
        codigoPublico,
        mesReferencia: mesReferencia ?? undefined,
        anoReferencia: anoReferencia ?? undefined,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao criar.";
    return { ok: false, error: msg.includes("Unique") ? "Código do módulo já existe." : msg };
  }

  revalidatePath("/dashboard/modulos");
  revalidatePath("/dashboard");
  revalidateAdminDashboard();
  revalidatePainelProfessor();
  return { ok: true };
}

export async function excluirModuloAction(formData: FormData): Promise<void> {
  const denied = await assertAdminMutation();
  if (denied) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.moduloCurso.delete({ where: { id } });
  } catch {
    return;
  }
  revalidatePath("/dashboard/modulos");
  revalidateAdminDashboard();
  revalidatePainelProfessor();
}
