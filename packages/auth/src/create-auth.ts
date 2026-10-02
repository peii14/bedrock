/** Better Auth instance shared by the API. Providers and plugins are added here only. */

import type { Database } from "@repo/db";
import * as schema from "@repo/db/schema";
import { PASSWORD_MAX, PASSWORD_MIN } from "@repo/validators";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import type { RedisClient } from "bun";
import { createPasswordHasher } from "./password";
import { type ProviderEnv, socialProvidersFromEnv } from "./providers";
import { createRedisStorage } from "./redis-storage";
import { rehashOnSignIn } from "./rehash";

export type AuthConfig = {
  db: Database;
  redis: RedisClient;
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  production: boolean;
  peppers: Record<string, string>;
  currentPepper: string;
  providers: ProviderEnv;
  sendEmail: (message: { to: string; subject: string; text: string }) => Promise<void>;
};

export const createAuth = (config: AuthConfig) => {
  const hasher = createPasswordHasher({ peppers: config.peppers, current: config.currentPepper });

  return betterAuth({
    appName: "Starter",
    basePath: "/api/auth",
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: config.trustedOrigins,
    database: drizzleAdapter(config.db, { provider: "pg", schema }),
    secondaryStorage: createRedisStorage(config.redis),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: PASSWORD_MIN,
      maxPasswordLength: PASSWORD_MAX,
      requireEmailVerification: config.production,
      revokeSessionsOnPasswordReset: true,
      password: {
        hash: hasher.hash,
        verify: ({ hash, password }) => hasher.verify(password, hash),
      },
      sendResetPassword: ({ user, url }) =>
        config.sendEmail({ to: user.email, subject: "Reset your password", text: url }),
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: ({ user, url }) =>
        config.sendEmail({ to: user.email, subject: "Verify your email", text: url }),
    },
    socialProviders: socialProvidersFromEnv(config.providers),
    session: {
      storeSessionInDatabase: true,
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    rateLimit: {
      enabled: true,
      storage: "secondary-storage",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
        "/request-password-reset": { window: 300, max: 3 },
      },
    },
    advanced: {
      useSecureCookies: config.production,
      ipAddress: { ipAddressHeaders: ["x-forwarded-for"] },
      database: { generateId: () => Bun.randomUUIDv7() },
    },
    hooks: { after: rehashOnSignIn(hasher) },
    plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] }), openAPI()],
  });
};

export type Auth = ReturnType<typeof createAuth>;
