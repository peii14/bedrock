/** Polymorphic text with a fixed type scale, so pages never hand pick font sizes. */

import { cn } from "@heroui/react";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const variants = {
  sj1: "text-9xl tracking-wider",
  sj2: "text-6xl tracking-wide",
  sj3: "text-5xl tracking-wide",
  sj4: "text-4xl tracking-wide",
  j1: "text-4xl font-semibold tracking-tight",
  j2: "text-3xl font-semibold tracking-tight",
  h1: "text-2xl font-semibold",
  h2: "text-xl font-semibold",
  h3: "text-lg font-semibold",
  h4: "text-base font-semibold",
  h5: "text-base font-medium",
  h6: "text-sm font-semibold",
  s1: "text-lg font-medium",
  s2: "text-base font-medium",
  s3: "text-sm font-medium",
  s4: "text-xs font-medium",
  b1: "text-lg",
  b2: "text-base",
  b3: "text-sm",
  l1: "text-lg font-light",
  l2: "text-base font-light",
  l3: "text-sm font-light",
  c1: "text-xs",
  c2: "text-[11px] leading-[14px]",
  p1: "text-[9px] font-light leading-[9px]",
} as const;

const colors = {
  primary: "text-foreground",
  secondary: "text-muted",
  tertiary: "text-muted/70",
  danger: "text-danger",
  white: "text-white",
  theme: "text-accent",
} as const;

const fonts = { primary: "font-sans", secondary: "font-secondary" } as const;

export type TypographyVariant = keyof typeof variants;

type TypographyProps<T extends ElementType> = {
  as?: T;
  variant?: TypographyVariant;
  color?: keyof typeof colors;
  font?: keyof typeof fonts;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "color" | "className">;

export const Typography = <T extends ElementType = "p">({
  as,
  variant = "b2",
  color = "primary",
  font = "primary",
  className,
  ...rest
}: TypographyProps<T>) => {
  const Component: ElementType = as ?? "p";
  return (
    <Component
      className={cn(variants[variant], colors[color], fonts[font], "text-pretty", className)}
      {...rest}
    />
  );
};
