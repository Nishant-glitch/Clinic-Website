import * as React from "react";

// TODO: In Step 3 (Frontend), implement accessible FAQ accordion with structured FAQPage JSON-LD schema.
export function FAQSection() {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Frequently Asked Questions</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Common queries regarding appointments, OPD hours, and visits</p>
      </div>
    </section>
  );
}
