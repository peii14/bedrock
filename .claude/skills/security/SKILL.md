---
name: security
description: Security rules for this stack mapped to the OWASP Top 10 2025 (access control, auth, sessions, passwords, input, secrets, headers, supply chain, logging, error handling). Use when touching auth, API routes, database queries, env or secrets, Docker, dependencies, or when asked to review code for security.
---

# Security

Authorization lives in the API. The web app only improves UX; never trust a check that runs in the browser or in `proxy.ts` alone.

## OWASP Top 10 2025 in this repo

| Risk | Rule here |
| --- | --- |
| A01 Broken Access Control | Every API route sets `{ auth: true }` or `{ auth: "admin" }`. Scope rows in the query (`where owner_id = actor.id`), never filter after fetching. Pages use `withAuth`, admin pages `withAuth(Page, { role: "admin" })`. |
| A02 Security Misconfiguration | Env is validated by Zod in `packages/config`; add every new variable there with strength rules. Docs (`API_DOCS_ENABLED`) stay off in production. Containers run non root, read only, `cap_drop: [ALL]`. |
| A03 Software Supply Chain | Pin exact versions, commit `bun.lock`, install with `--frozen-lockfile`, keep `minimumReleaseAge`, run `bun audit` and Trivy in CI. Justify every new dependency. |
| A04 Cryptographic Failures | Passwords use `createPasswordHasher` (Argon2id 19 MiB, t=2, plus HMAC pepper). Never roll your own crypto or hash with SHA alone. Secrets are at least 32 random bytes (`bun run secrets`). |
| A05 Injection | Only Drizzle query builders or `sql` tagged templates. Never string concatenate SQL. Escape `%` and `_` in LIKE search (see `escapeLike`). Sort and filter columns come from whitelists. |
| A06 Insecure Design | New features get a short threat list in the plan: who can call it, what they can see, what abuse looks like, what the rate limit is. |
| A07 Authentication Failures | Better Auth only. Keep rate limits on sign in, sign up and reset. Sessions are HttpOnly, Secure in production, SameSite=Lax. Revoke sessions on password reset. |
| A08 Integrity Failures | Validate every body, query and param with a schema. Responses pass through the item schema so undeclared columns never leak. |
| A09 Logging and Alerting | Use the structured logger; it redacts password, token, cookie, secret and pepper keys. Log auth failures and 5xx with `requestId`. Never log request bodies. |
| A10 Exceptional Conditions | Throw `HttpError` helpers; the error plugin returns RFC 9457 problem details. Unknown errors return a generic 500. Fail closed on auth, fail open only on the global rate limiter when Valkey is down. |

## Passwords and peppers
- Stored format is `<version>$<argon2 PHC>`. The salt is inside the PHC string.
- Rotate by adding a key to `PASSWORD_PEPPERS` and switching `PASSWORD_PEPPER_CURRENT`; hashes upgrade on the next sign in. Never delete a version still in use. A lost pepper means those passwords are gone.
- Password length 12 to 128 (`PASSWORD_MIN`, `PASSWORD_MAX`).

## Web
- CSP with a per request nonce is set in `proxy.ts`. Do not add `unsafe-inline` scripts or new external hosts without a reason.
- Never put secrets in `NEXT_PUBLIC_*`. Server only modules import `server-only`.
- Redirect targets from query strings go through `safeRedirect` (same origin paths only).

## Automated gates
- Commit: secretlint and gitleaks on staged files. Push: `bun audit`. CI: gitleaks on full history, Semgrep (registry packs + `.semgrep/bedrock.yml`), bun audit + OSV, Trivy config and filesystem scans, image scans.
- When a review finds a pattern that should never return, add a rule to `.semgrep/bedrock.yml` and test it on a planted example.
- Run locally: `bun run scan` (secrets + deps) and `bun run scan:sast` (needs Semgrep installed).
- Never bypass hooks with `--no-verify`; fix the finding or document a narrow ignore with the reason.

## Review checklist
- [ ] Route has an auth option and the query is owner scoped
- [ ] Input schema on body, query and params; unknown fields stripped
- [ ] No secret, token or personal data in logs, errors or client bundles
- [ ] New env var added to the Zod schema and `.env.example`
- [ ] New dependency pinned and justified
- [ ] Test covers the denied path (401, 403 or 404), not only the happy path

## Sources
- https://top10.owasp.org/2025/
- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- https://nextjs.org/docs/app/guides/production-checklist
- https://www.better-auth.com/docs
