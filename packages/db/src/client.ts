/** Drizzle client on Bun's native Postgres driver. */

import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

export const createDb = (url: string, maxConnections = 10) => {
  const client = new SQL({ url, max: maxConnections, idleTimeout: 30 });
  return drizzle({ client, schema, casing: "snake_case" });
};

export type Database = ReturnType<typeof createDb>;
