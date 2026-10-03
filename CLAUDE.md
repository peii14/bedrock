# Starter monorepo

Bun workspaces: `apps/api` (Elysia), `apps/web` (Next.js 16 + HeroUI v3), `packages/{auth,config,db,validators,tsconfig}`.

## Read first
Before any task, load the project skills in `.claude/skills/` that match it:
- `design-system` for any UI work
- `security` for auth, routes, queries, env, Docker, dependencies
- `performance` for data fetching, queries, bundles, benchmarks
- `code-quality` for all code changes
- `feature-testing` for tests and verification
- `parallel-agents` for multi file work, audits, or parallel agents

Review agents live in `.claude/agents/` (`code-reviewer`, `security-reviewer`, `test-runner`).

## Commands
- `bun run dev` starts Postgres and Valkey in Docker, then web (:3000) and api (:4000)
- `bun run db:migrate`, `bun run db:seed` (admin@example.com / change-me-please-123)
- `bun run check && bun run typecheck && bun run test` must pass before work is done

## Commits
- Conventional Commits, for example `feat(api): add invoices module`. Hooks check it; never use `--no-verify`.
- IMPORTANT: commit as the repo owner only. Never add Claude as co-author or any `Co-Authored-By` trailer.

## Rules that are easy to miss
- IMPORTANT: no file over 350 lines; CI fails on it.
- Shared Zod schemas in `@repo/validators` are the single contract for API, docs and forms.
- Auth is enforced in the API; `withAuth` and `proxy.ts` only shape the UI.
- Never return the Eden client from an async function (it is a proxy and becomes a thenable).
