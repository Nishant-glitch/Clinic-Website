import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `Contact & Location | ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name}. Find our clinic location, OPD timings, contact numbers, and inquiry form.`,
};

// TODO: In Step 3 (Frontend), build Contact Us page with contact details, Google Map embed, direct phone/WhatsApp actions, and validated inquiry form.
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-on-surface">Contact Us & Visit Clinic</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Have a question or need assistance? Reach out to our reception desk or visit us directly.
      </p>
    </div>
  );
}
