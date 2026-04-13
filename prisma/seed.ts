import {
  PrismaClient,
  PerfilUsuario,
  SituacaoAluno,
  TipoPlano,
  ClasseTurma,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SENHA_TESTE = "redas2026";
const SENHA_ADMIN_PRINCIPAL = "redasmil2026";
const HASH_PADRAO_ALUNO = async () => bcrypt.hash("123456", 10);

async function main() {
  await prisma.sequenciaCodigo.upsert({
    where: { entidade: "ALUNO" },
    create: { entidade: "ALUNO", proximo: 1 },
    update: {},
  });
  await prisma.sequenciaCodigo.upsert({
    where: { entidade: "PROFESSOR" },
    create: { entidade: "PROFESSOR", proximo: 1 },
    update: {},
  });
  await prisma.sequenciaCodigo.upsert({
    where: { entidade: "MODULO" },
    create: { entidade: "MODULO", proximo: 1 },
    update: {},
  });

  const hashPadrao = await HASH_PADRAO_ALUNO();
  await prisma.configuracaoSistema.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      senhaPadraoAlunoHash: hashPadrao,
      primeiroAcessoSenhaPlano: "123456",
    },
    update: {
      senhaPadraoAlunoHash: hashPadrao,
    },
  });

  const hashAdmin = await bcrypt.hash(SENHA_ADMIN_PRINCIPAL, 10);
  await prisma.usuario.upsert({
    where: { email: "admin.redas@redas.com" },
    create: {
      email: "admin.redas@redas.com",
      nome: "Administrador Redas",
      senhaHash: hashAdmin,
      perfil: PerfilUsuario.ADMIN,
      ativo: true,
    },
    update: {
      nome: "Administrador Redas",
      senhaHash: hashAdmin,
      perfil: PerfilUsuario.ADMIN,
      ativo: true,
    },
  });

  const hashTeste = await bcrypt.hash(SENHA_TESTE, 10);
  const contasTeste: {
    email: string;
    nome: string;
    perfil: PerfilUsuario;
  }[] = [
    { email: "admin.teste@rmil.com", nome: "Admin Teste", perfil: PerfilUsuario.ADMIN },
    {
      email: "professor.teste@rmil.com",
      nome: "Professor Teste",
      perfil: PerfilUsuario.PROFESSOR,
    },
    { email: "aluno.teste@rmil.com", nome: "Aluno Teste", perfil: PerfilUsuario.ALUNO },
  ];

  for (const u of contasTeste) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        nome: u.nome,
        senhaHash: hashTeste,
        perfil: u.perfil,
        ativo: true,
      },
      update: {
        nome: u.nome,
        senhaHash: hashTeste,
        perfil: u.perfil,
        ativo: true,
      },
    });
  }

  const cursoRedacao = await prisma.curso.upsert({
    where: { codigo: "RED-001" },
    create: {
      codigo: "RED-001",
      nome: "Curso de Redação Nota Mil",
      ativo: true,
    },
    update: { nome: "Curso de Redação Nota Mil", ativo: true },
  });

  const turma = await prisma.turma.upsert({
    where: {
      cursoId_codigo: { cursoId: cursoRedacao.id, codigo: "TUR-A" },
    },
    create: {
      codigo: "TUR-A",
      nome: "Turma manhã — Redação",
      cursoId: cursoRedacao.id,
      horaInicio: "08:00",
      horaFim: "10:00",
      diaSemana: 6,
      classe: ClasseTurma.ENSINO_MEDIO,
      capacidade: 30,
      ativa: true,
    },
    update: {
      horaInicio: "08:00",
      horaFim: "10:00",
      diaSemana: 6,
      ativa: true,
    },
  });

  const profUser = await prisma.usuario.findUnique({
    where: { email: "professor.teste@rmil.com" },
  });
  if (profUser) {
    const prof = await prisma.professor.upsert({
      where: { codigoPublico: "Prof001" },
      create: {
        codigoPublico: "Prof001",
        nome: "Professor Teste",
        materia: "Redação",
        usuarioId: profUser.id,
      },
      update: { nome: "Professor Teste", materia: "Redação" },
    });
    await prisma.professorTurma.upsert({
      where: {
        professorId_turmaId: { professorId: prof.id, turmaId: turma.id },
      },
      create: { professorId: prof.id, turmaId: turma.id },
      update: {},
    });
  }

  const alunoUser = await prisma.usuario.findUnique({
    where: { email: "aluno.teste@rmil.com" },
  });
  if (alunoUser) {
    const al = await prisma.aluno.upsert({
      where: { codigoPublico: "R0001" },
      create: {
        codigoPublico: "R0001",
        usuarioId: alunoUser.id,
        nomeCompleto: "Aluno Teste",
        emailContato: "aluno.teste@rmil.com",
        telefone: "(62) 99999-0000",
        responsavel: "Responsável Teste",
        situacao: SituacaoAluno.ATIVO,
        tipoPlano: TipoPlano.MENSAL,
        diaPagamento: 10,
      },
      update: {
        nomeCompleto: "Aluno Teste",
        situacao: SituacaoAluno.ATIVO,
      },
    });
    await prisma.matricula.upsert({
      where: {
        alunoId_ordem: { alunoId: al.id, ordem: 1 },
      },
      create: {
        alunoId: al.id,
        cursoId: cursoRedacao.id,
        turmaId: turma.id,
        ordem: 1,
      },
      update: { turmaId: turma.id, cursoId: cursoRedacao.id },
    });
    await prisma.sequenciaCodigo.update({
      where: { entidade: "ALUNO" },
      data: { proximo: 2 },
    });
  }

  await prisma.avisoSistema.deleteMany({});
  await prisma.avisoSistema.createMany({
    data: [
      {
        titulo: "Bem-vindo ao painel administrativo",
        mensagem:
          "Use o menu à esquerda para cadastros, operação e relatórios. Configure alunos, turmas e módulos antes de lançar presença e financeiro.",
        prioridade: 1,
        ativo: true,
      },
      {
        titulo: "Acesso principal",
        mensagem:
          "Login admin: admin.redas@redas.com — contas de teste @rmil.com continuam ativas.",
        prioridade: 0,
        ativo: true,
      },
    ],
  });

  console.log("Seed OK.");
  console.log("  Admin principal: admin.redas@redas.com / " + SENHA_ADMIN_PRINCIPAL);
  console.log("  Contas teste @rmil.com / " + SENHA_TESTE);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
