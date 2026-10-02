# syntax=docker/dockerfile:1.7
# Build from the repo root: docker build -f docker/web.Dockerfile .
ARG BUN_VERSION=1.4.2

FROM oven/bun:${BUN_VERSION}-slim AS base
WORKDIR /app

FROM base AS prune
COPY . .
RUN bunx turbo@2.11.6 prune @repo/web --docker

FROM base AS build
COPY --from=prune /app/out/json/ .
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile --ignore-scripts
COPY --from=prune /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && bun run build

FROM oven/bun:${BUN_VERSION}-distroless AS web
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=nonroot /app/apps/web/.next/standalone ./
COPY --from=build --chown=nonroot /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nonroot /app/apps/web/public ./apps/web/public
USER nonroot
EXPOSE 3000
CMD ["apps/web/server.js"]
