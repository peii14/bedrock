/** OpenAPI spec and Scalar UI, including Better Auth endpoints. */

import { openapi } from "@elysiajs/openapi";
import type { Auth } from "@repo/auth";
import type { OpenAPIV3_1 } from "openapi-types";
import { z } from "zod";

export const DOCS_PATH = "/api/docs";
const AUTH_PREFIX = "/api/auth";

const toJsonSchema = (schema: z.ZodType) =>
  z.toJSONSchema(schema, {
    unrepresentable: "any",
    override: ({ zodSchema, jsonSchema }) => {
      if (zodSchema._zod.def.type !== "date") return;
      jsonSchema.type = "string";
      jsonSchema.format = "date-time";
    },
  });

type Reference = Pick<OpenAPIV3_1.Document, "paths" | "components">;

const authReference = async (auth: Auth): Promise<Reference> => {
  const { paths, components } = await auth.api.generateOpenAPISchema();
  const prefixed = Object.fromEntries(
    Object.entries(paths).map(([path, item]) => {
      const tagged = Object.fromEntries(
        Object.entries(item).map(([method, op]) => [method, { ...op, tags: ["Auth"] }]),
      );
      return [AUTH_PREFIX + path, tagged];
    }),
  );
  // Better Auth emits valid OpenAPI 3.1; its TS types are just looser than openapi-types.
  return { paths: prefixed, components } as Reference;
};

export const docsPlugin = async (auth: Auth, enabled: boolean) => {
  const reference: Reference = enabled ? await authReference(auth) : {};

  const documentation: Partial<OpenAPIV3_1.Document> = {
    info: { title: "Starter API", version: "1.0.0" },
    tags: [
      { name: "Auth", description: "Sign in, sign up, sessions" },
      { name: "Projects", description: "Example CRUD resource" },
      { name: "System", description: "Health and readiness" },
    ],
    paths: reference.paths ?? {},
    components: {
      ...reference.components,
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "better-auth.session_token" },
      },
    },
    security: [{ cookieAuth: [] }],
  };

  return openapi({
    enabled,
    path: DOCS_PATH,
    specPath: `${DOCS_PATH}/json`,
    provider: "scalar",
    mapJsonSchema: { zod: toJsonSchema },
    exclude: { paths: [/^\/api\/auth/] },
    documentation,
  });
};
