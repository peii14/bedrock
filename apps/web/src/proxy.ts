/** Per request CSP nonce, security headers, and a cheap session cookie check for private routes. */

import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];
const PUBLIC_PATHS = ["/sign-in", "/sign-up"];
const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

export const proxy = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!hasSession && !isPublic) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-pathname", pathname + search);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  response.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  return response;
};

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
      missing: [{ type: "header", key: "next-router-prefetch" }],
    },
  ],
};
