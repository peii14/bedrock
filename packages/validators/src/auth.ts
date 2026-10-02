/** Credential rules shared by the sign in and sign up forms and the API. */

import { z } from "zod";

export const roles = ["user", "admin"] as const;
export type Role = (typeof roles)[number];

export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

export const email = z.email().trim().toLowerCase().max(254);

export const password = z
  .string()
  .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters`);

export const signInInput = z.object({
  email,
  password: z.string().min(1, "Password is required").max(PASSWORD_MAX),
});

export const signUpInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email,
  password,
});

export type SignInInput = z.infer<typeof signInInput>;
export type SignUpInput = z.infer<typeof signUpInput>;
