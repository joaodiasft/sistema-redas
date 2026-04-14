"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { revalidateAdminDashboard } from "@/lib/revalidate-admin";
import { revalidatePainelProfessor } from "@/lib/revalidate-paineis";
import { assertAdminMutation } from "@/lib/require-admin-mutation";

export type CursoActionState = { ok: boolean; error?: string };

export async function criarCurso(
  _prev: CursoActionState,
  formData: FormData,
): Promise<CursoActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const codigo = String(formData.get("codigo") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const ativo = formData.get("ativo") === "on" || formData.get("ativo") === "true";

  if (!codigo || !nome) {
    return { ok: false, error: "Código e nome são obrigatórios." };
  }

  try {
    await prisma.curso.create({
      data: { codigo, nome, ativo },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique") || msg.includes("unique")) {
      return { ok: false, error: "Já existe curso com este código." };
    }
    return { ok: false, error: "Não foi possível criar o curso." };
  }

  revalidatePath("/dashboard/cursos");
  revalidatePath("/dashboard/cursos-turmas");
  revalidatePath("/dashboard/turmas");
  revalidateAdminDashboard();
  revalidatePainelProfessor();
  return { ok: true };
}

export async function atualizarCurso(
  _prev: CursoActionState,
  formData: FormData,
): Promise<CursoActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const id = String(formData.get("id") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const ativo = formData.get("ativo") === "on" || formData.get("ativo") === "true";

  if (!id || !codigo || !nome) {
    return { ok: false, error: "Dados incompletos." };
  }

  try {
    await prisma.curso.update({
      where: { id },
      data: { codigo, nome, ativo },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique") || msg.includes("unique")) {
      return { ok: false, error: "Código já utilizado por outro curso." };
    }
    return { ok: false, error: "Não foi possível atualizar." };
  }

  revalidatePath("/dashboard/cursos");
  revalidatePath("/dashboard/cursos-turmas");
  revalidateAdminDashboard();
  revalidatePainelProfessor();
  return { ok: true };
}

export async function excluirCurso(
  _prev: CursoActionState,
  formData: FormData,
): Promise<CursoActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "ID inválido." };

  const n = await prisma.turma.count({ where: { cursoId: id } });
  if (n > 0) {
    return {
      ok: false,
      error: `Este curso possui ${n} turma(s). Exclua ou mova as turmas antes.`,
    };
  }

  try {
    await prisma.curso.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Não foi possível excluir o curso." };
  }
  revalidatePath("/dashboard/cursos");
  revalidatePath("/dashboard/cursos-turmas");
  revalidateAdminDashboard();
  revalidatePainelProfessor();
  return { ok: true };
}
