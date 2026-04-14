"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { PerfilUsuario } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePainelProfessor } from "@/lib/revalidate-paineis";
import { assertAdminMutation } from "@/lib/require-admin-mutation";

export type ProfessorActionState = { ok: boolean; error?: string };

export async function criarProfessor(
  _prev: ProfessorActionState,
  formData: FormData,
): Promise<ProfessorActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const nome = String(formData.get("nome") ?? "").trim();
  const materia = String(formData.get("materia") ?? "").trim();
  const emailLogin = String(formData.get("emailLogin") ?? "").trim().toLowerCase();
  const senhaPlano = String(formData.get("senhaPlano") ?? "").trim();
  const turmaIds = formData.getAll("turmaId").map(String).filter(Boolean);

  if (!nome || !materia) {
    return { ok: false, error: "Nome e matéria são obrigatórios." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const seqRow = await tx.sequenciaCodigo.findUnique({
        where: { entidade: "PROFESSOR" },
      });
      if (!seqRow) throw new Error("Sequência de professores não configurada.");
      const codigoPublico = `Prof${String(seqRow.proximo).padStart(3, "0")}`;
      await tx.sequenciaCodigo.update({
        where: { entidade: "PROFESSOR" },
        data: { proximo: seqRow.proximo + 1 },
      });

      let usuarioId: string | undefined;
      if (emailLogin) {
        const exist = await tx.usuario.findUnique({ where: { email: emailLogin } });
        if (exist) {
          throw new Error("EMAIL_DUPLICADO");
        }
        const hash = await bcrypt.hash(senhaPlano || "redas2026", 10);
        const u = await tx.usuario.create({
          data: {
            email: emailLogin,
            nome,
            senhaHash: hash,
            perfil: PerfilUsuario.PROFESSOR,
            ativo: true,
          },
        });
        usuarioId = u.id;
      }

      await tx.professor.create({
        data: {
          codigoPublico,
          nome,
          materia,
          usuarioId: usuarioId ?? null,
          turmas:
            turmaIds.length > 0
              ? { create: turmaIds.map((turmaId) => ({ turmaId })) }
              : undefined,
        },
      });
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "EMAIL_DUPLICADO") {
      return { ok: false, error: "E-mail já cadastrado para outro usuário." };
    }
    return { ok: false, error: msg || "Não foi possível criar o professor." };
  }

  revalidatePath("/dashboard/professores");
  revalidatePainelProfessor();
  return { ok: true };
}

export async function atualizarProfessor(
  _prev: ProfessorActionState,
  formData: FormData,
): Promise<ProfessorActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const materia = String(formData.get("materia") ?? "").trim();
  const turmaIds = formData.getAll("turmaId").map(String).filter(Boolean);

  if (!id || !nome || !materia) {
    return { ok: false, error: "Dados incompletos." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.professor.update({
        where: { id },
        data: { nome, materia },
      });
      await tx.professorTurma.deleteMany({ where: { professorId: id } });
      if (turmaIds.length > 0) {
        await tx.professorTurma.createMany({
          data: turmaIds.map((turmaId) => ({ professorId: id, turmaId })),
        });
      }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao atualizar.";
    return { ok: false, error: msg };
  }

  revalidatePath("/dashboard/professores");
  revalidatePainelProfessor();
  return { ok: true };
}

export async function excluirProfessor(
  _prev: ProfessorActionState,
  formData: FormData,
): Promise<ProfessorActionState> {
  const denied = await assertAdminMutation();
  if (denied) return { ok: false, error: denied };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "ID inválido." };

  try {
    const p = await prisma.professor.findUnique({
      where: { id },
      select: { usuarioId: true },
    });
    await prisma.$transaction(async (tx) => {
      await tx.professor.delete({ where: { id } });
      if (p?.usuarioId) {
        await tx.usuario.delete({ where: { id: p.usuarioId } }).catch(() => {});
      }
    });
  } catch {
    return { ok: false, error: "Não foi possível excluir." };
  }

  revalidatePath("/dashboard/professores");
  revalidatePainelProfessor();
  return { ok: true };
}
