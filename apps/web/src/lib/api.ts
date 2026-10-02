/** Typed API client generated from the Elysia `App` type, plus a helper that turns errors into throws. */

import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/api";
import type { ProblemDetails } from "@repo/validators";

export const createApi = (baseUrl: string, headers?: Record<string, string>) =>
  treaty<App>(baseUrl, {
    fetch: { credentials: "include" },
    ...(headers && { headers }),
  }).api;

export type Api = ReturnType<typeof createApi>;

export const api = createApi(
  typeof window === "undefined" ? "http://localhost:3000" : window.location.origin,
);

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: Partial<ProblemDetails>,
  ) {
    super(problem.detail ?? problem.title ?? `Request failed with ${status}`);
  }
}

type EdenResult<T> =
  | { data: T; error: null }
  | { data: null; error: { status: unknown; value: unknown } };

export const unwrap = async <T>(request: Promise<EdenResult<T>>): Promise<T> => {
  const { data, error } = await request;
  if (error) {
    const problem = typeof error.value === "object" && error.value ? error.value : {};
    throw new ApiError(Number(error.status), problem as Partial<ProblemDetails>);
  }
  return data;
};
