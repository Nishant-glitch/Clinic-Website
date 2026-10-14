import * as React from "react";
import { siteConfig } from "@/lib/config/site";

// TODO: In Step 3 (Frontend), implement interactive Google Maps embed with landmark directions and parking/transit guidance.
export function LocationMap() {
  return (
    <section className="py-16 bg-surface-container-low">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Find Our Clinic</h2>
        <p className="mt-2 text-sm text-on-surface-variant">{siteConfig.address.fullAddress}</p>
      </div>
    </section>
  );
}
