import { ExternalLink, Plus, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { ArrowLink, ButtonLink, IconLink, PrimaryLink, UnderlineLink } from "@/components/links";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 py-3">
    <code className="w-28 shrink-0 text-xs text-muted">{label}</code>
    {children}
  </div>
);

export const LinksDemo = () => (
  <div className="flex flex-col divide-y divide-separator">
    <Row label="PrimaryLink">
      <PrimaryLink href="/projects">Primary</PrimaryLink>
      <PrimaryLink href="/projects" variant="basic">
        Basic
      </PrimaryLink>
    </Row>
    <Row label="UnderlineLink">
      <UnderlineLink href="/projects">Inherit color</UnderlineLink>
      <UnderlineLink href="/projects" color="theme">
        Theme color
      </UnderlineLink>
    </Row>
    <Row label="ArrowLink">
      <ArrowLink href="/projects" color="theme">
        Go to projects
      </ArrowLink>
      <ArrowLink href="/projects" direction="left">
        Back
      </ArrowLink>
    </Row>
    <Row label="ButtonLink">
      <ButtonLink href="/projects" leftIcon={Plus}>
        Primary
      </ButtonLink>
      <ButtonLink href="/projects" variant="outline">
        Outline
      </ButtonLink>
      <ButtonLink href="/projects" variant="ghost">
        Ghost
      </ButtonLink>
      <ButtonLink href="/projects" variant="light">
        Light
      </ButtonLink>
      <ButtonLink href="/projects" variant="dark" size="sm">
        Dark small
      </ButtonLink>
      <ButtonLink href="https://heroui.com" variant="light" rightIcon={ExternalLink}>
        External
      </ButtonLink>
    </Row>
    <Row label="IconLink">
      <IconLink href="/ui" icon={Settings} aria-label="Settings" />
      <IconLink href="/ui" icon={Plus} variant="primary" aria-label="Add" />
      <IconLink href="/ui" icon={Settings} variant="ghost" aria-label="Settings" />
    </Row>
  </div>
);
