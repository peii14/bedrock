/** Liveness and readiness probes for containers and load balancers. */

import { sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import type { Deps } from "../../deps";

const detail = (summary: string) => ({ tags: ["System"], summary });

export const healthModule = ({ db, redis }: Pick<Deps, "db" | "redis">) =>
  new Elysia({ prefix: "/api" })
    .get("/health", () => ({ status: "ok" as const }), {
      response: t.Object({ status: t.Literal("ok") }),
      detail: detail("Liveness"),
    })
    .get(
      "/ready",
      async ({ set }) => {
        const [database, cache] = await Promise.allSettled([
          db.execute(sql`select 1`),
          redis.send("PING", []),
        ]);
        const ready = database.status === "fulfilled" && cache.status === "fulfilled";
        if (!ready) set.status = 503;
        return {
          database: database.status === "fulfilled",
          cache: cache.status === "fulfilled",
        };
      },
      { detail: detail("Readiness: database and cache reachable") },
    );
