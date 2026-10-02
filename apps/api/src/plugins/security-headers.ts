/** Baseline security headers for every API response. */

import { Elysia } from "elysia";

const HEADERS = {
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
} as const;

const API_CSP = "default-src 'none'; frame-ancestors 'none'";
const DOCS_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data:; " +
  "connect-src 'self'; frame-ancestors 'none'";

export const securityHeaders = (docsPath: string) =>
  new Elysia({ name: "security-headers" }).onRequest(({ request, set }) => {
    Object.assign(set.headers, HEADERS);
    const isDocs = new URL(request.url).pathname.startsWith(docsPath);
    set.headers["content-security-policy"] = isDocs ? DOCS_CSP : API_CSP;
    if (!isDocs) set.headers["cache-control"] = "no-store";
  });
