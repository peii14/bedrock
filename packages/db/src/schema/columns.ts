/** Column sets shared by every application table. */

import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

const tz = { withTimezone: true } as const;

export const primaryId = () => uuid().primaryKey().default(sql`uuidv7()`);

export const timestamps = {
  createdAt: timestamp(tz).notNull().defaultNow(),
  updatedAt: timestamp(tz)
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const softDelete = {
  deletedAt: timestamp(tz),
};
