import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
