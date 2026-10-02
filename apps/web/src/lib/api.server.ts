/** Server side API client: talks to the API over the internal network and forwards the user's cookies. */

import "server-only";
import { parseEnv, webEnvSchema } from "@repo/config";
import type { Role } from "@repo/validators";
import { headers } from "next/headers";
import { cache } from "react";
import { createApi } from "./api";

export type Session = {
  user: { id: string; name: string; email: string; role?: Role | null };
  session: { id: string; expiresAt: string };
};

const env = parseEnv(webEnvSchema);

export const requestCookie = async () => (await headers()).get("cookie") ?? "";

/** Sync on purpose: the Eden client is a proxy, so returning it from an async function would make it a thenable. */
export const serverApi = (cookie: string) => createApi(env.API_INTERNAL_URL, { cookie });

/** Deduplicated per request, so layouts, guards and pages can all ask without extra round trips. */
export const getServerSession = cache(async (): Promise<Session | null> => {
  const response = await fetch(`${env.API_INTERNAL_URL}/api/auth/get-session`, {
    headers: { cookie: await requestCookie() },
    cache: "no-store",
  });
  return response.ok ? ((await response.json()) as Session | null) : null;
});
