import { apiEnvSchema, parseEnv } from "@repo/config";

export const env = parseEnv(apiEnvSchema);
