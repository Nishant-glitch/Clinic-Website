import {
  placeholderServices,
  placeholderWhyChooseUs,
  placeholderHowItWorks,
  placeholderTestimonials,
  placeholderFaqs,
  placeholderGallery,
  placeholderStats,
  placeholderTrustBadges,
  placeholderClinicStory,
  placeholderMissionVision,
  placeholderDoctorProfile,
  placeholderValues,
  placeholderFacilities,
  type WhyChooseUsItem,
  type HowItWorksStep,
  type ClinicStat,
  type TrustBadge,
  type ClinicStory,
  type ClinicMissionVision,
  type DoctorFullProfile,
  type ClinicValue,
  type ClinicFacility,
} from "./placeholder";
import type { Service, GalleryImage, Testimonial, Faq, GalleryCategory } from "@/lib/types";

// In Step 5, these functions will query Firestore with server-side caching (ISR).
// Keeping data fetching behind these functions ensures smooth migration.

export async function getServices(category?: string): Promise<Service<string>[]> {
  const activeServices = placeholderServices.filter((s) => s.active).sort((a, b) => a.order - b.order);
  if (category && category.toLowerCase() !== "all") {
    return activeServices.filter(
      (s) => s.category?.toLowerCase() === category.toLowerCase()
    );
  }
  return activeServices;
}

export async function getServiceBySlug(slug: string): Promise<Service<string> | null> {
  const service = placeholderServices.find((s) => s.slug === slug);
  return service ?? null;
}

export async function getRelatedServices(currentSlug: string, limit = 3): Promise<Service<string>[]> {
  return placeholderServices
    .filter((s) => s.active && s.slug !== currentSlug)
    .slice(0, limit);
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

export async function getGalleryImages(category?: GalleryCategory | "all"): Promise<GalleryImage<string>[]> {
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

export async function getClinicStory(): Promise<ClinicStory> {
  return placeholderClinicStory;
}

export async function getMissionVision(): Promise<ClinicMissionVision> {
  return placeholderMissionVision;
}

export async function getDoctorProfile(): Promise<DoctorFullProfile> {
  return placeholderDoctorProfile;
}

export async function getClinicValues(): Promise<ClinicValue[]> {
  return placeholderValues;
}

export async function getClinicFacilities(): Promise<ClinicFacility[]> {
  return placeholderFacilities;
}

export type {
  WhyChooseUsItem,
  HowItWorksStep,
  ClinicStat,
  TrustBadge,
  ClinicStory,
  ClinicMissionVision,
  DoctorFullProfile,
  ClinicValue,
  ClinicFacility,
};
