---
name: feature-testing
description: How to test features here (bun test unit tests, API integration tests with Eden treaty, Playwright end to end, verification evidence). Use when adding or changing a feature, fixing a bug, or when asked to write tests or verify that something works.
---

# Feature testing

A feature is done when a check you ran says so. Show the evidence: the command, its output, or a screenshot.

## Which test
| Change | Test |
| --- | --- |
| Pure logic (schemas, hashing, helpers) | Unit test next to the file: `*.test.ts`, `bun test` |
| API route or module | Integration test in `apps/api/src/*.test.ts` using `treaty(app)` against real Postgres and Valkey |
| User flow (auth, forms, tables) | Playwright test with user facing locators |
| Bug fix | First a failing test that reproduces it, then the fix |

## API integration pattern
```ts
const deps = await createDeps();
const app = await createApp(deps);
const client = treaty(app, { headers: () => ({ origin, cookie }) }).api;

const { status, data, error } = await client.v1.projects.post(body);
expect(status).toBe(201);
```
- Sign up a fresh user in `beforeAll`; never depend on seed data.
- Cover the denied path (401, 403, 404, 422) for every route, not only success.
- Close Valkey in `afterAll`.

## Playwright rules
- Locate like a user: `getByRole`, `getByLabel`, `getByText`. Add `{ exact: true }` when labels overlap.
- Web first assertions: `await expect(locator).toBeVisible()`, never `expect(await locator.isVisible())`.
- Each test is isolated: its own user or storage state, no order dependence.
- Mock third party calls with `page.route`; never hit external sites.
- Wait on URLs and elements (`waitForURL`, `toBeVisible`), never on fixed timeouts.
- Screenshots hide the caret and can cause a harmless hydration warning in dev; ignore that one only.

## Run
```bash
docker compose -f docker/compose.dev.yml up -d --wait
bun run db:migrate
bun run test                       # all workspaces
bun --env-file=.env test apps/api  # one workspace
```

## Done means
- [ ] New or changed behavior has a test that failed before the change
- [ ] `bun run check && bun run typecheck && bun run test` pass
- [ ] UI changes checked in the browser in light and dark, desktop and phone width
- [ ] Evidence pasted in the summary

## Sources
- https://playwright.dev/docs/best-practices
- https://bun.sh/docs/cli/test
- https://elysiajs.com/eden/treaty/unit-test
