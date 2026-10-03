---
name: performance
description: Performance engineering rules, measurement, diagnostics, and optimization for the web app and API (Core Web Vitals, Next.js rendering and bundles, TanStack Query caching, Elysia, Postgres/Drizzle queries, Valkey, Bun builds, and production observability). Use when adding pages, data fetching, queries, dependencies, infrastructure, or when something feels slow, regresses, or needs benchmarking.
---

# Performance

**Measure first. Change one thing at a time. Measure again.**

Never optimize from intuition alone when a measurement can answer the question. Every performance change should have:

1. A baseline measurement.
2. One clearly identified change.
3. A post-change measurement using the same workload.
4. The command or procedure used to produce the numbers.
5. A conclusion stating whether the change improved, regressed, or did not materially change performance.

Prefer simple, reproducible benchmarks over synthetic micro-optimizations.

---

# Performance priorities

Optimize in this order:

1. User-visible latency and Core Web Vitals.
2. API latency and throughput.
3. Database query latency and query volume.
4. Client/server JavaScript execution and bundle size.
5. Memory, CPU, connection pools, and cache efficiency.
6. Build time and cold-start time.

Do not trade meaningful user-facing performance for a small improvement in build time, bundle size, or microbenchmark results without documenting the tradeoff.

---

# Targets

## Core Web Vitals

At the 75th percentile:

- **LCP ≤ 2.5 s**
- **INP ≤ 200 ms**
- **CLS ≤ 0.1**

Treat these as user-experience targets, not merely Lighthouse targets.

When evaluating a page, distinguish:

- Local development measurements.
- Production synthetic measurements.
- Real-user/field measurements.

Do not treat a single Lighthouse run as representative of field performance.

## API

Target approximately:

| Endpoint | In-process target |
|---|---:|
| Health | ~0.15 ms |
| List endpoint | ~1.5 ms |

Under approximately **50 concurrent connections on 2 vCPU**:

| Endpoint | Throughput target | p99 target |
|---|---:|---:|
| Health | ~20k req/s | <70 ms |
| List | ~1.5k req/s | <70 ms |

A **>20% regression** from an established baseline is a performance bug unless there is a documented reason.

Treat these numbers as project benchmarks, not universal industry standards.

## Startup

- API binary cold start: **<300 ms**

Measure startup separately from first-request latency.

---

# Required workflow

For performance-sensitive work:

### 1. Establish a baseline

Record:

- Command/workload.
- Environment.
- CPU/core configuration.
- Dataset size.
- Concurrency.
- Request duration.
- Throughput.
- p50/p95/p99 latency where available.
- Error rate.
- Memory/CPU where relevant.

### 2. Identify the bottleneck

Use evidence from:

- Browser performance traces.
- React/Next.js profiling.
- Network timing.
- API timing.
- Database query plans.
- Query duration logs.
- Cache hit/miss metrics.
- CPU/memory profiling.
- Bundle analysis.

Do not optimize unrelated code.

### 3. Make one material change

Avoid combining unrelated optimizations in the same measurement.

Examples:

- Add one database index.
- Move one component to a Server Component.
- Remove one client dependency.
- Change one cache policy.
- Batch one N+1 query.
- Add server-side query prefetching.

### 4. Re-run the same benchmark

Keep:

- Same endpoint.
- Same dataset.
- Same concurrency.
- Same duration.
- Same build mode.
- Same relevant environment.

### 5. Report the delta

Use:

```text
Baseline: p95 42 ms
After:    p95 31 ms
Change:   -26%

Command:
<exact command>
```

If there is no meaningful improvement, revert the change unless it provides another documented benefit.

---

# Web performance

## Rendering

- Use **Server Components by default**.
- Add `"use client"` only at the smallest leaf that requires browser state, effects, event handlers, or client-only APIs.
- Do not make an entire route client-rendered merely because one interactive control needs client state.
- Keep data fetching on the server whenever possible.

Before introducing a Client Component, ask:

