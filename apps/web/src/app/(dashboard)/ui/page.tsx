import type { Metadata } from "next";
import { Typography } from "@/components/ui/typography";
import { FormDemo } from "@/features/ui-kit/form-demo";
import { LinksDemo } from "@/features/ui-kit/links-demo";
import { Section } from "@/features/ui-kit/section";
import { SkeletonDemo } from "@/features/ui-kit/skeleton-demo";
import { TypographyDemo } from "@/features/ui-kit/typography-demo";

export const metadata: Metadata = { title: "UI kit" };

const UiKitPage = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-2">
      <Typography as="h1" variant="j1" font="secondary">
        UI kit
      </Typography>
      <Typography variant="b2" color="secondary">
        Every shared building block in one place. Copy from here when you build a page.
      </Typography>
    </div>
    <Section id="typography" title="Typography" description="One scale, set through variants.">
      <TypographyDemo />
    </Section>
    <Section
      id="links"
      title="Links"
      description="Internal links prefetch and show the progress bar."
    >
      <LinksDemo />
    </Section>
    <Section
      id="forms"
      title="Forms"
      description="TanStack Form with Zod. Errors show after a field is touched."
    >
      <FormDemo />
    </Section>
    <Section
      id="skeleton"
      title="Skeleton"
      description="Shimmer placeholders that match the layout."
    >
      <SkeletonDemo />
    </Section>
  </div>
);

export default UiKitPage;
