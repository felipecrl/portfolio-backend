# Backend - Painel Administrativo do Portfólio

API de autenticação e base do painel administrativo.


## Stack

- Node.js + Express
- PostgreSQL
- Prisma ORM

## Aviso importante: Prisma 7

Este projeto já está migrado para **Prisma 7**. Atenção para as mudanças:

- O arquivo `prisma/schema.prisma` **NÃO** possui mais a chave `url` no datasource.
- A configuração de conexão agora é feita via arquivo `prisma.config.ts` na raiz do backend.
- É obrigatório o uso de um **adapter** (aqui usamos `@prisma/adapter-pg` para PostgreSQL).
- O arquivo `.env` **NÃO** é mais lido automaticamente pelo Prisma CLI para a URL do banco.
- Veja exemplo de configuração em `prisma.config.ts`.

**Se você atualizar dependências do Prisma, consulte sempre a [documentação oficial](https://www.prisma.io/docs/orm/more/release-notes/7.0.0) para evitar erros de setup.**

### Passos para rodar localmente após a migração:

1. Instale as dependências:
	```bash
	npm install
	```
2. Ajuste o arquivo `.env` e o `prisma.config.ts` conforme seu ambiente.
3. Rode as migrações normalmente:
	```bash
	npm run prisma:migrate -- --name init
	```
4. Rode o seed se necessário:
	```bash
	npm run prisma:seed
	```
5. Inicie o servidor:
	```bash
	npm run dev
	```

## Segurança aplicada no login

- Senha com hash `bcrypt` (custo 14)
- Validação de payload com `zod`
- `helmet` para hardening de headers HTTP
- Rate limiting global e específico para login
- Cookie `HttpOnly` + `SameSite=Strict` (e `Secure` em produção)
- JWT com expiração configurável

## Configuração

1. Copie `.env.example` para `.env`.
2. Ajuste `DATABASE_URL` para seu PostgreSQL.
3. Rode migração e seed:

```bash
npm install
npm run prisma:migrate -- --name init
npm run prisma:seed
```

4. Inicie o servidor:

```bash
npm run dev
```

Servidor: `http://localhost:3333`

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/admin/panel`
- `GET /api/health`
