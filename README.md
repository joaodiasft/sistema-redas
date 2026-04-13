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
| `/login` | Login (demo → painel) |
| `/dashboard` | Painel |
| `/dashboard/alunos` … `/dashboard/configuracoes` | Módulos (placeholders) |
| outras | 404 com links úteis |

Menu lateral: **Site público** → `/`, **Sair** → `/login`.

## Desenvolvimento local

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

- http://localhost:3000/ — landing  
- http://localhost:3000/login — ERP  

**Sincronizar landing:** o arquivo “oficial” para o Next é `public/index.html`. A raiz tem também `index.html` para abrir direto no navegador; ao mudar textos, atualize **os dois** (ou copie: `Copy-Item index.html public\index.html` no PowerShell).

## Deploy na Vercel

1. Projeto conectado ao repositório **joaodiasft/sistema-redas** (branch `main`).
2. **Root Directory** deve ficar **vazio** (padrão, raiz do repo). Se antes estava `erp`, **apague** e salve — a pasta `erp` não existe mais e o build quebraria.
3. Build: `npm run build` (padrão). Framework: **Next.js**.
4. Variável **`DATABASE_URL`** (PostgreSQL) em produção — não use SQLite na Vercel.

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
