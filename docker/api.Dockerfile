# syntax=docker/dockerfile:1.7
# Build from the repo root: docker build -f docker/api.Dockerfile --target api .
ARG BUN_VERSION=1.4.2

FROM oven/bun:${BUN_VERSION}-slim AS base
WORKDIR /app

FROM base AS prune
COPY . .
RUN bunx turbo@2.11.6 prune @repo/api --docker

FROM base AS build
COPY --from=prune /app/out/json/ .
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile --ignore-scripts
COPY --from=prune /app/out/full/ .
RUN cd apps/api && bun run build
RUN bun build packages/db/src/migrate.ts --compile --minify --target bun --outfile dist/migrate

FROM gcr.io/distroless/cc-debian12:nonroot AS migrate
WORKDIR /app
COPY --from=build /app/dist/migrate ./migrate
COPY --from=build /app/packages/db/drizzle ./drizzle
ENV MIGRATIONS_DIR=/app/drizzle
ENTRYPOINT ["/app/migrate"]

FROM gcr.io/distroless/cc-debian12:nonroot AS api
WORKDIR /app
COPY --from=build /app/apps/api/dist/server ./server
ENV NODE_ENV=production PORT=4000
EXPOSE 4000
ENTRYPOINT ["/app/server"]
