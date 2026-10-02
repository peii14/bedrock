/** Shimmer placeholders shaped like the real content, so the layout does not jump when data lands. */

import { cn, Spinner } from "@heroui/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const keys = (count: number) => Array.from({ length: count }, (_, index) => `placeholder-${index}`);

export const Skeleton = ({ className, ...rest }: ComponentPropsWithoutRef<"div">) => (
  <div aria-hidden className={cn("skeleton rounded-lg", className)} {...rest} />
);

const Loading = ({ className, children }: { className?: string; children: ReactNode }) => (
  <output aria-busy="true" aria-label="Loading" className={cn("animate-enter", className)}>
    {children}
  </output>
);

export const FullPageSpinner = () => (
  <Loading className="grid min-h-dvh place-items-center">
    <Spinner size="lg" />
  </Loading>
);

export const TableSkeleton = ({ rows = 6 }: { rows?: number }) => (
  <Loading className="flex flex-col gap-4">
    <div className="flex items-center justify-between gap-3">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-72 rounded-full" />
    </div>
    <div className="flex flex-col gap-3 rounded-3xl bg-surface p-4">
      <Skeleton className="h-4 w-1/3" />
      {keys(rows).map((key, index) => (
        <Skeleton key={key} className="h-10 w-full" style={{ animationDelay: `${index * 60}ms` }} />
      ))}
    </div>
  </Loading>
);

export const FormSkeleton = ({ fields = 3 }: { fields?: number }) => (
  <Loading className="flex flex-col gap-5">
    {keys(fields).map((key) => (
      <div key={key} className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <Skeleton className="h-10 w-full rounded-full" />
  </Loading>
);
