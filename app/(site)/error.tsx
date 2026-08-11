"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";

/**
 * Route-level error boundary for the marketing pages. Renders inside the site
 * layout, so the navbar and footer stay put and the visitor keeps a way out.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section width="narrow" className="pt-40">
      <ErrorState
        icon={AlertTriangle}
        title="Something Went Wrong"
        description="This page hit an unexpected error. Trying again usually clears it — if it doesn't, we'd like to hear about it."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button href="/contact" variant="secondary">
              Report the problem
            </Button>
          </div>
        }
      />
    </Section>
  );
}
