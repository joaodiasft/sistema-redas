"use server";

import { ClasseTurma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type TurmaActionState = { ok: boolean; error?: string };

export async function criarTurma(
  _prev: TurmaActionState,
  formData: FormData,
): Promise<TurmaActionState> {
  const cursoId = String(formData.get("cursoId") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const horaInicio = String(formData.get("horaInicio") ?? "").trim() || null;
  const horaFim = String(formData.get("horaFim") ?? "").trim() || null;
  const diaSemanaRaw = formData.get("diaSemana");
  const capacidade = Number(formData.get("capacidade") ?? 30);
  const classe = String(formData.get("classe") ?? "ENSINO_MEDIO") as ClasseTurma;

  if (!cursoId || !codigo || !nome) {
    return { ok: false, error: "Curso, código e nome são obrigatórios." };
  }

  const diaSemana =
    diaSemanaRaw === "" || diaSemanaRaw === null ? null : Number(diaSemanaRaw);

  try {
    await prisma.turma.create({
      data: {
        cursoId,
        codigo,
        nome,
        horaInicio,
        horaFim,
        diaSemana: Number.isFinite(diaSemana) ? diaSemana : null,
        capacidade: Number.isFinite(capacidade) ? capacidade : 30,
        classe,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar.";
    return { ok: false, error: msg.includes("Unique") ? "Já existe turma com este código no curso." : msg };
  }

  revalidatePath("/dashboard/turmas");
  revalidatePath("/dashboard/cursos-turmas");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function atualizarTurma(
  _prev: TurmaActionState,
  formData: FormData,
): Promise<TurmaActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const cursoId = String(formData.get("cursoId") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const horaInicio = String(formData.get("horaInicio") ?? "").trim() || null;
  const horaFim = String(formData.get("horaFim") ?? "").trim() || null;
  const diaSemanaRaw = formData.get("diaSemana");
  const capacidade = Number(formData.get("capacidade") ?? 30);
  const classe = String(formData.get("classe") ?? "ENSINO_MEDIO") as ClasseTurma;
  const ativa = formData.get("ativa") === "on" || formData.get("ativa") === "true";

  if (!id || !cursoId || !codigo || !nome) {
    return { ok: false, error: "Dados incompletos." };
  }

  const diaSemana =
    diaSemanaRaw === "" || diaSemanaRaw === null ? null : Number(diaSemanaRaw);

  try {
    await prisma.turma.update({
      where: { id },
      data: {
        cursoId,
        codigo,
        nome,
        horaInicio,
        horaFim,
        diaSemana: Number.isFinite(diaSemana) ? diaSemana : null,
        capacidade: Number.isFinite(capacidade) ? capacidade : 30,
        classe,
        ativa,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar.";
    return { ok: false, error: msg.includes("Unique") ? "Código já existe neste curso." : msg };
  }

  revalidatePath("/dashboard/turmas");
  revalidatePath("/dashboard/cursos-turmas");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function excluirTurmaAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await prisma.turma.delete({ where: { id } });
  } catch {
    return;
  }
  revalidatePath("/dashboard/turmas");
  revalidatePath("/dashboard/cursos-turmas");
  revalidatePath("/dashboard");
}
