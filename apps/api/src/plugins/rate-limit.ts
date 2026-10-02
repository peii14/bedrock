/** Fixed window rate limit per client IP, shared across instances through Valkey. */

import type { RedisClient } from "bun";
import { Elysia } from "elysia";
import { tooManyRequests } from "../lib/errors";
import type { Logger } from "../lib/logger";

export type RateLimitOptions = {
  redis: RedisClient;
  logger: Logger;
  max: number;
  windowSeconds: number;
};

const clientIp = (request: Request, fallback: string | undefined) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || fallback || "unknown";

/** Fails open when Valkey is unreachable: auth endpoints keep their own stricter limiter. */
export const rateLimit = ({ redis, logger, max, windowSeconds }: RateLimitOptions) =>
  new Elysia({ name: "rate-limit" }).onBeforeHandle(
    { as: "global" },
    async ({ request, server, set }) => {
      const ip = clientIp(request, server?.requestIP(request)?.address);
      const window = Math.floor(Date.now() / 1000 / windowSeconds);
      const key = `rl:${ip}:${window}`;
      const count = await redis.incr(key).catch((error: unknown) => {
        logger.warn("rate limit skipped, cache unavailable", { error });
        return 0;
      });
      if (count === 1) await redis.expire(key, windowSeconds);

      set.headers["ratelimit-limit"] = String(max);
      set.headers["ratelimit-remaining"] = String(Math.max(0, max - count));
      if (count > max) throw tooManyRequests();
    },
  );
