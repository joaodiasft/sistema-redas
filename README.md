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
| `/dashboard/alunos` … `/dashboard/configuracoes` | Módulos (placeholders) |
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

## Estrutura

- `src/` — App Router, componentes, middleware  
- `prisma/` — schema  
- `docs/ESTRUTURA-ERP.txt` — mapa detalhado  

## Privacidade

Não commite `.env`, senhas nem URLs de banco com credenciais.

## Repositório

[github.com/joaodiasft/sistema-redas](https://github.com/joaodiasft/sistema-redas)

## Capturas no README (opcional)

Salve PNG em `docs/img/` e referencie, por exemplo: `![Build](docs/img/vercel-next.png)`.
