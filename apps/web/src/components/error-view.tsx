/** Shared layout for 403, 404 and 500 pages: illustration, status code, message and next steps. */

import type { ReactNode } from "react";
import { Typography } from "./ui/typography";

type ErrorViewProps = {
  illustration: ReactNode;
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
  fullPage?: boolean;
};

export const ErrorView = ({
  illustration,
  code,
  title,
  description,
  actions,
  fullPage = false,
}: ErrorViewProps) => (
  <main
    className={`grid place-items-center px-6 py-16 ${fullPage ? "min-h-dvh" : "min-h-[60dvh]"}`}
  >
    <div className="flex w-full max-w-md animate-enter flex-col items-center gap-6 text-center">
      <div className="illustration w-full max-w-sm">{illustration}</div>
      <div className="flex flex-col items-center gap-2">
        <Typography as="span" variant="s3" color="theme" className="tracking-widest">
          {code}
        </Typography>
        <Typography as="h1" variant="j2" font="secondary">
          {title}
        </Typography>
        <Typography variant="b2" color="secondary">
          {description}
        </Typography>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
    </div>
  </main>
);
