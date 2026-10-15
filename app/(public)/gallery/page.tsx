import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { getGalleryImages } from "@/lib/data";
import { Container, PageHero } from "@/components/ui";
import { GalleryLightboxView } from "@/components/gallery/GalleryLightboxView";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: `Clinic Gallery & Facility Tour | ${siteConfig.name}`,
  description: `Take a visual tour of Dr. Sharma's Family Care Clinic in Andheri West: sterile consultation chambers, minor procedure suites, diagnostic corner, and community health events.`,
  alternates: {
    canonical: `${siteConfig.url}/gallery`,
  },
  openGraph: {
    title: `Clinic Photo Gallery | ${siteConfig.name}`,
    description: `Clean, modern, and hygienic clinic infrastructure designed for patient safety and clinical excellence in Mumbai.`,
    url: `${siteConfig.url}/gallery`,
  },
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="space-y-12 md:space-y-16 pb-8">
      {/* 1. Page Hero */}
      <PageHero
        breadcrumbs={[{ label: "Gallery" }]}
        eyebrow="Visual Facility Tour"
        title="Inside Dr. Sharma's Family Care Clinic"
        subtitle="Explore our sanitized consultation rooms, aseptic minor surgery suite, digital diagnostic units, and patient care areas."
      />

      {/* 2. Interactive Lightbox Grid */}
      <section className="py-2">
        <Container>
          <GalleryLightboxView images={images} />
        </Container>
      </section>

      {/* 3. CTA Banner */}
      <CTABanner />
    </div>
  );
}
