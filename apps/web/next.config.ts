import type { NextConfig } from "next";

const apiUrl = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

// Type checking runs in CI with the native compiler (`bun run typecheck`), not inside `next build`.
const config: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ["@repo/validators"],
  typescript: { ignoreBuildErrors: true },
  rewrites: async () => [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }],
};

export default config;
