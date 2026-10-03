/** Applies pending SQL migrations. Run as a one shot job before the API starts. */

import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";

const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const client = new SQL({ url, max: 1 });
await migrate(drizzle({ client }), {
  migrationsFolder: process.env.MIGRATIONS_DIR ?? new URL("../drizzle", import.meta.url).pathname,
});
await client.close();
console.info("Migrations applied");
