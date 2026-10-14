import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

// TODO: In Step 3 (Frontend), implement full Hero section with doctor highlight badge, CTAs, emergency contact pill, and Framer Motion entrance animations.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-container/20 to-surface py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-on-surface">
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-on-surface-variant max-w-2xl">
          {siteConfig.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
          <Link
            href="/appointment"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-md hover:opacity-90"
          >
            Request Appointment
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}`}
            className="rounded-full border border-outline px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
