/** Environment schemas per app. Secrets are validated for strength, not just presence. */

import { z } from "zod";

const MIN_SECRET_BYTES = 32;

const base64Secret = z
  .string()
  .refine((value) => Buffer.from(value, "base64").byteLength >= MIN_SECRET_BYTES, {
    message: `must be base64 encoding at least ${MIN_SECRET_BYTES} random bytes`,
  });

const booleanFlag = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const peppers = z
  .string()
  .transform((value, ctx) => {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: 'must be JSON like {"v1":"<base64>"}' });
      return z.NEVER;
    }
  })
  .pipe(z.record(z.string().regex(/^[a-z0-9]+$/i), base64Secret));

export const apiEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    BETTER_AUTH_SECRET: base64Secret,
    BETTER_AUTH_URL: z.url(),
    WEB_ORIGIN: z.url(),
    API_DOCS_ENABLED: booleanFlag,
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
    PASSWORD_PEPPERS: peppers,
    PASSWORD_PEPPER_CURRENT: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })
  .refine((env) => env.PASSWORD_PEPPER_CURRENT in env.PASSWORD_PEPPERS, {
    message: "must name a version present in PASSWORD_PEPPERS",
    path: ["PASSWORD_PEPPER_CURRENT"],
  });

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export const webEnvSchema = z.object({
  API_INTERNAL_URL: z.url().default("http://localhost:4000"),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
