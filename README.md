# sistema-redas

Site estático do projeto REDAS.

- **Repositório:** [github.com/joaodiasft/sistema-redas](https://github.com/joaodiasft/sistema-redas)
- **Hospedagem:** [Vercel — sistema-redas](https://vercel.com/naredacaonota1000-2663s-projects/sistema-redas)

## Desenvolvimento

- **Só a landing (HTML):** abra `index.html` na raiz no navegador.
- **Landing + ERP (igual produção):** rode o app em `erp/` — a home `/` é a mesma landing (`erp/public/index.html`) e `/login` é o ERP. Ao alterar textos da landing para deploy, atualize **`erp/public/index.html`** (ou copie de `index.html` na raiz).

## Deploy na Vercel (evitar 404 NOT_FOUND)

O erro **404: NOT_FOUND** no domínio costuma ser porque o projeto está fazendo build da **raiz do repositório** (só HTML) e **não existe rota `/login`**.

1. No projeto na Vercel: **Settings → General → Root Directory** → defina **`erp`** e salve.
2. **Settings → Environment Variables:** adicione `DATABASE_URL` com PostgreSQL (Neon, Supabase, etc.). SQLite não funciona em serverless.
3. Faça **Redeploy** do último commit.

O domínio **www.redacaonotamil.shop** deve estar ligado a **esse** projeto (o que usa a pasta `erp`).

## Domínio do sistema (ERP)

- **Produção:** [www.redacaonotamil.shop](https://www.redacaonotamil.shop) — o botão **Acessar sistema** usa **`/login`** no mesmo domínio (funciona quando o deploy é o Next em `erp/`).

## Pasta `erp/` (ERP)

Aplicação **Next.js 15 + Prisma** com módulos: painel, alunos, turmas, semestre/módulos, frequência, materiais, financeiro, relatórios, usuários, configurações. Ver `erp/ESTRUTURA.txt`.

```bash
cd erp
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — **`/`** = landing, **`/login`** = tela de entrada do ERP.
