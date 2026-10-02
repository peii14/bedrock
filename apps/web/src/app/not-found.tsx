import type { Metadata } from "next";
import { ErrorView } from "@/components/error-view";
import { NotFoundIllustration } from "@/components/illustrations/page-not-found";
import { ArrowLink, ButtonLink } from "@/components/links";

export const metadata: Metadata = { title: "Page not found" };

const NotFound = () => (
  <ErrorView
    fullPage
    code="404"
    title="This page wandered off"
    description="The link may be broken, or the page was moved or deleted."
    illustration={<NotFoundIllustration className="h-auto w-full" />}
    actions={
      <>
        <ButtonLink href="/projects">Go to projects</ButtonLink>
        <ArrowLink href="/" direction="left">
          Home
        </ArrowLink>
      </>
    }
  />
);

export default NotFound;
