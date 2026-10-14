import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Management | Clinic Admin",
  robots: "noindex, nofollow",
};

// TODO: In Step 3/4, build content editor tabs for services, gallery images, doctor details, FAQs, testimonials, and clinic settings with ISR on-demand revalidation trigger.
export default function AdminContentPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-on-surface">Website Content Management</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Update services, gallery photos, FAQs, doctor credentials, and clinic timings.
      </p>
    </div>
  );
}
