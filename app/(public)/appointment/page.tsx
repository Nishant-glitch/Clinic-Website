import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `Request Appointment | ${siteConfig.name}`,
  description: `Submit your appointment request with ${siteConfig.name}. Our front desk will call back to confirm your consultation schedule.`,
};

// TODO: In Step 3 (Frontend), build React Hook Form with Zod validation, preferred time window selection, and consent checkbox (India DPDP Act 2023).
export default function AppointmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-on-surface">Book an Appointment Request</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Fill out your details below. Our team will review your preferred date/time and call you to confirm your consultation.
      </p>
    </div>
  );
}
