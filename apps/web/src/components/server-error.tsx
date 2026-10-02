"use client";

import { Button } from "@heroui/react";
import { RotateCw } from "lucide-react";
import { useEffect } from "react";
import { ErrorView } from "./error-view";
import { ServerDownIllustration } from "./illustrations/server-down";
import { ArrowLink } from "./links";

type ServerErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  fullPage?: boolean;
};

/** 500 view for route and root error boundaries. Shows the digest so users can quote it to support. */
export const ServerError = ({ error, reset, fullPage = false }: ServerErrorProps) => {
  useEffect(() => console.error(error), [error]);

  return (
    <ErrorView
      fullPage={fullPage}
      code="500"
      title="Something went wrong on our side"
      description={
        error.digest
          ? `Try again in a moment. If it keeps happening, share this code with support: ${error.digest}`
          : "Try again in a moment. If it keeps happening, let us know."
      }
      illustration={<ServerDownIllustration className="h-auto w-full" />}
      actions={
        <>
          <Button onPress={reset}>
            <RotateCw className="size-4" aria-hidden />
            Try again
          </Button>
          <ArrowLink href="/projects" direction="left">
            Back to projects
          </ArrowLink>
        </>
      }
    />
  );
};
