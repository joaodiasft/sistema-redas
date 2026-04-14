"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { revalidateAdminDashboard } from "@/lib/revalidate-admin";
import { revalidatePainelProfessor } from "@/lib/revalidate-paineis";
import { assertAdminMutation } from "@/lib/require-admin-mutation";

export type PresencaState = { ok: boolean; error?: string };

export async function salvarPresencas(_prev: PresencaState, formData: FormData): Promise<PresencaState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const encontroId = String(formData.get("encontroId") ?? "").trim();
  const dataAulaStr = String(formData.get("dataAula") ?? "").trim();
  if (!encontroId || !dataAulaStr) {
    return { ok: false, error: "Encontro e data são obrigatórios." };
  }
  const dataAula = new Date(dataAulaStr);
  if (Number.isNaN(dataAula.getTime())) {
    return { ok: false, error: "Data inválida." };
  }

  const alunoIds = formData.getAll("alunoId").map(String);
  if (alunoIds.length === 0) {
    return { ok: false, error: "Nenhum aluno no formulário." };
  }

  try {
    await prisma.$transaction(
      alunoIds.map((alunoId) => {
        const presente = formData.get(`presente_${alunoId}`) === "on";
        return prisma.presencaEncontro.upsert({
          where: {
            alunoId_encontroId: { alunoId, encontroId },
          },
          create: {
            alunoId,
            encontroId,
            dataAula,
            presente,
          },
          update: {
            dataAula,
            presente,
          },
        });
      }),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar.";
    return { ok: false, error: msg };
  }

  revalidatePath("/dashboard/operacional/presenca");
  revalidateAdminDashboard();
  revalidatePainelProfessor();
  return { ok: true };
}
