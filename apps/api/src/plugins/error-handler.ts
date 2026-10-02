/** Maps every error to RFC 9457 problem details; internals never leak to the client. */

import type { ProblemDetails } from "@repo/validators";
import { Elysia } from "elysia";
import { HttpError } from "../lib/errors";
import type { Logger } from "../lib/logger";

const problem = (status: number, title: string, extra: Partial<ProblemDetails> = {}) =>
  new Response(JSON.stringify({ type: "about:blank", title, status, ...extra }), {
    status,
    headers: { "content-type": "application/problem+json" },
  });

type ValidationIssue = { path?: string; summary?: string; message?: string };

const fieldErrors = (issues: ValidationIssue[]) => {
  const errors: Record<string, string[]> = {};
  for (const issue of issues) {
    const field = issue.path?.replace(/^\//, "").replaceAll("/", ".") || "_";
    const messages = errors[field] ?? [];
    messages.push(issue.summary ?? issue.message ?? "Invalid value");
    errors[field] = messages;
  }
  return errors;
};

export const errorHandler = (logger: Logger) =>
  new Elysia({ name: "error-handler" }).onError({ as: "global" }, ({ code, error, request }) => {
    const requestId = request.headers.get("x-request-id") ?? undefined;
    const meta = requestId ? { requestId } : {};

    if (error instanceof HttpError) {
      return problem(error.status, error.title, {
        ...meta,
        ...(error.detail && { detail: error.detail }),
      });
    }
    switch (code) {
      case "VALIDATION":
        return problem(422, "Unprocessable Content", { ...meta, errors: fieldErrors(error.all) });
      case "PARSE":
        return problem(400, "Bad Request", { ...meta, detail: "Malformed request body" });
      case "NOT_FOUND":
        return problem(404, "Not Found", meta);
      default:
        logger.error("unhandled error", { requestId, code, error });
        return problem(500, "Internal Server Error", meta);
    }
  });
