"use client";

import * as React from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button, ButtonLink, BlurShapes } from "@/components/ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected errors
    console.error("Public Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-md-background">
      <div className="relative max-w-lg w-full rounded-[32px] md:rounded-[48px] bg-md-surface-container p-8 sm:p-12 text-center border border-md-outline/10 shadow-sm overflow-hidden">
        <BlurShapes />

        <div className="relative z-10 space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-md-error-container/30 text-md-error flex items-center justify-center">
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="display-sm font-bold text-md-on-background tracking-tight">
              Something went wrong
            </h1>
            <p className="body-md text-md-on-surface-variant max-w-sm mx-auto leading-relaxed">
              We encountered an unexpected issue while loading this page. Please try refreshing or return to the home page.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              variant="filled"
              size="md"
              onClick={() => reset()}
              leftIcon={<RefreshCcw className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>

            <ButtonLink
              href="/"
              variant="tonal"
              size="md"
              leftIcon={<Home className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Back to Home
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
