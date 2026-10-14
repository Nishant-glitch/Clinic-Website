import * as React from "react";
import { Hero } from "@/components/sections/Hero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { DoctorProfile } from "@/components/sections/DoctorProfile";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQSection } from "@/components/sections/FAQSection";
import { LocationMap } from "@/components/sections/LocationMap";

// TODO: In Step 3 (Frontend), assemble public homepage sections with ISR data fetching and JSON-LD schema.
export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <ServicesGrid />
      <DoctorProfile />
      <Testimonials />
      <FAQSection />
      <LocationMap />
    </div>
  );
}
