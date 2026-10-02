/** Link family: primary, underline, arrow, button and icon links, all built on UnstyledLink. */

import type { VariantProps } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { buttonLink, textLink, underlineLink } from "./styles";
import { UnstyledLink, type UnstyledLinkProps } from "./unstyled-link";

export const PrimaryLink = ({
  variant,
  className,
  ...rest
}: UnstyledLinkProps & VariantProps<typeof textLink>) => (
  <UnstyledLink className={textLink({ variant, className })} {...rest} />
);

export const UnderlineLink = ({
  color,
  className,
  ...rest
}: Omit<UnstyledLinkProps, "color"> & VariantProps<typeof underlineLink>) => (
  <UnstyledLink className={underlineLink({ color, className })} {...rest} />
);

export const ArrowLink = ({
  direction = "right",
  children,
  className,
  ...rest
}: Omit<UnstyledLinkProps, "color"> &
  VariantProps<typeof underlineLink> & { direction?: "left" | "right" }) => (
  <UnderlineLink
    className={`group ${direction === "left" ? "flex-row-reverse" : ""} ${className ?? ""}`}
    {...rest}
  >
    <span>{children}</span>
    <ArrowRight
      aria-hidden
      className={`size-[1em] transition-transform duration-200 ${
        direction === "left"
          ? "rotate-180 group-hover:-translate-x-0.5"
          : "motion-safe:-translate-x-0.5 group-hover:translate-x-0.5"
      }`}
    />
  </UnderlineLink>
);

type IconSlots = { leftIcon?: LucideIcon; rightIcon?: LucideIcon };

export const ButtonLink = ({
  variant,
  size,
  leftIcon: Left,
  rightIcon: Right,
  children,
  className,
  ...rest
}: UnstyledLinkProps &
  Omit<VariantProps<typeof buttonLink>, "size"> &
  IconSlots & {
    size?: "sm" | "base";
  }) => (
  <UnstyledLink className={buttonLink({ variant, size, className })} {...rest}>
    {Left && <Left aria-hidden className="size-[1.1em]" />}
    {children}
    {Right && <Right aria-hidden className="size-[1.1em]" />}
  </UnstyledLink>
);

export const IconLink = ({
  icon: Icon,
  variant = "outline",
  className,
  ...rest
}: Omit<UnstyledLinkProps, "children"> &
  Omit<VariantProps<typeof buttonLink>, "size"> & { icon: LucideIcon; "aria-label": string }) => (
  <UnstyledLink className={buttonLink({ variant, size: "icon", className })} {...rest}>
    <Icon aria-hidden className="size-4" />
  </UnstyledLink>
);
