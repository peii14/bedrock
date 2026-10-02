"use client";

import { Button, cn } from "@heroui/react";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { useProgressRouter } from "@/lib/progress-router";
import { UnstyledLink } from "./links";
import { Typography } from "./ui/typography";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/ui", label: "UI kit" },
] as const;

type AppShellProps = { userName: string; children: ReactNode };

export const AppShell = ({ userName, children }: AppShellProps) => {
  const pathname = usePathname();
  const router = useProgressRouter();
  const [isSigningOut, startSignOut] = useTransition();
  const signOut = () =>
    startSignOut(async () => {
      await authClient.signOut();
      router.replace("/sign-in");
    });

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-separator bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-6">
            <UnstyledLink href="/projects">
              <Typography as="span" variant="h3" font="secondary">
                Starter
              </Typography>
            </UnstyledLink>
            <nav className="flex gap-1">
              {NAV.map(({ href, label }) => (
                <UnstyledLink
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                    pathname.startsWith(href)
                      ? "bg-accent-soft text-accent-soft-foreground"
                      : "text-muted hover:bg-default hover:text-foreground",
                  )}
                >
                  {label}
                </UnstyledLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Typography as="span" variant="b3" color="secondary" className="hidden sm:inline">
              {userName}
            </Typography>
            <Button size="sm" variant="secondary" isPending={isSigningOut} onPress={signOut}>
              <LogOut className="size-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
};
