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
const SENHA_PROFESSORES_SEED = "redas2026";
const JOAO_SENHA = "123456";

async function main() {
  for (const ent of ["ALUNO", "PROFESSOR", "MODULO"] as const) {
    await prisma.sequenciaCodigo.upsert({
      where: { entidade: ent },
      create: { entidade: ent, proximo: 1 },
      update: {},
    });
  }

  const hashPadrao123456 = await bcrypt.hash("123456", 10);
  await prisma.configuracaoSistema.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      senhaPadraoAlunoHash: hashPadrao123456,
      primeiroAcessoSenhaPlano: "123456",
    },
    update: {
      senhaPadraoAlunoHash: hashPadrao123456,
      primeiroAcessoSenhaPlano: "123456",
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
  await prisma.usuario.upsert({
    where: { email: "admin.teste@rmil.com" },
    create: {
      email: "admin.teste@rmil.com",
      nome: "Admin Teste",
      senhaHash: hashTeste,
      perfil: PerfilUsuario.ADMIN,
      ativo: true,
    },
    update: { senhaHash: hashTeste, perfil: PerfilUsuario.ADMIN, ativo: true },
  });

  await prisma.usuario.upsert({
    where: { email: "professor.teste@rmil.com" },
    create: {
      email: "professor.teste@rmil.com",
      nome: "Professor Teste",
      senhaHash: hashTeste,
      perfil: PerfilUsuario.PROFESSOR,
      ativo: true,
    },
    update: { senhaHash: hashTeste, perfil: PerfilUsuario.PROFESSOR, ativo: true },
  });

  const cursoRedacao = await prisma.curso.upsert({
    where: { codigo: "01" },
    create: { codigo: "01", nome: "Redação", ativo: true },
    update: { nome: "Redação", ativo: true },
  });

  const cursoExatas = await prisma.curso.upsert({
    where: { codigo: "02" },
    create: { codigo: "02", nome: "Exatas", ativo: true },
    update: { nome: "Exatas", ativo: true },
  });

  type TurmaDef = {
    codigo: string;
    nome: string;
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
    classe: ClasseTurma;
  };

  const turmasRedacaoEM: TurmaDef[] = [
    {
      codigo: "R1",
      nome: "Turma R1 — Ensino Médio",
      diaSemana: 2,
      horaInicio: "18:00",
      horaFim: "19:30",
      classe: ClasseTurma.ENSINO_MEDIO,
    },
    {
      codigo: "R2",
      nome: "Turma R2 — Ensino Médio",
      diaSemana: 2,
      horaInicio: "19:30",
      horaFim: "21:00",
      classe: ClasseTurma.ENSINO_MEDIO,
    },
    {
      codigo: "R3",
      nome: "Turma R3 — Ensino Médio",
      diaSemana: 6,
      horaInicio: "07:30",
      horaFim: "09:00",
      classe: ClasseTurma.ENSINO_MEDIO,
    },
    {
      codigo: "R4",
      nome: "Turma R4 — Ensino Médio",
      diaSemana: 6,
      horaInicio: "09:00",
      horaFim: "10:30",
      classe: ClasseTurma.ENSINO_MEDIO,
    },
  ];

  const turmasRedacaoEF: TurmaDef[] = [
    {
      codigo: "R5",
      nome: "Turma R5 — Ensino Fundamental",
      diaSemana: 6,
      horaInicio: "10:30",
      horaFim: "12:00",
      classe: ClasseTurma.ENSINO_FUNDAMENTAL,
    },
    {
      codigo: "R6",
      nome: "Turma R6 — Ensino Fundamental",
      diaSemana: 6,
      horaInicio: "15:00",
      horaFim: "16:30",
      classe: ClasseTurma.ENSINO_FUNDAMENTAL,
    },
  ];

  const turmasExatas: TurmaDef[] = [
    {
      codigo: "EX1",
      nome: "Turma EX1 — Ensino Médio",
      diaSemana: 1,
      horaInicio: "19:00",
      horaFim: "22:00",
      classe: ClasseTurma.ENSINO_MEDIO,
    },
  ];

  const todasRedacao = [...turmasRedacaoEM, ...turmasRedacaoEF];
  const turmasCriadas = new Map<string, { id: string; cursoId: string }>();

  for (const t of todasRedacao) {
    const cursoId = cursoRedacao.id;
    const row = await prisma.turma.upsert({
      where: { cursoId_codigo: { cursoId, codigo: t.codigo } },
      create: {
        codigo: t.codigo,
        nome: t.nome,
        cursoId,
        horaInicio: t.horaInicio,
        horaFim: t.horaFim,
        diaSemana: t.diaSemana,
        classe: t.classe,
        capacidade: 30,
        ativa: true,
      },
      update: {
        nome: t.nome,
        horaInicio: t.horaInicio,
        horaFim: t.horaFim,
        diaSemana: t.diaSemana,
        classe: t.classe,
        capacidade: 30,
        ativa: true,
      },
    });
    turmasCriadas.set(`${cursoId}:${t.codigo}`, {
      id: row.id,
      cursoId: row.cursoId,
    });
  }

  for (const t of turmasExatas) {
    const cursoId = cursoExatas.id;
    const row = await prisma.turma.upsert({
      where: { cursoId_codigo: { cursoId, codigo: t.codigo } },
      create: {
        codigo: t.codigo,
        nome: t.nome,
        cursoId,
        horaInicio: t.horaInicio,
        horaFim: t.horaFim,
        diaSemana: t.diaSemana,
        classe: t.classe,
        capacidade: 30,
        ativa: true,
      },
      update: {
        nome: t.nome,
        horaInicio: t.horaInicio,
        horaFim: t.horaFim,
        diaSemana: t.diaSemana,
        classe: t.classe,
        capacidade: 30,
        ativa: true,
      },
    });
    turmasCriadas.set(`${cursoId}:${t.codigo}`, {
      id: row.id,
      cursoId: row.cursoId,
    });
  }

  const turmaR1 = turmasCriadas.get(`${cursoRedacao.id}:R1`)!;
  const turmaEX1 = turmasCriadas.get(`${cursoExatas.id}:EX1`)!;

  const semestre = await prisma.semestre.upsert({
    where: { id: "seed-semestre-2026" },
    create: {
      id: "seed-semestre-2026",
      nome: "2026 — Ciclo base",
      ativo: true,
    },
    update: { nome: "2026 — Ciclo base", ativo: true },
  });

  const modulosDef: {
    cod: string;
    titulo: string;
    mes: number;
    num: number;
  }[] = [
    { cod: "MD01", titulo: "Módulo Fevereiro", mes: 2, num: 1 },
    { cod: "MD02", titulo: "Módulo Março", mes: 3, num: 2 },
    { cod: "MD03", titulo: "Módulo Abril", mes: 4, num: 3 },
  ];

  for (const m of modulosDef) {
    const existing = await prisma.moduloCurso.findFirst({
      where: { codigoPublico: m.cod },
    });
    if (existing) {
      await prisma.moduloCurso.update({
        where: { id: existing.id },
        data: {
          titulo: m.titulo,
          numero: m.num,
          mesReferencia: m.mes,
          anoReferencia: 2026,
          semestreId: semestre.id,
        },
      });
    } else {
      await prisma.moduloCurso.create({
        data: {
          codigoPublico: m.cod,
          semestreId: semestre.id,
          numero: m.num,
          titulo: m.titulo,
          mesReferencia: m.mes,
          anoReferencia: 2026,
        },
      });
    }
  }

  await prisma.sequenciaCodigo.update({
    where: { entidade: "MODULO" },
    data: { proximo: 4 },
  });

  const hashProf = await bcrypt.hash(SENHA_PROFESSORES_SEED, 10);

  const uMartha = await prisma.usuario.upsert({
    where: { email: "martha@rmil.com" },
    create: {
      email: "martha@rmil.com",
      nome: "Professora Martha",
      senhaHash: hashProf,
      perfil: PerfilUsuario.PROFESSOR,
      ativo: true,
    },
    update: {
      nome: "Professora Martha",
      senhaHash: hashProf,
      perfil: PerfilUsuario.PROFESSOR,
      ativo: true,
    },
  });

  const profMartha = await prisma.professor.upsert({
    where: { codigoPublico: "Prof001" },
    create: {
      codigoPublico: "Prof001",
      nome: "Professora Martha",
      materia: "Redação",
      usuarioId: uMartha.id,
    },
    update: {
      nome: "Professora Martha",
      materia: "Redação",
      usuarioId: uMartha.id,
    },
  });

  await prisma.professorTurma.deleteMany({ where: { professorId: profMartha.id } });
  for (const t of todasRedacao) {
    const key = `${cursoRedacao.id}:${t.codigo}`;
    const turma = turmasCriadas.get(key)!;
    await prisma.professorTurma.create({
      data: { professorId: profMartha.id, turmaId: turma.id },
    });
  }

  const outrosProf: {
    cod: string;
    nome: string;
    materia: string;
    email: string;
  }[] = [
    {
      cod: "Prof002",
      nome: "Professor Adriano",
      materia: "Física",
      email: "adriano@rmil.com",
    },
    {
      cod: "Prof003",
      nome: "Professor Bruno",
      materia: "Matemática",
      email: "bruno@rmil.com",
    },
    {
      cod: "Prof004",
      nome: "Professor Marcus",
      materia: "Química",
      email: "marcus@rmil.com",
    },
  ];

  for (const p of outrosProf) {
    const u = await prisma.usuario.upsert({
      where: { email: p.email },
      create: {
        email: p.email,
        nome: p.nome,
        senhaHash: hashProf,
        perfil: PerfilUsuario.PROFESSOR,
        ativo: true,
      },
      update: {
        nome: p.nome,
        senhaHash: hashProf,
        perfil: PerfilUsuario.PROFESSOR,
        ativo: true,
      },
    });
    const prof = await prisma.professor.upsert({
      where: { codigoPublico: p.cod },
      create: {
        codigoPublico: p.cod,
        nome: p.nome,
        materia: p.materia,
        usuarioId: u.id,
      },
      update: {
        nome: p.nome,
        materia: p.materia,
        usuarioId: u.id,
      },
    });
    await prisma.professorTurma.deleteMany({ where: { professorId: prof.id } });
    await prisma.professorTurma.create({
      data: { professorId: prof.id, turmaId: turmaEX1.id },
    });
  }

  const hashJoao = await bcrypt.hash(JOAO_SENHA, 10);
  const uJoao = await prisma.usuario.upsert({
    where: { email: "joao.claudio@rmil.com" },
    create: {
      email: "joao.claudio@rmil.com",
      nome: "João Claudio",
      senhaHash: hashJoao,
      perfil: PerfilUsuario.ALUNO,
      ativo: true,
    },
    update: {
      nome: "João Claudio",
      senhaHash: hashJoao,
      perfil: PerfilUsuario.ALUNO,
      ativo: true,
    },
  });

  const alunoJoao = await prisma.aluno.upsert({
    where: { codigoPublico: "R0002" },
    create: {
      codigoPublico: "R0002",
      usuarioId: uJoao.id,
      nomeCompleto: "João Claudio",
      emailContato: "joao.claudio@rmil.com",
      telefone: "(62) 99555-1544",
      responsavel: "Claudiney e Martha",
      situacao: SituacaoAluno.ATIVO,
      tipoPlano: TipoPlano.MENSAL,
      diaPagamento: 10,
      mesesCobranca: [],
      acessoCoredacaoEmail: "naredacaonotamil@gmail.com",
      acessoCoredacaoSenhaRef: "EUSOU1000",
    },
    update: {
      nomeCompleto: "João Claudio",
      telefone: "(62) 99555-1544",
      responsavel: "Claudiney e Martha",
      situacao: SituacaoAluno.ATIVO,
      tipoPlano: TipoPlano.MENSAL,
      diaPagamento: 10,
      acessoCoredacaoEmail: "naredacaonotamil@gmail.com",
      acessoCoredacaoSenhaRef: "EUSOU1000",
    },
  });

  await prisma.matricula.upsert({
    where: {
      alunoId_ordem: { alunoId: alunoJoao.id, ordem: 1 },
    },
    create: {
      alunoId: alunoJoao.id,
      cursoId: cursoRedacao.id,
      turmaId: turmaR1.id,
      ordem: 1,
    },
    update: { cursoId: cursoRedacao.id, turmaId: turmaR1.id },
  });

  await prisma.matricula.upsert({
    where: {
      alunoId_ordem: { alunoId: alunoJoao.id, ordem: 2 },
    },
    create: {
      alunoId: alunoJoao.id,
      cursoId: cursoExatas.id,
      turmaId: turmaEX1.id,
      ordem: 2,
    },
    update: { cursoId: cursoExatas.id, turmaId: turmaEX1.id },
  });

  const alunoTesteUser = await prisma.usuario.findUnique({
    where: { email: "aluno.teste@rmil.com" },
  });
  if (alunoTesteUser) {
    await prisma.aluno.upsert({
      where: { codigoPublico: "R0001" },
      create: {
        codigoPublico: "R0001",
        usuarioId: alunoTesteUser.id,
        nomeCompleto: "Aluno Teste",
        emailContato: "aluno.teste@rmil.com",
        telefone: "(62) 99999-0000",
        responsavel: "Responsável Teste",
        situacao: SituacaoAluno.ATIVO,
        tipoPlano: TipoPlano.MENSAL,
        diaPagamento: 10,
      },
      update: {},
    });
    const tTeste = turmasCriadas.get(`${cursoRedacao.id}:R1`)!;
    const alTeste = await prisma.aluno.findUniqueOrThrow({
      where: { codigoPublico: "R0001" },
    });
    await prisma.matricula.upsert({
      where: { alunoId_ordem: { alunoId: alTeste.id, ordem: 1 } },
      create: {
        alunoId: alTeste.id,
        cursoId: cursoRedacao.id,
        turmaId: tTeste.id,
        ordem: 1,
      },
      update: { turmaId: tTeste.id },
    });
  }

  /** Conta `professor.teste@rmil.com` precisa de registo `Professor` + turma para o painel funcionar. */
  const uProfTeste = await prisma.usuario.findUnique({
    where: { email: "professor.teste@rmil.com" },
  });
  if (uProfTeste) {
    const profTeste = await prisma.professor.upsert({
      where: { codigoPublico: "ProfTest" },
      create: {
        codigoPublico: "ProfTest",
        nome: "Professor Teste",
        materia: "Redação",
        usuarioId: uProfTeste.id,
      },
      update: {
        nome: "Professor Teste",
        materia: "Redação",
        usuarioId: uProfTeste.id,
      },
    });
    await prisma.professorTurma.deleteMany({ where: { professorId: profTeste.id } });
    await prisma.professorTurma.create({
      data: { professorId: profTeste.id, turmaId: turmaR1.id },
    });
  }

  await prisma.sequenciaCodigo.update({
    where: { entidade: "ALUNO" },
    data: { proximo: 3 },
  });

  await prisma.avisoSistema.deleteMany({});
  await prisma.avisoSistema.createMany({
    data: [
      {
        titulo: "Dados iniciais carregados",
        mensagem:
          "Cursos 01 (Redação) e 02 (Exatas), turmas R1–R6 e EX1, professores Prof001–004 e aluno João Claudio (R0002) estão no banco após o seed.",
        prioridade: 10,
        prioridadeNivel: "ALTA",
        paraTodasTurmas: true,
        enviarAlunos: true,
        enviarProfessores: true,
        ativo: true,
      },
    ],
  });

  console.log("Seed concluído.");
  console.log("  Admin: admin.redas@redas.com / " + SENHA_ADMIN_PRINCIPAL);
  console.log("  João Claudio: joao.claudio@rmil.com / " + JOAO_SENHA);
  console.log("  Professores (Martha, Adriano, Bruno, Marcus): *@rmil.com / " + SENHA_PROFESSORES_SEED);
  console.log("  Teste: admin.teste@rmil.com, aluno.teste@rmil.com, professor.teste@rmil.com / " + SENHA_TESTE);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
