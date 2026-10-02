import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="grid min-h-dvh place-items-center p-6">
    <div className="w-full max-w-sm">{children}</div>
  </div>
);

export default AuthLayout;