1. Does it actually require browser state?
2. Can only the interactive leaf be client-rendered?
3. Can server-rendered data be passed as props?
4. Does the component increase the client bundle?

---

## Data fetching

Prefetch data on the server with TanStack Query and hydrate it into the client when the page benefits from immediate data availability.

Use the **same `queryOptions`** on server and client so query keys and configuration cannot drift.

Prefer:

```ts
await Promise.all([
  queryClient.prefetchQuery(firstQueryOptions),
  queryClient.prefetchQuery(secondQueryOptions),
])
```

over sequential independent fetches.

Never introduce a dependency chain when the data is independent.

If B does not depend on A, do not fetch:

```text
A → B
```

when you can fetch:

```text
A ─┐
   ├→ render
B ─┘
```

---

## Loading states

Do not replace already-visible data with a global spinner during pagination or background refetching.

Use TanStack Query's previous-data behavior where appropriate.

Prefer:

- Existing content remains visible.
- Pagination controls indicate pending state.
- New data replaces old data when available.

Reserve layout space for asynchronous content to prevent CLS.

---

## Streaming and Suspense

Use Suspense boundaries deliberately.

Good candidates:

- Independent slow data sections.
- Below-the-fold content.
- Expensive server-rendered sections.
- Personalized sections that should not block unrelated content.

Avoid wrapping the entire page in one Suspense boundary when independent sections can stream separately.

Measure whether streaming actually improves the user's critical path.

---

## Client bundles

Before adding a dependency:

1. Check whether the functionality already exists.
2. Check package size and dependency tree.
3. Check whether it is server-only.
4. Check whether it forces a large Client Component boundary.
5. Check production bundle output.

Use:

```bash
bun build --analyze
```

or the project's supported bundle-analysis tooling.

Prefer:

- Native platform APIs.
- Existing project dependencies.
- Small focused packages.
- Server-side implementations when client JavaScript is unnecessary.

Avoid adding a dependency solely for trivial functionality.

---

## Dynamic imports

Lazy-load heavy client-only widgets with `next/dynamic` when they are not required for the initial interaction.

Examples:

- Charts.
- Rich editors.
- Large visualization libraries.
- Maps.
- Complex admin widgets.

Do not dynamically import small components simply because they are client components. The optimization must justify the additional loading boundary.

---

## Images

Use `next/image`.

Provide explicit dimensions or otherwise reserve the correct layout space.

For important above-the-fold images:

- Use appropriate sizing.
- Avoid unnecessary transformations.
- Ensure the browser can discover the image early.
- Do not lazy-load the primary LCP image unless there is a specific reason.

For below-the-fold images, lazy loading is generally preferable.

Never use enormous source images when a smaller responsive asset is sufficient.

---

## Fonts

Fonts are self-hosted via `@fontsource`.

Do not add external font hosts.

Avoid loading font weights/styles that the application does not use.

Check whether font loading affects:

- LCP.
- CLS.
- Text rendering delay.
- Initial CSS size.

---

# API performance

## Request budget

Every additional operation in the request path must have a reason.

Pay particular attention to:

- Database round trips.
- Valkey round trips.
- External HTTP requests.
- Session lookups.
- Serialization.
- Large response payloads.

Avoid adding another network/database/cache round trip for a small convenience.

---

## Database queries

Use **one query per logical need**.

For paginated endpoints:

- Count and page queries can run in parallel when both are required.
- Select only columns returned by the API.
- Do not fetch full rows and discard most columns.

Prefer:

```ts
const [count, rows] = await Promise.all([
  countQuery,
  pageQuery,
])
```

over sequential execution when the queries are independent.

---

## N+1 queries

Never query inside a loop.

Bad:

```ts
for (const user of users) {
  await db.select(...).where(eq(posts.userId, user.id))
}
```

Prefer:

- `inArray`.
- Joins.
- Grouped queries.
- Batch loading.

Measure query count as well as total query time.

A query that takes 1 ms but executes 500 times is still a performance problem.

---

## Indexes

Every foreign key and frequently used filter/sort column should have an appropriate index.

