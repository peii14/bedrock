/** Tables required by Better Auth (core + admin plugin). Keep in sync with `auth:generate`. */

import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "./columns";

const tz = { withTimezone: true } as const;

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  role: text().notNull().default("user"),
  banned: boolean().notNull().default(false),
  banReason: text(),
  banExpires: timestamp(tz),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text().notNull().unique(),
    expiresAt: timestamp(tz).notNull(),
    ipAddress: text(),
    userAgent: text(),
    impersonatedBy: text(),
    ...timestamps,
  },
  (table) => [index().on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(tz),
    refreshTokenExpiresAt: timestamp(tz),
    scope: text(),
    password: text(),
    ...timestamps,
  },
  (table) => [index().on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp(tz).notNull(),
    ...timestamps,
  },
  (table) => [index().on(table.identifier)],
);
