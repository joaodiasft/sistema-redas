# sistema-redas

Site estático do projeto REDAS.

- **Repositório:** [github.com/joaodiasft/sistema-redas](https://github.com/joaodiasft/sistema-redas)
- **Hospedagem:** [Vercel — sistema-redas](https://vercel.com/naredacaonota1000-2663s-projects/sistema-redas)

## Desenvolvimento

Abra `index.html` no navegador ou sirva a pasta raiz com qualquer servidor HTTP estático.

## Deploy

Conecte o repositório GitHub ao projeto na Vercel (**Settings → Git**) para deploy automático a cada push na branch `main`.

## Domínio do sistema (ERP)

- **Produção:** [www.redacaonotamil.shop](https://www.redacaonotamil.shop) — o botão **Acessar sistema** em `index.html` aponta para o **login do ERP:** `https://www.redacaonotamil.shop/login` (comentário no HTML indica onde alterar).

## Pasta `erp/` (ERP)

Aplicação **Next.js 15 + Prisma** com módulos: painel, alunos, turmas, semestre/módulos, frequência, materiais, financeiro, relatórios, usuários, configurações. Ver `erp/ESTRUTURA.txt`.

```bash
cd erp
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) (redireciona para `/login`).
