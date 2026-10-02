/** Server side page guards. Auth is resolved before render, so protected UI never flashes. */

import "server-only";
import type { Role } from "@repo/validators";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { getServerSession, type Session } from "@/lib/api.server";
import { Forbidden } from "./forbidden";

export const HOME_ROUTE = "/projects" satisfies Route;
export const SIGN_IN_ROUTE = "/sign-in" satisfies Route;

export type WithSession = { session: Session };

/**
 * Wraps a page or layout so it only renders for signed in users (optionally with a role).
 * Anonymous visitors go to sign in and come back to the page they asked for.
 */
export const withAuth = <P extends object>(
  Component: ComponentType<P & WithSession>,
  { role }: { role?: Role } = {},
) => {
  const Protected = async (props: P) => {
    const session = await getServerSession();
    if (!session) {
      const next = (await headers()).get("x-pathname") ?? HOME_ROUTE;
      redirect(`${SIGN_IN_ROUTE}?next=${encodeURIComponent(next)}` as Route);
    }
    if (role && session.user.role !== role) return <Forbidden />;
    return <Component {...props} session={session} />;
  };
  return Protected;
};

/** Wraps sign in and sign up pages so signed in users skip them. */
export const withGuest = <P extends object>(Component: ComponentType<P>) => {
  const GuestOnly = async (props: P) => {
    if (await getServerSession()) redirect(HOME_ROUTE);
    return <Component {...props} />;
  };
  return GuestOnly;
};
