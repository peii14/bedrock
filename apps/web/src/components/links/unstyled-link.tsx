/** Base link: internal paths get Next's prefetching and the progress bar, external URLs open safely in a new tab. */

import type { Route } from "next";
import NextLink from "next/link";
import type { ComponentProps } from "react";

export type UnstyledLinkProps = {
  href: string;
  openNewTab?: boolean;
} & Omit<ComponentProps<typeof NextLink>, "href">;

const isExternal = (href: string) => !href.startsWith("/") && !href.startsWith("#");

export const UnstyledLink = ({ href, openNewTab, ...rest }: UnstyledLinkProps) =>
  (openNewTab ?? isExternal(href)) ? (
    <NextLink href={href as Route} target="_blank" rel="noopener noreferrer" {...rest} />
  ) : (
    <NextLink href={href as Route} {...rest} />
  );
