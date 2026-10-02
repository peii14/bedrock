/** API entrypoint: boots the server and shuts down cleanly on SIGTERM and SIGINT. */

import { createApp } from "./app";
import { createDeps } from "./deps";
import { env } from "./env";

if (process.argv.includes("--healthcheck")) {
  const ok = await fetch(`http://127.0.0.1:${env.PORT}/api/health`)
    .then((response) => response.ok)
    .catch(() => false);
  process.exit(ok ? 0 : 1);
}

const deps = await createDeps();
const app = (await createApp(deps)).listen({ port: env.PORT, hostname: "0.0.0.0" });
deps.logger.info("api started", { port: env.PORT, docs: deps.docsEnabled });

const shutdown = async (signal: string) => {
  deps.logger.info("shutting down", { signal });
  await app.stop();
  deps.redis.close();
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
