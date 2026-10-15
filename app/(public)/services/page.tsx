import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { getServices } from "@/lib/data";
import { Container, PageHero } from "@/components/ui";
import { ServicesFilterList } from "@/components/services/ServicesFilterList";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: `Clinical Services | ${siteConfig.name}`,
  description: `Explore comprehensive outpatient clinical services offered by Dr. Rajiv Sharma in Andheri West: General OPD, Diabetes care, Hypertension, Pediatrics, Wound care, and ECG.`,
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: `Outpatient Medical Services | ${siteConfig.name}`,
    description: `Evidence-based clinical treatments, transparent consultation pricing, and quick callback appointments in Andheri West.`,
    url: `${siteConfig.url}/services`,
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-12 md:space-y-16 pb-8">
      {/* 1. Page Hero */}
      <PageHero
        breadcrumbs={[{ label: "Services" }]}
        eyebrow="Specialized Outpatient Care"
        title="Comprehensive Clinical Services"
        subtitle="Holistic, evidence-based healthcare designed for acute recovery, chronic lifestyle stabilization, and family wellness."
      />

      {/* 2. Services Filterable Grid */}
      <section className="py-2">
        <Container>
          <React.Suspense
            fallback={
              <div className="h-64 flex items-center justify-center text-xs text-md-on-surface-variant">
                Loading clinical services...
              </div>
            }
          >
            <ServicesFilterList initialServices={services} />
          </React.Suspense>
        </Container>
      </section>

      {/* 3. CTA Banner */}
      <CTABanner />
    </div>
  );
}
