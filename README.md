# Bedrock

Full stack starter on Bun: Next.js 16 + HeroUI, an Elysia API with end to end types, Better Auth (Argon2id + pepper), Postgres via Drizzle, and nginx in Docker.

## Quick start

```bash
bun install
cp .env.example .env && bun run secrets   # paste the output into .env
bun run dev                               # Postgres + Valkey in Docker, then web :3000 and api :4000
bun run db:migrate && bun run db:seed     # admin@example.com / change-me-please-123
```

API docs: http://localhost:3000/api/docs · UI kit: http://localhost:3000/ui

## Scripts

| Script | Does |
| --- | --- |
| `bun run check` | Lint, format, 350 line limit |
| `bun run typecheck` | Type check all workspaces |
| `bun run test` | Unit and API tests |
| `bun run build` | Production builds |
| `bun run db:generate` | New migration from schema changes |
| `bun run scan` | Secret and dependency scans |

## Layout

```
apps/api        Elysia API (plugins, modules, CRUD factory)
apps/web        Next.js app (pages, features, UI kit)
packages/*      auth, config, db, validators, tsconfig
docker/         Dockerfiles, compose, nginx
```

## Deploy

```bash
cd docker && cp ../.env.example .env    # set PUBLIC_URL, SERVER_NAME, ACME_EMAIL, POSTGRES_PASSWORD, secrets
docker compose --profile tls up -d --build
```

## Conventions

Commits follow Conventional Commits (`feat(api): add invoices`). Hooks run lint, secret scans and commitlint; CI adds tests, Semgrep, dependency and container scans. See [SECURITY.md](SECURITY.md).

## License

Proprietary. Copyright (c) Gayuh Kautaman. All rights reserved. See [LICENSE](LICENSE). Illustrations from [unDraw](https://undraw.co).
