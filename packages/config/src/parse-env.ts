/** Validates environment variables once at boot and fails fast with a readable report. */

import type { z } from "zod";

export const parseEnv = <T extends z.ZodType>(
  schema: T,
  source: Record<string, string | undefined> = process.env,
): z.infer<T> => {
  const result = schema.safeParse(source);
  if (result.success) return result.data;

  const issues = result.error.issues
    .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
};
