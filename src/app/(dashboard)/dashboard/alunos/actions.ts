"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  PerfilUsuario,
  SituacaoAluno,
  TipoPlano,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CriarAlunoState = { ok: boolean; error?: string };

export async function criarAluno(
  _prev: CriarAlunoState,
  formData: FormData,
): Promise<CriarAlunoState> {
  const nomeCompleto = String(formData.get("nomeCompleto") ?? "").trim();
  const emailLogin = String(formData.get("emailLogin") ?? "")
    .trim()
    .toLowerCase();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const responsavel = String(formData.get("responsavel") ?? "").trim();
  const situacao = String(formData.get("situacao") ?? "ATIVO") as SituacaoAluno;
  const tipoPlano = String(formData.get("tipoPlano") ?? "MENSAL") as TipoPlano;
  const diaPagamento = formData.get("diaPagamento")
    ? Number(formData.get("diaPagamento"))
    : null;

  const turma1 = String(formData.get("turma1") ?? "").trim();
  const turma2 = String(formData.get("turma2") ?? "").trim();

  const sofiaEmail = String(formData.get("sofiaEmail") ?? "").trim();
  const sofiaSenha = String(formData.get("sofiaSenha") ?? "").trim();
  const coreEmail = String(formData.get("coreEmail") ?? "").trim();
  const coreSenha = String(formData.get("coreSenha") ?? "").trim();

  if (!nomeCompleto || !emailLogin || !telefone || !turma1) {
    return { ok: false, error: "Preencha nome, e-mail de login, telefone e a primeira turma." };
  }

  const t1 = await prisma.turma.findUnique({
    where: { id: turma1 },
    include: { curso: true },
  });
  if (!t1) return { ok: false, error: "Turma inválida." };

  let t2: Awaited<ReturnType<typeof prisma.turma.findUnique>> = null;
  if (turma2 && turma2 !== turma1) {
    t2 = await prisma.turma.findUnique({
      where: { id: turma2 },
      include: { curso: true },
    });
    if (!t2) return { ok: false, error: "Segunda turma inválida." };
  }

  const exist = await prisma.usuario.findUnique({ where: { email: emailLogin } });
  if (exist) {
    return { ok: false, error: "Já existe usuário com este e-mail." };
  }

  const config = await prisma.configuracaoSistema.findUnique({
    where: { id: "singleton" },
  });
  const hashSenha =
    config?.senhaPadraoAlunoHash && config.senhaPadraoAlunoHash.length > 0
      ? config.senhaPadraoAlunoHash
      : await bcrypt.hash("123456", 10);

  try {
    await prisma.$transaction(async (tx) => {
      const seqRow = await tx.sequenciaCodigo.findUniqueOrThrow({
        where: { entidade: "ALUNO" },
      });
      const num = seqRow.proximo;
      await tx.sequenciaCodigo.update({
        where: { entidade: "ALUNO" },
        data: { proximo: num + 1 },
      });
      const codigoPublico = `R${String(num).padStart(4, "0")}`;

      const usuario = await tx.usuario.create({
        data: {
          email: emailLogin,
          nome: nomeCompleto,
          senhaHash: hashSenha,
          perfil: PerfilUsuario.ALUNO,
          ativo: true,
        },
      });

      const aluno = await tx.aluno.create({
        data: {
          codigoPublico,
          usuarioId: usuario.id,
          nomeCompleto,
          emailContato: emailLogin,
          telefone,
          responsavel: responsavel || "—",
          situacao,
          tipoPlano,
          diaPagamento: Number.isFinite(diaPagamento ?? NaN) ? diaPagamento : null,
          mesesCobranca: [],
          acessoSofiaEmail: sofiaEmail || null,
          acessoSofiaSenhaRef: sofiaSenha || null,
          acessoCoredacaoEmail: coreEmail || null,
          acessoCoredacaoSenhaRef: coreSenha || null,
        },
      });

      await tx.matricula.create({
        data: {
          alunoId: aluno.id,
          cursoId: t1.cursoId,
          turmaId: t1.id,
          ordem: 1,
        },
      });

      if (t2) {
        await tx.matricula.create({
          data: {
            alunoId: aluno.id,
            cursoId: t2.cursoId,
            turmaId: t2.id,
            ordem: 2,
          },
        });
      }
    });
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error: "Não foi possível salvar. Verifique os dados ou tente novamente.",
    };
  }

  revalidatePath("/dashboard/alunos");
  redirect("/dashboard/alunos");
}
