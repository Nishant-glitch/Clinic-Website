import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import {
  Hero,
  TrustStrip,
  ServicesGrid,
  WhyChooseUs,
  HowItWorks,
  DoctorProfile,
  Testimonials,
  GalleryPreview,
  FAQSection,
  CTABanner,
  LocationMap,
} from "@/components/sections";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Senior Physician Consultation in Mumbai`,
  description: siteConfig.description,
  keywords: [
    "General Physician Mumbai",
    "Family Care Clinic Andheri",
    "Dr Rajesh Sharma Clinic",
    "Diabetes Management Mumbai",
    "Hypertension Treatment",
    "OPD Medical Consultation",
    "Doctor Appointment Mumbai",
  ],
  authors: [{ name: siteConfig.doctor.name }],
  openGraph: {
    title: `${siteConfig.name} - Quality Healthcare in Mumbai`,
    description: siteConfig.description,
    url: "https://sharmaclinic.in",
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: siteConfig.doctor.photoUrl,
        width: 800,
        height: 1000,
        alt: `${siteConfig.doctor.name} - ${siteConfig.doctor.qualification}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Senior Physician Consultation`,
    description: siteConfig.description,
    images: [siteConfig.doctor.photoUrl],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Services Preview */}
      <ServicesGrid />

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Doctor Profile */}
      <DoctorProfile />

      {/* 7. Patient Testimonials Slider */}
      <Testimonials />

      {/* 8. Clinic Facility Gallery Preview */}
      <GalleryPreview />

      {/* 9. FAQ Section */}
      <FAQSection />

      {/* 10. Call-to-Action Banner */}
      <CTABanner />

      {/* 11. Location & Interactive Map */}
      <LocationMap />
    </div>
  );
}
