import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `Clinic Gallery | ${siteConfig.name}`,
  description: `Take a virtual tour of our consultation rooms, reception, waiting lounge, and medical facilities.`,
};

// TODO: In Step 3 (Frontend), render responsive clinic photo gallery with categorized tabs and lightbox zoom preview.
export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-on-surface">Clinic Tour & Facility Gallery</h1>
      <p className="mt-4 text-on-surface-variant leading-relaxed">
        Clean, modern, and hygienic clinic infrastructure designed for patient comfort.
      </p>
    </div>
  );
}
