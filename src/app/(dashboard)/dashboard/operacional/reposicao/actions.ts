"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ReposicaoState = { ok: boolean; error?: string };

export async function registrarReposicao(
  _prev: ReposicaoState,
  formData: FormData,
): Promise<ReposicaoState> {
  const alunoId = String(formData.get("alunoId") ?? "").trim();
  const dataStr = String(formData.get("dataReposicao") ?? "").trim();
  const descricaoFalta = String(formData.get("descricaoFalta") ?? "").trim();
  const moduloRef = String(formData.get("moduloRef") ?? "").trim() || null;

  if (!alunoId || !dataStr) {
    return { ok: false, error: "Aluno e data da reposição são obrigatórios." };
  }

  const dataReposicao = new Date(dataStr);
  if (Number.isNaN(dataReposicao.getTime())) {
    return { ok: false, error: "Data inválida." };
  }

  try {
    await prisma.reposicaoRegistro.create({
      data: {
        alunoId,
        dataReposicao,
        descricaoFalta: descricaoFalta || null,
        moduloRef,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar.";
    return { ok: false, error: msg };
  }

  revalidatePath("/dashboard/operacional/reposicao");
  return { ok: true };
}
