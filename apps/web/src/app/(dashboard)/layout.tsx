import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { type WithSession, withAuth } from "@/components/auth/with-auth";

const DashboardLayout = ({ children, session }: { children: ReactNode } & WithSession) => (
  <AppShell userName={session.user.name}>{children}</AppShell>
);

export default withAuth(DashboardLayout);
