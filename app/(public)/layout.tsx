import * as React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { BookingProvider, BookingModal } from "@/components/booking";
import { siteConfig } from "@/lib/config/site";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clinicJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: siteConfig.doctor.photoUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.area,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.1136,
      longitude: 72.8258,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "13:00",
      },
    ],
    medicalSpecialty: "GeneralPractice",
    priceRange: "₹₹",
  };

  return (
    <BookingProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
      />
      <div className="flex min-h-screen flex-col bg-md-background text-md-on-background antialiased selection:bg-md-primary/20 selection:text-md-primary overflow-x-hidden">
        <TopBar />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <FloatingActions />
        <BookingModal />
      </div>
    </BookingProvider>
  );
}
