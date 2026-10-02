/** Example resource used to demonstrate the CRUD utilities end to end. */

import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { primaryId, softDelete, timestamps } from "./columns";

export const projectStatus = pgEnum("project_status", ["active", "archived"]);

export const projects = pgTable(
  "projects",
  {
    id: primaryId(),
    ownerId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    status: projectStatus().notNull().default("active"),
    ...timestamps,
    ...softDelete,
  },
  (table) => [
    index().on(table.ownerId, table.createdAt).where(sql`${table.deletedAt} is null`),
    index().on(table.status).where(sql`${table.deletedAt} is null`),
  ],
);
