import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name}, our medical philosophy, and Dr. ${siteConfig.doctor.name}.`,
};

// TODO: In Step 3 (Frontend), build About Us page with doctor background, clinic mission, hygiene standards, and facility infrastructure.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-on-surface">About {siteConfig.name}</h1>
      <p className="mt-4 text-on-surface-variant leading-relaxed">
        Founded with the commitment to provide accessible, patient-centered care.
      </p>
    </div>
  );
}
