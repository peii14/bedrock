import { describe, expect, test } from "bun:test";
import { parseEnv } from "./parse-env";
import { apiEnvSchema } from "./schemas";

const key = Buffer.alloc(32, 7).toString("base64");
const valid = {
  DATABASE_URL: "postgres://app:app@localhost:5432/app",
  REDIS_URL: "redis://localhost:6379",
  BETTER_AUTH_SECRET: key,
  BETTER_AUTH_URL: "http://localhost:3000",
  WEB_ORIGIN: "http://localhost:3000",
  PASSWORD_PEPPERS: JSON.stringify({ v1: key }),
  PASSWORD_PEPPER_CURRENT: "v1",
};

describe("apiEnvSchema", () => {
  test("accepts a valid environment", () => {
    const env = parseEnv(apiEnvSchema, valid);
    expect(env.PORT).toBe(4000);
    expect(env.API_DOCS_ENABLED).toBe(false);
  });

  test("rejects a short secret", () => {
    expect(() => parseEnv(apiEnvSchema, { ...valid, BETTER_AUTH_SECRET: "short" })).toThrow(
      /BETTER_AUTH_SECRET/,
    );
  });

  test("rejects a current pepper that does not exist", () => {
    expect(() => parseEnv(apiEnvSchema, { ...valid, PASSWORD_PEPPER_CURRENT: "v2" })).toThrow(
      /PASSWORD_PEPPER_CURRENT/,
    );
  });
});