For soft deletion, prefer partial indexes where appropriate:

```sql
WHERE deleted_at IS NULL
```

Do not blindly index every column.

For every new index, consider:

- Query frequency.
- Selectivity.
- Write amplification.
- Index size.
- Whether the query planner actually uses it.

Verify with `EXPLAIN (ANALYZE, BUFFERS)`.

---

## Query plans

When a database query is slow, inspect the actual execution plan before rewriting application code.

Check:

- Sequential scans.
- Unexpected nested loops.
- Bad row estimates.
- Sorts spilling to disk.
- Excessive rows removed by filters.
- Missing indexes.
- Large bitmap/index scans.
- Join order.
- Buffer reads.

Example:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT ...
```

Compare the actual execution plan before and after database changes.

---

# Pagination

Prefer database-level pagination.

For large or frequently changing datasets, consider cursor/keyset pagination rather than large `OFFSET` values.

Cursor pagination should use a stable, indexed ordering.

Avoid:

```sql
ORDER BY created_at
```

when `created_at` alone is not unique enough for stable pagination.

Prefer a deterministic ordering such as:

```sql
ORDER BY created_at DESC, id DESC
```

with a matching index where appropriate.

---

# Valkey and sessions

Sessions should normally come from **Better Auth's cookie cache and Valkey**, not Postgres.

Do not add a Postgres session lookup to ordinary authenticated requests unless required by the application's correctness model.

Keep the request path approximately:

```text
request
  ↓
cookie/session cache
  ↓
Valkey if required
  ↓
application
  ↓
