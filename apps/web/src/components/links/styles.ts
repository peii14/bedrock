/** Shared link styles. Button and icon links reuse the same variants so they always match. */

import { tv } from "@heroui/react";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const textLink = tv({
  base: `inline-flex items-center gap-1 font-medium transition-colors duration-200 ${focusRing} rounded-sm`,
  variants: {
    variant: {
      primary: "text-accent hover:text-accent-hover",
      basic: "text-foreground hover:text-muted",
    },
  },
  defaultVariants: { variant: "primary" },
});

export const underlineLink = tv({
  base: `inline-flex items-center gap-1 font-medium ${focusRing} rounded-sm border-b border-dotted border-current pb-px transition-[border-color,color] duration-300 hover:border-solid`,
  variants: {
    color: { inherit: "", theme: "text-accent hover:text-accent-hover" },
  },
  defaultVariants: { color: "inherit" },
});

export const buttonLink = tv({
  base: `inline-flex items-center justify-center gap-1.5 rounded-xl font-medium shadow-sm transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.97] ${focusRing}`,
  variants: {
    variant: {
      primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
      outline: "border border-accent text-accent hover:bg-accent-soft",
      ghost: "text-accent shadow-none hover:bg-accent-soft",
      light: "border border-border bg-surface text-foreground hover:bg-surface-hover",
      dark: "bg-foreground text-background hover:opacity-90",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      base: "h-10 px-4 text-sm md:text-base",
      icon: "size-9 p-0",
    },
  },
  defaultVariants: { variant: "primary", size: "base" },
});
