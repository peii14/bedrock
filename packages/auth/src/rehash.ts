/** Upgrades a stored password hash to the current pepper after a successful sign in. */

import { createAuthMiddleware } from "better-auth/api";
import type { PasswordHasher } from "./password";

export const rehashOnSignIn = (hasher: PasswordHasher) =>
  createAuthMiddleware(async (ctx) => {
    if (ctx.path !== "/sign-in/email") return;
    const session = ctx.context.newSession;
    const password: unknown = ctx.body?.password;
    if (!session || typeof password !== "string") return;

    const accounts = await ctx.context.internalAdapter.findAccounts(session.user.id);
    const credential = accounts.find((account) => account.providerId === "credential");
    if (!credential?.password || !hasher.needsRehash(credential.password)) return;

    await ctx.context.internalAdapter.updatePassword(session.user.id, await hasher.hash(password));
  });
