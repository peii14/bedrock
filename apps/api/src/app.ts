/** Composes plugins and modules into the API. `App` is the type the web client is built from. */

import { Elysia } from "elysia";
import type { Deps } from "./deps";
import { healthModule } from "./modules/health";
import { projectsModule } from "./modules/projects";
import { authPlugin } from "./plugins/auth";
import { DOCS_PATH, docsPlugin } from "./plugins/docs";
import { errorHandler } from "./plugins/error-handler";
import { rateLimit } from "./plugins/rate-limit";
import { requestContext } from "./plugins/request-context";
import { securityHeaders } from "./plugins/security-headers";

const v1 = (deps: Deps) => new Elysia({ prefix: "/api/v1" }).use(projectsModule(deps));

export const createApp = async (deps: Deps) =>
  new Elysia({ name: "api" })
    .use(securityHeaders(DOCS_PATH))
    .use(requestContext(deps.logger))
    .use(errorHandler(deps.logger))
    .use(
      rateLimit({
        redis: deps.redis,
        logger: deps.logger,
        max: deps.rateLimitMax,
        windowSeconds: 60,
      }),
    )
    .use(await docsPlugin(deps.auth, deps.docsEnabled))
    .use(authPlugin(deps.auth))
    .use(healthModule(deps))
    .use(v1(deps));

export type App = Awaited<ReturnType<typeof createApp>>;
