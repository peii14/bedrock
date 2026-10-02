/** Assigns a request id, exposes the logger, and logs one line per request. */

import { Elysia } from "elysia";
import type { Logger } from "../lib/logger";

export const requestContext = (logger: Logger) =>
  new Elysia({ name: "request-context" })
    .derive({ as: "global" }, ({ request, set }) => {
      const requestId = request.headers.get("x-request-id") ?? Bun.randomUUIDv7();
      set.headers["x-request-id"] = requestId;
      return { requestId, startedAt: performance.now(), log: logger };
    })
    .onAfterResponse({ as: "global" }, ({ request, requestId, startedAt, set }) => {
      logger.info("request", {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        status: set.status,
        ms: Math.round(performance.now() - startedAt),
      });
    });
