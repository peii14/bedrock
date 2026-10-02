/** Wires infrastructure from validated env. The only place that reads `env` for services. */

import { createAuth } from "@repo/auth";
import { createDb } from "@repo/db";
import { RedisClient } from "bun";
import { env } from "./env";
import { logger } from "./lib/logger";
import { createConsoleMailer } from "./lib/mailer";

export const createDeps = async () => {
  const db = createDb(env.DATABASE_URL);
  const redis = new RedisClient(env.REDIS_URL, {
    autoReconnect: true,
    maxRetries: 2 ** 32 - 1,
    enableOfflineQueue: false,
  });
  await redis.connect();
  const production = env.NODE_ENV === "production";

  const auth = createAuth({
    db,
    redis,
    production,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.WEB_ORIGIN],
    peppers: env.PASSWORD_PEPPERS,
    currentPepper: env.PASSWORD_PEPPER_CURRENT,
    sendEmail: createConsoleMailer(logger),
    providers: env,
  });

  return {
    db,
    redis,
    auth,
    logger,
    docsEnabled: env.API_DOCS_ENABLED,
    rateLimitMax: env.RATE_LIMIT_MAX,
  };
};

export type Deps = Awaited<ReturnType<typeof createDeps>>;
