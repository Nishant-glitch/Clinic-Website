import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `Our Services | ${siteConfig.name}`,
  description: `Explore medical consultation and diagnostic services offered at ${siteConfig.name}.`,
};

// TODO: In Step 3 (Frontend), render list of clinical services, descriptions, symptoms addressed, and appointment request CTAs.
export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-on-surface">Clinical Services</h1>
      <p className="mt-4 text-on-surface-variant leading-relaxed">
        Comprehensive clinical consultation, preventive check-ups, and specialized diagnosis.
      </p>
    </div>
  );
}
