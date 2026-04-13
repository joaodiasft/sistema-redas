# sistema-redas

Repositório com **landing** (guia da ficha) e **ERP** (Next.js em `erp/`): mesma origem no deploy correto.

| Parte | Onde está | Em produção (quando Root = `erp`) |
|--------|-----------|-------------------------------------|
| Landing | `index.html` (raiz) e cópia em `erp/public/index.html` | URL `/` |
| Login ERP | `erp/src/app/(auth)/login` | `/login` |
| Painel e módulos | `erp/src/app/(dashboard)/dashboard/...` | `/dashboard`, `/dashboard/alunos`, … |

## Mapa de rotas (ERP)

Todas as URLs abaixo são relativas ao domínio (ex.: `https://www.seudominio.shop`).

| Rota | Descrição |
|------|-----------|
| `/` | Landing estática (`public/index.html`), via middleware |
| `/login` | Tela de entrada (demo: link “Entrar” vai ao painel) |
| `/dashboard` | Painel resumo |
| `/dashboard/alunos` | Módulo alunos (placeholder) |
| `/dashboard/turmas` | Turmas |
| `/dashboard/semestre-modulos` | Semestre e módulos |
| `/dashboard/frequencia` | Frequência |
| `/dashboard/materiais` | Materiais |
| `/dashboard/financeiro` | Financeiro |
| `/dashboard/relatorios` | Relatórios |
| `/dashboard/usuarios` | Usuários e perfis |
| `/dashboard/configuracoes` | Configurações |
| *(qualquer outra)* | Página 404 com links para `/` e `/login` |

**Navegação interna:** menu lateral (`erp-sidebar`) aponta para as rotas acima; **Site público** → `/`; **Sair** → `/login`.

**Landing:** âncoras `#introducao`, `#conteudo`, etc.; botão **Acessar sistema** → `/login` (mesmo host).

## Vercel — obrigatório para `/` e `/login` funcionarem

Os logs de build em **38 ms** e ausência de `next build` indicam deploy **somente estático na raiz do repo**. Ajuste:

1. Abra o projeto **sistema-redas** no painel: [Visão geral do projeto](https://vercel.com/naredacaonota1000-2663s-projects/sistema-redas).
2. **Settings → General → Root Directory** → informe **`erp`** (sem barra) e salve.
3. **Settings → Build & Deployment:** Framework **Next.js** (ou deixe em detecção automática após o passo 2).
4. **Settings → Environment Variables:** crie **`DATABASE_URL`** com URL **PostgreSQL** (Neon, Supabase, etc.). Não use SQLite em produção na Vercel.
5. **Deployments →** nos três pontos do último deploy → **Redeploy** (marque “Use existing Build Cache” só se quiser forçar rebuild limpo desmarcando).

Domínios customizados ficam em **Settings → Domains** (ex.: `www.redacaonotamil.shop` e `redacaonotamil.shop`).

> **Privacidade:** não commite `.env`, senhas nem URLs de banco com credenciais. O arquivo `erp/.env.example` só traz um exemplo sem segredos.

## Repositório GitHub

- Código: [github.com/joaodiasft/sistema-redas](https://github.com/joaodiasft/sistema-redas)

## Desenvolvimento local (ERP)

```bash
cd erp
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

- **http://localhost:3000/** → landing  
- **http://localhost:3000/login** → login  

Alterou a landing? Atualize **`erp/public/index.html`** (ou copie de novo `index.html` da raiz) antes do deploy.

## Pasta `erp/` — detalhes

Next.js 15, Prisma, Tailwind. Modelos no `prisma/schema.prisma`. Mapa de pastas em `erp/ESTRUTURA.txt`.

## Capturas de tela na documentação (opcional)

Para ilustrar o README no GitHub:

1. Na Vercel: tela **Settings → General** com **Root Directory = `erp`** visível.
2. No navegador: `/` com a landing e `/login` com o formulário.
3. Salve como PNG, por exemplo em `docs/img/` no repositório, e no README use:  
   `![Root Directory erp](docs/img/vercel-root-erp.png)`  

(As imagens não são geradas automaticamente neste repositório; você pode adicioná-las quando quiser.)
