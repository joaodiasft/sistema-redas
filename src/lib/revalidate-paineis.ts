import { revalidatePath } from "next/cache";

/**
 * Invalida o cache do App Router para todo o painel do professor (layout + páginas filhas).
 * Chame após mutações que alterem turmas, vínculos, presenças, aulas agendadas ou avisos visíveis ao professor.
 */
export function revalidatePainelProfessor() {
  revalidatePath("/painel/professor", "layout");
}

/**
 * Invalida o painel do aluno (matrículas, avisos, etc.).
 */
export function revalidatePainelAluno() {
  revalidatePath("/painel/aluno", "layout");
}
