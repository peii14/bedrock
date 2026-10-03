---
name: code-quality
description: Code conventions for this monorepo (file size limit, no repetition, docstrings, strict TypeScript, Biome, folder structure, how to add a resource end to end). Use when writing or refactoring any code, adding files, or reviewing a diff for quality.
---

# Code quality

Simple, direct, readable. Many small files over a few long ones.

## Hard rules (CI enforces them)
- No file over 350 lines (`scripts/check-file-length.ts`). Split when a file nears 200.
- Biome clean (`bun run check`), no `any`, no non null assertions, no unused code.
- `tsgo` clean across workspaces (`bun run typecheck`). Strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- Exact dependency versions; `bun.lock` committed.

## Commits
- Conventional Commits, enforced by commitlint: `type(scope): subject`, header up to 100 characters, lower case subject.
- Types: feat, fix, perf, refactor, test, docs, build, ci, chore, revert, style. Scopes: api, web, auth, config, db, validators, tsconfig, docker, nginx, ci, deps, repo, release.
- One logical change per commit. Hooks run Biome, the file length check, secret scans, and on push typecheck, unit tests and audit.

## No repetition
- One source of truth: Zod schemas in `packages/validators`, env in `packages/config`, tables in `packages/db`, auth in `packages/auth`, roles in `packages/validators`.
- Infer types (`z.infer`, `$inferSelect`, Eden). Never redeclare a type by hand.
- Reuse the factories: `createCrud` (API), `createResource`, `useResourceMutations`, `useListParams`, `DataTable`, `useAppForm` (web).
- Extract on the second real duplicate, not the first guess.

## Comments and docstrings
- Each file opens with a one or two line TSDoc header when its purpose is not obvious from the name.
- Exported functions get TSDoc only for side effects, thrown errors, security assumptions or non obvious parameters.
- Comments explain why, never what. Delete comments that restate the code.

## Structure
- API module: `apps/api/src/modules/<name>/index.ts` (plus `service.ts`, `routes.ts`, `schema.ts` once it outgrows the factory).
- Web feature: `apps/web/src/features/<name>/` with `resource.ts`, `columns.tsx`, view and dialog components.
- Shared UI: `components/ui`, `components/links`, `components/form`, `components/data-table`.
- Services take dependencies as arguments. No module reads `process.env` except `env.ts` files.
- Errors: throw `HttpError` helpers in the API; show `toast.danger` or field errors in the web.

## Add a resource end to end
1. Table in `packages/db/src/schema/` with `primaryId()`, `timestamps`, `softDelete`, `ownerId`; export it; `bun run db:generate`.
2. Schemas in `packages/validators/src/<name>.ts` (item, create, update, list query) and export them.
3. API: `createCrud({...})` module, register it in `app.ts` under `v1`.
4. Web: `createResource` endpoints, columns, a view with `DataTable`, a page with server prefetch.
5. Tests: API lifecycle test with Eden treaty; Playwright happy path if the UI matters.
6. Run `bun run check && bun run typecheck && bun run test`.

## Review checklist
- [ ] Smallest change that solves the task; no speculative abstraction
- [ ] Names say what things are; no abbreviations a newcomer would not know
- [ ] Errors handled at the boundary, not swallowed
- [ ] No duplication of an existing helper
- [ ] Every file under 350 lines

## Sources
- https://biomejs.dev/linter/rules/
- https://www.typescriptlang.org/tsconfig/
