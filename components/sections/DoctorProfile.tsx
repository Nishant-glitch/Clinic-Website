import * as React from "react";
import { siteConfig } from "@/lib/config/site";

// TODO: In Step 3 (Frontend), implement Doctor Profile with registration details, medical qualifications, OPD timings, and consultation approach.
export function DoctorProfile() {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Meet Your Doctor</h2>
          <p className="mt-2 text-sm text-on-surface-variant">{siteConfig.doctor.name} - {siteConfig.doctor.qualification}</p>
        </div>
      </div>
    </section>
  );
}
