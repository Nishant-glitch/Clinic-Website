import * as React from "react";
import { Home, Calendar, AlertCircle } from "lucide-react";
import { ButtonLink, BlurShapes } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-md-background text-md-on-background">
      <div className="relative max-w-lg w-full rounded-[32px] md:rounded-[48px] bg-md-surface-container p-8 sm:p-12 text-center border border-md-outline/10 shadow-sm overflow-hidden">
        <BlurShapes />

        <div className="relative z-10 space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
            <AlertCircle className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-md-primary uppercase tracking-wider">
              Error 404
            </p>
            <h1 className="display-sm font-bold text-md-on-background tracking-tight">
              Page Not Found
            </h1>
            <p className="body-md text-md-on-surface-variant max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t locate the page you were looking for. It may have moved or no longer exists.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ButtonLink
              href="/"
              variant="filled"
              size="md"
              leftIcon={<Home className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Return Home
            </ButtonLink>

            <ButtonLink
              href="/appointment"
              variant="tonal"
              size="md"
              leftIcon={<Calendar className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Book Consultation
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
