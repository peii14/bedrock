import { ErrorView } from "../error-view";
import { AccessDeniedIllustration } from "../illustrations/access-denied";
import { ArrowLink } from "../links";

export const Forbidden = () => (
  <ErrorView
    code="403"
    title="You do not have access here"
    description="Ask an admin for access, or head back to your projects."
    illustration={<AccessDeniedIllustration className="h-auto w-full" />}
    actions={
      <ArrowLink href="/projects" direction="left" color="theme">
        Back to projects
      </ArrowLink>
    }
  />
);
