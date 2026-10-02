/** Social providers switched on by env. Add new providers here; nothing else changes. */

import type { BetterAuthOptions } from "better-auth";

export type ProviderEnv = {
  GITHUB_CLIENT_ID?: string | undefined;
  GITHUB_CLIENT_SECRET?: string | undefined;
  GOOGLE_CLIENT_ID?: string | undefined;
  GOOGLE_CLIENT_SECRET?: string | undefined;
};

type SocialProviders = NonNullable<BetterAuthOptions["socialProviders"]>;

export const socialProvidersFromEnv = (env: ProviderEnv): SocialProviders => {
  const providers: SocialProviders = {};
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET };
  }
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
  }
  return providers;
};
