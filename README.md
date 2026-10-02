# Fullstack Bun Starter

Bun monorepo with a Next.js 16 + HeroUI web app and an Elysia API. It comes with auth (Better Auth, Argon2id + pepper), a generic CRUD layer, Scalar API docs, and Docker images ready to deploy.

## Stack

| Layer | Choice |
| --- | --- |
| Runtime, package manager, tests | Bun 1.4 |
| Monorepo tasks | Turborepo |
| Web | Next.js 16 (App Router, React Compiler), React 19, HeroUI v3, Tailwind v4 |
| Client state | Zustand (UI only), TanStack Query (server data), TanStack Table, TanStack Form |
| API | Elysia, Eden Treaty (end to end types), OpenAPI + Scalar |
| Auth | Better Auth (email/password, social, admin roles), Argon2id via `Bun.password` + HMAC pepper |
| Data | Postgres 18 + Drizzle (`Bun.SQL` driver), Valkey via `Bun.RedisClient` |
| Quality | TypeScript 7 (`tsgo`), Biome, Lefthook, 350 line file limit |

## Quick start

```bash
bun install
cp .env.example .env
bun run secrets        # paste the output into .env
bun run dev            # starts Postgres + Valkey in Docker, then web and api
bun run db:migrate     # in a second terminal
bun run db:seed        # admin@example.com / change-me-please-123
```

- Web: http://localhost:3000
- API docs (Scalar): http://localhost:3000/api/docs

## Layout

```
apps/
  api/        Elysia API: plugins/, modules/, lib/crud/
  web/        Next.js app: app/, features/, components/, lib/, stores/
packages/
  auth/       Better Auth config, password hasher, Redis storage, providers
  config/     Zod env schemas, validated at boot
  db/         Drizzle schema, client, migrations
  validators/ Zod schemas shared by API, OpenAPI docs and forms
  tsconfig/   Shared compiler presets
docker/       Dockerfiles, compose files, nginx config
```

## Scripts

| Script | Does |
| --- | --- |
| `bun run dev` | Dev services in Docker, then web and api in watch mode |
| `bun run check` | Biome lint/format + file length check |
| `bun run typecheck` | Native TypeScript compiler across workspaces |
| `bun run test` | Unit and API integration tests (needs Postgres + Valkey) |
| `bun run build` | Production builds (web standalone, api single binary) |
| `bun run db:generate` | New SQL migration from schema changes |
| `bun run db:migrate` | Apply migrations |
| `bun run db:seed` | Development data |
| `bun run secrets` | Fresh secrets for `.env` |

## Add a resource

1. **Table** in `packages/db/src/schema/` using `primaryId()`, `timestamps`, `softDelete` and an `ownerId`, then `bun run db:generate`.
2. **Schemas** in `packages/validators/src/` (item, create, update, list query).
3. **API**: one `createCrud({...})` call in `apps/api/src/modules/<name>/index.ts`, registered in `app.ts`. You get list (paging, sort whitelist, search, filters), get, create, update and soft delete, all owner scoped and documented in Scalar.
4. **Web**: `createResource(...)` endpoints, column defs, and a page using `DataTable`, `useListParams` and `useResourceMutations`. See `features/projects/`.

## Auth and SSO

- Email and password with verification and reset. Emails are logged in development; plug a real sender into `apps/api/src/lib/mailer.ts`.
- Social login: set `GITHUB_*` or `GOOGLE_*` in `.env`. More providers go in `packages/auth/src/providers.ts`.
- OIDC or SAML SSO: add Better Auth's `genericOAuth` or `@better-auth/sso` plugin in `packages/auth/src/create-auth.ts`. Routes, sessions and the frontend stay the same.
- Roles: `user` and `admin` via the admin plugin. Guard routes with `{ auth: true }` or `{ auth: "admin" }`.
- Passwords: Argon2id (19 MiB, 2 iterations) over an HMAC SHA256 pepper. Stored as `<version>$<phc>`. To rotate, add a key to `PASSWORD_PEPPERS` and switch `PASSWORD_PEPPER_CURRENT`. Hashes upgrade on the next sign in.

## Protected pages

Auth is checked on the server before anything renders, so protected UI never flashes.

```tsx
// any page or layout
export default withAuth(Page);                     // signed in users, gets `session` prop
export default withAuth(AdminPage, { role: "admin" });
export default withGuest(SignInPage);              // signed in users skip it
```

