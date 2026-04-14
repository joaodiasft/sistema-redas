# sistema-redas

Monorepositório com **Next.js** na **raiz do Git**: landing em `/`, ERP em `/login` e `/dashboard/*`. A Vercel passa a detectar **Next.js automaticamente** (sem precisar de “Root Directory” em subpasta).

| Parte | Código | URL em produção |
|--------|--------|------------------|
| Landing | `public/index.html` (+ `index.html` na raiz para abrir local sem Node) | `/` |
| Login | `src/app/(auth)/login` | `/login` |
| Painel | `src/app/(dashboard)/dashboard/...` | `/dashboard`, … |

## Mapa de rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing (`public/index.html`, middleware) |
| `/login` | Login (JWT + cookie; apenas **ADMIN** acessa `/dashboard`) |
| `/dashboard` | Painel |
| `/dashboard/*` | ERP admin (cadastro, operacional, relatórios — ver secção abaixo) |
| `/painel/professor`, `/painel/aluno` | Painéis só leitura (professor / aluno) |
| `/api/*` | APIs (login, admin, painel professor) |
| outras | 404 com links úteis |

Menu lateral: **Site público** → `/`, **Sair** → `/login`.

## Desenvolvimento local

O projeto usa **PostgreSQL** (ex.: [Neon](https://neon.tech)). Copie `.env.example` para `.env` e defina `DATABASE_URL` com a connection string (URI com `?sslmode=require`).

```bash
cp .env.example .env
# Edite .env: DATABASE_URL=postgresql://...
npm install
npm run setup
npm run dev
```

`npm run setup` aplica migrações (`prisma migrate deploy`) e corre o seed. Em desenvolvimento sem histórico de migrações podes usar `npx prisma db push` + `npm run db:seed` em alternativa.

**Admin principal (após seed):** `admin.redas@redas.com` / `redasmil2026`. Contas `@rmil.com` para testes (`redas2026`, exceto onde indicado). O painel `/dashboard` é só **ADMIN**; **professores** vão para `/painel/professor` e **alunos** para `/painel/aluno`.

| Conta | Senha | Destino após login |
|--------|--------|---------------------|
| `admin.redas@redas.com` | `redasmil2026` | `/dashboard` |
| `professor.teste@rmil.com` | `redas2026` | `/painel/professor` (ProfTest + turma R1) |
| `aluno.teste@rmil.com` | `redas2026` | `/painel/aluno` |
| `martha@rmil.com` | `redas2026` | `/painel/professor` (Prof001, várias turmas) |

### Atualização em “tempo real” (admin → base → ecrãs)

As alterações feitas no ERP gravam na base **PostgreSQL** via **Server Actions** (`src/app/(dashboard)/dashboard/**/actions.ts`) ou **APIs** (`src/app/api/admin/*`). Depois de guardar, o Next.js invalida o cache com `revalidatePath` para:

- **Painel principal** `/dashboard` (`revalidateAdminDashboard`) — métricas e cartões atualizam no próximo carregamento.
- Rotas específicas (ex.: `/dashboard/turmas`, `/dashboard/alunos`).
- **Painéis** professor/aluno (`revalidatePainelProfessor` / `revalidatePainelAluno`) quando o dado os afeta (turmas, presenças, avisos, aulas agendadas, etc.).

Ou seja: não há WebSocket; a consistência é **pedido HTTP seguinte** ou **navegação** — padrão normal em App Router.

Se o banco já tiver tabelas antigas incompatíveis com o schema atual, no **SQL Editor** do Neon pode executar `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` (apaga dados) e depois rodar `npx prisma db push` de novo.

- http://localhost:3000/ — landing  
- http://localhost:3000/login — ERP  

**Sincronizar landing:** o arquivo “oficial” para o Next é `public/index.html`. A raiz tem também `index.html` para abrir direto no navegador; ao mudar textos, atualize **os dois** (ou copie: `Copy-Item index.html public\index.html` no PowerShell).

## Deploy na Vercel

1. Projeto conectado ao repositório **joaodiasft/sistema-redas** (branch `main`).
2. **Root Directory** deve ficar **vazio** (padrão, raiz do repo). Se antes estava `erp`, **apague** e salve — a pasta `erp` não existe mais e o build quebraria.
3. Build: `npm run build` (padrão). Framework: **Next.js**.
4. Variáveis na Vercel: **`DATABASE_URL`** (PostgreSQL Neon) e, recomendado, **`AUTH_SECRET`** (string longa; se não existir, o app usa um fallback interno — defina em produção por segurança). Opcional: `NEXT_PUBLIC_WHATSAPP_PHONE`.
5. Após o primeiro deploy, rode **`npx prisma db push`** e **`npm run db:seed`** contra o mesmo Neon (localmente com `DATABASE_URL` de produção ou pela CI), senão não existem utilizadores na base e o login falha.

Painel: [sistema-redas na Vercel](https://vercel.com/naredacaonota1000-2663s-projects/sistema-redas).

## Painel administrativo — guia visual (Playwright)

Cada item do menu lateral foi percorrido com login de **admin**; as imagens em `docs/img/admin/` são geradas automaticamente (1440×900, página completa).

**Gerar ou atualizar capturas** (servidor em `http://127.0.0.1:3000`; reutiliza `npm run dev` se já estiver a correr):

```bash
npx playwright install chromium   # primeira vez
set E2E_ADMIN_EMAIL=admin.redas@redas.com
set E2E_ADMIN_PASSWORD=redasmil2026
npm run screenshots:admin
```

| # | Rota | Função | Dados (Prisma) | Após guardar |
|---|------|--------|----------------|--------------|
| 1 | `/dashboard` | Resumo, gráficos, calendário do mês, avisos | agregados + `AulaAgendada`, `AvisoSistema` | — |
| 2 | `/dashboard/relatorios` | Relatórios exportáveis | consultas agregadas | — |
| 3 | `/dashboard/calendario-geral` | Visão mensal de todas as turmas | `Turma`, `AulaAgendada` | — |
| 4 | `/dashboard/alunos` | Lista de alunos | `Aluno`, `Matricula` | Seed + CRUD novo aluno |
| 5 | `/dashboard/alunos/novo` | Criar aluno + matrículas | `Usuario`, `Aluno`, `Matricula` | `revalidateAdminDashboard` + painéis |
| 6 | `/dashboard/cursos-turmas` | Visão cruzada curso/turma | `Curso`, `Turma` | — |
| 7 | `/dashboard/turmas` | CRUD turmas | `Turma` | Admin + painéis |
| 8 | `/dashboard/professores` | CRUD professores e vínculos | `Professor`, `ProfessorTurma` | Admin + painel professor |
| 9 | `/dashboard/modulos` | Módulos do semestre | `ModuloCurso`, `Semestre` | Admin + painel |
| 10 | `/dashboard/operacional/presenca` | Lançar presenças | `PresencaEncontro` | Admin + painel professor/aluno |
| 11 | `/dashboard/operacional/reposicao` | Reposições | `ReposicaoRegistro` | Admin dashboard |
| 12 | `/dashboard/operacional/calendario` | Aulas extras (API admin) | `AulaAgendada` | Admin + painel professor |
| 13 | `/dashboard/operacional/financeiro` | UI de confirmação (preview) | — | Evoluir para CRUD parcelas |
| 14 | `/dashboard/operacional/redacao` | Entregas de redação | `EntregaRedacao` | — |
| 15–17 | `/dashboard/configuracoes/*` | Configurações e limites | `ConfiguracaoSistema`, etc. | Conforme formulário |
| 18 | `/dashboard/usuarios` | Documentação de perfis | — | Informativo |
| 19 | `/dashboard/semestre-modulos` | Documentação semestre/módulos | — | Informativo |

**Nota:** `/dashboard/frequencia` redireciona para **Presença** operacional. `/dashboard/materiais` redireciona para **Módulos**.

### Capturas (clique para ampliar no GitHub)

![Dashboard](docs/img/admin/01-dashboard.png)

![Relatórios](docs/img/admin/02-relatorios.png)

![Calendário geral](docs/img/admin/03-calendario-geral.png)

![Alunos](docs/img/admin/04-alunos.png)

![Novo aluno](docs/img/admin/05-aluno-novo.png)

![Cursos e turmas](docs/img/admin/06-cursos-turmas.png)

![Turmas](docs/img/admin/07-turmas.png)

![Professores](docs/img/admin/08-professores.png)

![Módulos](docs/img/admin/09-modulos.png)

![Presença](docs/img/admin/10-presenca.png)

![Reposição](docs/img/admin/11-reposicao.png)

![Calendário operacional](docs/img/admin/12-calendario-operacional.png)

![Financeiro operacional](docs/img/admin/13-financeiro-operacional.png)

![Entrega de redação](docs/img/admin/14-redacao.png)

![Configurações](docs/img/admin/15-configuracoes.png)

![Acesso aluno](docs/img/admin/16-acesso-aluno.png)

![Sistema](docs/img/admin/17-sistema.png)

![Usuários](docs/img/admin/18-usuarios.png)

![Semestre e módulos](docs/img/admin/19-semestre-modulos.png)

## Estrutura

- `src/` — App Router, componentes, middleware  
- `prisma/` — schema  
- `docs/ESTRUTURA-ERP.txt` — mapa detalhado  

## Privacidade

Não commite `.env`, senhas nem URLs de banco com credenciais.

## Repositório

[github.com/joaodiasft/sistema-redas](https://github.com/joaodiasft/sistema-redas)

## Testes E2E

- `npm run test:e2e` — todos os testes Playwright em `e2e/`.
- `npm run screenshots:admin` — apenas capturas do README (pasta `docs/img/admin/`).
