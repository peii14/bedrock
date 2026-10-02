/** Mounts Better Auth and adds the `auth` route option that injects `user` and `session`. */

import type { Auth, Role } from "@repo/auth";
import { Elysia } from "elysia";
import { forbidden, unauthorized } from "../lib/errors";

export const authPlugin = (auth: Auth) =>
  new Elysia({ name: "auth" })
    .all("/api/auth/*", ({ request }) => auth.handler(request), {
      parse: "none",
      detail: { hide: true },
    })
    .macro({
      auth: (requirement: true | Role) => ({
        async resolve({ request }) {
          const result = await auth.api.getSession({ headers: request.headers });
          if (!result) throw unauthorized();
          const role = result.user.role ?? "user";
          if (requirement !== true && role !== requirement) throw forbidden();
          return {
            user: result.user,
            session: result.session,
            actor: { id: result.user.id, role },
          };
        },
      }),
    });

export type SessionUser = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>["user"];
