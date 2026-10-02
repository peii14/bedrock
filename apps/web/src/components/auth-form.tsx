"use client";

/** Sign in and sign up share one form; the mode picks the schema, fields and endpoint. */

import { Card, toast } from "@heroui/react";
import { type SignUpInput, signInInput, signUpInput } from "@repo/validators";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useProgressRouter } from "@/lib/progress-router";
import { useAppForm } from "./form/form-kit";
import { PrimaryLink } from "./links";
import { Typography } from "./ui/typography";

const MODES = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to continue where you left off.",
    submit: "Sign in",
    schema: signInInput.extend({ name: z.string() }),
    switchText: "No account yet?",
    switchLink: { href: "/sign-up", label: "Create one" },
  },
  "sign-up": {
    title: "Create your account",
    subtitle: "It takes less than a minute.",
    submit: "Create account",
    schema: signUpInput,
    switchText: "Already have an account?",
    switchLink: { href: "/sign-in", label: "Sign in" },
  },
} as const;

type Mode = keyof typeof MODES;

const safeRedirect = (next: string | null): Route =>
  (next?.startsWith("/") && !next.startsWith("//") ? next : "/projects") as Route;

export const AuthForm = ({ mode }: { mode: Mode }) => {
  const config = MODES[mode];
  const router = useProgressRouter();
  const [isNavigating, startNavigation] = useTransition();
  const next = safeRedirect(useSearchParams().get("next"));

  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "" } satisfies SignUpInput,
    validators: { onSubmit: config.schema },
    onSubmit: async ({ value }) => {
      const { error } =
        mode === "sign-in"
          ? await authClient.signIn.email({ email: value.email, password: value.password })
          : await authClient.signUp.email(value);
      if (error) return void toast.danger(error.message ?? "Something went wrong");
      startNavigation(() => router.replace(next));
    },
  });

  return (
    <Card className="p-2">
      <Card.Header className="gap-1">
        <Typography as="h1" variant="j2" font="secondary">
          {config.title}
        </Typography>
        <Typography variant="b3" color="secondary">
          {config.subtitle}
        </Typography>
      </Card.Header>
      <Card.Content>
        <form.AppForm>
          <form.Form>
            {mode === "sign-up" && (
              <form.AppField name="name">
                {(field) => <field.TextInput label="Name" />}
              </form.AppField>
            )}
            <form.AppField name="email">
              {(field) => <field.TextInput label="Email" type="email" autoComplete="email" />}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.TextInput
                  label="Password"
                  type="password"
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                />
              )}
            </form.AppField>
            <form.SubmitButton isPending={isNavigating}>{config.submit}</form.SubmitButton>
          </form.Form>
        </form.AppForm>
      </Card.Content>
      <Card.Footer className="justify-center gap-1 text-sm text-muted">
        {config.switchText}
        <PrimaryLink href={config.switchLink.href}>{config.switchLink.label}</PrimaryLink>
      </Card.Footer>
    </Card>
  );
};
