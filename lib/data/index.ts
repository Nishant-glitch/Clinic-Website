import {
  placeholderServices,
  placeholderWhyChooseUs,
  placeholderHowItWorks,
  placeholderTestimonials,
  placeholderFaqs,
  placeholderGallery,
  placeholderStats,
  placeholderTrustBadges,
  type WhyChooseUsItem,
  type HowItWorksStep,
  type ClinicStat,
  type TrustBadge,
} from "./placeholder";
import type { Service, GalleryImage, Testimonial, Faq } from "@/lib/types";

// In Step 5, these functions will query Firestore with server-side caching (ISR).
// Keeping data fetching behind these functions ensures smooth migration.

export async function getServices(): Promise<Service<string>[]> {
  return placeholderServices.filter((s) => s.active).sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string): Promise<Service<string> | null> {
  const service = placeholderServices.find((s) => s.slug === slug);
  return service ?? null;
}

export async function getWhyChooseUs(): Promise<WhyChooseUsItem[]> {
  return placeholderWhyChooseUs;
}

export async function getHowItWorks(): Promise<HowItWorksStep[]> {
  return placeholderHowItWorks.sort((a, b) => a.step - b.step);
}

export async function getTestimonials(): Promise<Testimonial<string>[]> {
  return placeholderTestimonials;
}

export async function getFeaturedTestimonials(): Promise<Testimonial<string>[]> {
  return placeholderTestimonials.filter((t) => t.featured);
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  if (category) {
    return placeholderFaqs.filter((f) => f.active && f.category.toLowerCase() === category.toLowerCase());
  }
  return placeholderFaqs.filter((f) => f.active).sort((a, b) => a.order - b.order);
}

export async function getGalleryImages(category?: string): Promise<GalleryImage<string>[]> {
  if (category && category !== "all") {
    return placeholderGallery.filter((g) => g.category === category).sort((a, b) => a.order - b.order);
  }
  return placeholderGallery.sort((a, b) => a.order - b.order);
}

export async function getClinicStats(): Promise<ClinicStat[]> {
  return placeholderStats;
}

export async function getTrustBadges(): Promise<TrustBadge[]> {
  return placeholderTrustBadges;
}