database only when needed
```

Rate limiting and session lookup should each remain approximately **one Valkey round trip**.

Do not add additional Valkey operations without measurement.

Prefer batching/pipelining when multiple cache operations are genuinely required.

---

# HTTP caching

Use `Cache-Control` and ETags for **public GET responses** when appropriate.

Authenticated or personalized responses should remain:

```http
Cache-Control: no-store
```

Do not cache user-specific data publicly.

For cacheable resources, define:

- Cache key.
- TTL.
- Invalidation strategy.
- Stale behavior.
- ETag behavior.
- Whether CDN/browser caching is allowed.

Caching without an invalidation strategy is a correctness risk.

---

# Response payloads

Minimize response size without making APIs unnecessarily difficult to consume.

Check:

- Number of rows.
- Number of columns.
- Nested object duplication.
- Serialized JSON size.
- Compression.
- Pagination.

Do not return database columns that the UI does not need.

For large collections, prefer pagination or streaming rather than returning the entire dataset.

---

# API benchmarking

Build and benchmark the compiled production binary.

Example:

```bash
bun run --filter @repo/api build
RATE_LIMIT_MAX=100000000 PORT=4100 ./apps/api/dist/server &
bunx autocannon -c 50 -d 10 http://localhost:4100/api/health
```

Benchmark representative endpoints separately.

Record:

- Requests/sec.
- Average latency.
- p50.
- p95.
- p99.
- Errors.
- Concurrency.
- Test duration.

Do not compare a production build against development mode.

Do not compare benchmarks from different machines without recording the environment.

---

# In-process timing

For CPU-bound or application-stage performance:

- Warm up the code first.
- Measure at least 300 iterations.
- Use `performance.now()`.
- Exclude startup from steady-state measurements.
- Measure each meaningful stage separately.

Example methodology:

```text
20 warm-up runs
↓
300 measured runs
↓
report median / p95 / maximum
```

Do not rely only on one execution.

Avoid logging inside the timed region unless logging itself is what is being measured.

---

# Cold-start measurement

Measure API startup independently from request latency.

Use a clean process and record:

```text
process start
→ server ready
```

Then separately measure:

```text
server ready
→ first request completed
```

The cold-start target is:

```text
<300 ms
```

If startup regresses, identify whether the cost comes from:

- Module loading.
- ORM initialization.
- Configuration.
- Plugin registration.
- Schema loading.
- File I/O.
- Runtime initialization.

---

# Production build checks

## Web

Run:

```bash
cd apps/web
bun --bun next build
bun --bun next start
```

Measure against the production server.

Check:

- Build success.
- Bundle sizes.
- Route rendering mode.
- Client JavaScript.
- Image behavior.
- Font behavior.
- Cache headers.
- Core Web Vitals.

## API

Build the production binary before benchmarking:

```bash
bun run --filter @repo/api build
```

Never use development-mode latency as the production performance baseline.

---

# Browser measurement

Use an incognito browser window against the production build.

Measure multiple runs rather than relying on one run.

Check:

- LCP.
- INP.
- CLS.
- TTFB.
- FCP.
- Total transferred bytes.
- Main-thread blocking.
- Long tasks.
- Client JavaScript execution.

When a page is slow, separate:

```text
TTFB
+ server rendering
+ network transfer
+ HTML parsing
+ hydration
+ client JavaScript
+ image/font loading
```

Do not attribute all page latency to React or the database without evidence.

---

# Performance budgets

Where practical, establish explicit budgets for:

- LCP.
- INP.
- CLS.
- HTML size.
- JavaScript transferred.
- Largest JS chunk.
- API p95/p99.
- Database query duration.
- Query count per request.
- Cache hit rate.
- Cold start.

Treat budgets as regression gates for performance-sensitive routes.

A performance budget should be measured against the same production-like workload used for the baseline.

---

# Observability

Performance work should make future regressions easier to detect.

Track where appropriate:

- Request duration.
- p50/p95/p99 latency.
- Error rate.
- Request volume.
- Database query duration.
- Database query count.
- Cache hit/miss ratio.
- Valkey latency.
- Response size.
- CPU.
- Memory.
- GC pressure.
- Cold starts.

Use correlation/request IDs so slow requests can be traced across API → database → cache.

Do not log sensitive data merely to improve performance debugging.

---

# Common anti-patterns

Avoid:

- Sequential independent fetches.
- N+1 database queries.
- Fetching entire rows when only a few columns are needed.
- Database queries inside loops.
- Large Client Components caused by one interactive child.
- Shipping server-only dependencies to the browser.
- Unnecessary client-side fetching after server rendering.
- Global loading spinners replacing existing data.
- Unbounded list endpoints.
- Large `OFFSET` pagination on high-volume tables.
- Missing indexes on common filters/sorts.
- Extra Valkey round trips.
- Postgres session lookups when the cache already has the session.
- Public caching of personalized responses.
- Adding dependencies without checking bundle cost.
- Optimizing without a baseline.
- Reporting improvements without the measurement command.
- Combining multiple performance changes into one benchmark.
- Using development builds for production performance claims.

---

# Performance change checklist

Before merging a performance-related change:

- [ ] Baseline measured.
- [ ] Bottleneck identified with evidence.
- [ ] One primary optimization made.
- [ ] Same benchmark rerun.
- [ ] p50/p95/p99 checked where relevant.
- [ ] Error rate checked.
- [ ] Bundle impact checked for client changes.
- [ ] Query count checked for database changes.
- [ ] Query plan checked for database/index changes.
- [ ] Cache behavior checked for caching changes.
- [ ] Core Web Vitals checked for user-facing changes.
- [ ] Regression threshold checked.
- [ ] Exact measurement command recorded.
- [ ] Change reverted if it did not produce a meaningful benefit.

---

# Required reporting format

For completed performance work, report:

```text
## Result

Baseline:
- <metric>: <value>

After:
- <metric>: <value>

Change:
- <metric>: <delta>

Command:
<exact command>

Environment:
- <runtime>
- <CPU/concurrency>
- <dataset/workload>

Conclusion:
<one or two sentences describing the measured result>
```

If the optimization did not improve performance, say so explicitly.

Never claim a performance improvement without a measurement.

---

# Sources

- https://web.dev/articles/vitals
- https://nextjs.org/docs/app/guides/production-checklist
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
- https://orm.drizzle.team/docs/indexes-constraints