- Anonymous visitors are sent to `/sign-in?next=<page>` and come back after signing in.
- `proxy.ts` does a cheap cookie check first; `withAuth` does the real session check (cached per request).
- `app/loading.tsx` and `app/(dashboard)/loading.tsx` show a spinner or table skeleton while a route loads.
- Route changes show an nprogress bar. Use `useProgressRouter()` instead of `useRouter()` for programmatic navigation.

## UI building blocks

Sign in and open `/ui` to see all of them live.

| Piece | Where | Use |
| --- | --- | --- |
| Typography | `components/ui/typography.tsx` | `<Typography variant="h1" color="secondary" font="secondary">` with the j, h, s, b, l, c and p scale |
| Links | `components/links/` | `PrimaryLink`, `UnderlineLink`, `ArrowLink`, `ButtonLink`, `IconLink`, all on `UnstyledLink` |
| Forms | `components/form/` | `useAppForm` with `TextInput`, `NumberInput`, `SelectInput`, `RadioInput`, `CheckboxInput`, `SwitchInput`, `DateInput`, plus `form.Form` and `form.SubmitButton` |
| Skeletons | `components/ui/skeleton.tsx` | `Skeleton`, `TableSkeleton`, `FormSkeleton`, `FullPageSpinner` |
| Error pages | `components/error-view.tsx`, `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx` | 404, 500 and 403 with themed unDraw illustrations from `components/illustrations/` |
| Page transitions | `components/page-transition.tsx` | Each route group's `template.tsx` eases pages in; all motion respects reduced motion |

## Theme

Edit the brand palette, fonts and motion in `apps/web/src/styles/theme.css`. Fonts (Inter and Red Rose) are self hosted, so builds need no network. It's a Tailwind `@theme` block, so `bg-brand-500`, `text-brand-700` and so on work everywhere. HeroUI's accent (buttons, focus rings, progress bar) maps to the brand for both light and dark.

## Security defaults

- Env validated at boot; weak or missing secrets stop the app.
- Same origin: nginx (prod) or Next rewrites (dev) route `/api/*`, so cookies stay first party and CORS stays closed.
- nginx overwrites `X-Forwarded-For` with the real client address, so clients cannot spoof their IP to dodge rate limits.
- CSP with a per request nonce, HSTS and the usual headers on web and API.
- Rate limits: global per IP in Valkey, stricter limits on sign in, sign up and reset.
- Errors as RFC 9457 problem details; internals are logged, never returned.
- Responses pass through schemas, so undeclared columns never leak.
- Containers run as non root, read only, with all capabilities dropped.

## Deploy with Docker

```bash
cd docker
cp ../.env.example .env   # set PUBLIC_URL, SERVER_NAME, ACME_EMAIL, POSTGRES_PASSWORD and the secrets
docker compose up -d --build                  # self signed certificate (local or behind another TLS proxy)
docker compose --profile tls up -d --build    # adds certbot for a real Let's Encrypt certificate
```

The `migrate` job runs before the API starts. Images are stateless, so they move to any container host without code changes.

### nginx edge (`docker/nginx/`)

| Feature | Setting |
| --- | --- |
| Protocols | HTTP/2 and HTTP/3 (QUIC) with `Alt-Svc`, TLS 1.2 and 1.3 (Mozilla intermediate), session cache, no 0-RTT |
| Certificates | Let's Encrypt via certbot (webroot, renews every 12h check); a self signed placeholder lets nginx start first and is swapped in automatically |
| Routing | `/api/*` to the API, everything else to Next.js; upstreams re-resolve Docker DNS (`resolve`) and keep connections alive |
| Caching | `/_next/static/*` cached at the edge for a year, one copy per file, compressed per client; `X-Cache` shows HIT or MISS |
| Edge limits | 30 req/s per IP on `/api`, 30 req/min on `/api/auth`, 50 connections per IP; the API keeps its own finer limits in Valkey |
| Hardening | `server_tokens off`, header and body limits, timeouts, read only container, real client IP forwarded, `X-Request-Id` passed to the API for log correlation |
| Logs | JSON access log on stdout with request id, upstream time and cache status |

Tune the limits in `docker/nginx/nginx.conf` and the routes in `docker/nginx/templates/default.conf.template`.

## Credits

Illustrations in `apps/web/src/components/illustrations/` are from [unDraw](https://undraw.co) (free for commercial use, no attribution required), recolored to follow the theme.

## License

Proprietary. Copyright (c) Gayuh Kautaman. All rights reserved. See [LICENSE](LICENSE). Third party packages and illustrations keep their own licenses.
