/** Development seed: an admin account and a few projects. Refuses to run in production. */

import { projects, user } from "@repo/db";
import { eq } from "drizzle-orm";
import { createDeps } from "../deps";
import { env } from "../env";

if (env.NODE_ENV === "production") throw new Error("Refusing to seed in production");

const ADMIN = { email: "admin@example.com", password: "change-me-please-123", name: "Admin" };

const { db, auth, redis, logger } = await createDeps();

const existing = await db.query.user.findFirst({ where: eq(user.email, ADMIN.email) });
const adminId = existing?.id ?? (await auth.api.signUpEmail({ body: ADMIN })).user.id;
await db.update(user).set({ role: "admin", emailVerified: true }).where(eq(user.id, adminId));

await db.insert(projects).values(
  ["Website relaunch", "Mobile app", "Data pipeline", "Internal tools"].map((name, index) => ({
    ownerId: adminId,
    name,
    description: `Sample project ${index + 1}`,
  })),
);

logger.info("seeded", { admin: ADMIN.email });
redis.close();
process.exit(0);
