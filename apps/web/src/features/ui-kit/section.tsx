import type { ReactNode } from "react";
import { Typography } from "@/components/ui/typography";

type SectionProps = { id: string; title: string; description: string; children: ReactNode };

export const Section = ({ id, title, description, children }: SectionProps) => (
  <section id={id} className="flex scroll-mt-24 flex-col gap-4">
    <div className="flex flex-col gap-1">
      <Typography as="h2" variant="h2">
        {title}
      </Typography>
      <Typography variant="b3" color="secondary">
        {description}
      </Typography>
    </div>
    <div className="rounded-3xl border border-separator bg-surface p-6 shadow-xs">{children}</div>
  </section>
);
