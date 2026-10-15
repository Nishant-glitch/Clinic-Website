import { unstable_cache } from "next/cache";
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
import type {
  Service,
  GalleryImage,
  Testimonial,
  Faq,
  GalleryCategory,
  ClientClinicSettings,
  ServerService,
} from "@/lib/types";
import * as contentRepo from "@/lib/server/repositories/contentRepository";
import * as settingsRepo from "@/lib/server/repositories/settingsRepository";

// ================= SERVICES =================

const getCachedServices = unstable_cache(
  async (): Promise<Service<string>[]> => {
    try {
      const items = await contentRepo.listServices(true);
      if (items && items.length > 0) {
        return items.map((s: ServerService) => ({
          ...s,
          createdAt: s.createdAt?.toDate ? s.createdAt.toDate().toISOString() : undefined,
          updatedAt: s.updatedAt?.toDate ? s.updatedAt.toDate().toISOString() : undefined,
        }));
      }
    } catch (err) {
      console.warn("[Data:getServices] Falling back to placeholders:", err);
    }
    return placeholderServices.filter((s) => s.active).sort((a, b) => a.order - b.order);
  },
  ["services-cache"],
  { tags: ["services"], revalidate: 3600 }
);

export async function getServices(category?: string): Promise<Service<string>[]> {
  const allServices = await getCachedServices();
  if (category && category.toLowerCase() !== "all") {
    return allServices.filter(
      (s) => s.category?.toLowerCase() === category.toLowerCase()
    );
  }
  return allServices;
}

export async function getServiceBySlug(slug: string): Promise<Service<string> | null> {
  const allServices = await getCachedServices();
  const service = allServices.find((s) => s.slug === slug);
  return service ?? null;
}

export async function getRelatedServices(currentSlug: string, limit = 3): Promise<Service<string>[]> {
  const allServices = await getCachedServices();
  return allServices.filter((s) => s.slug !== currentSlug).slice(0, limit);
}

// ================= TESTIMONIALS =================

const getCachedTestimonials = unstable_cache(
  async (): Promise<Testimonial<string>[]> => {
    try {
      const items = await contentRepo.listTestimonials(false);
      if (items && items.length > 0) {
        return items.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toDate ? t.createdAt.toDate().toISOString() : undefined,
        }));
      }
    } catch (err) {
      console.warn("[Data:getTestimonials] Falling back to placeholders:", err);
    }
    return placeholderTestimonials;
  },
  ["testimonials-cache"],
  { tags: ["testimonials"], revalidate: 3600 }
);

export async function getTestimonials(): Promise<Testimonial<string>[]> {
  return getCachedTestimonials();
}

export async function getFeaturedTestimonials(): Promise<Testimonial<string>[]> {
  const all = await getCachedTestimonials();
  return all.filter((t) => t.featured);
}

// ================= FAQS =================

const getCachedFaqs = unstable_cache(
  async (): Promise<Faq[]> => {
    try {
      const items = await contentRepo.listFaqs(true);
      if (items && items.length > 0) {
        return items;
      }
    } catch (err) {
      console.warn("[Data:getFaqs] Falling back to placeholders:", err);
    }
    return placeholderFaqs.filter((f) => f.active).sort((a, b) => a.order - b.order);
  },
  ["faqs-cache"],
  { tags: ["faqs"], revalidate: 3600 }
);

export async function getFaqs(category?: string): Promise<Faq[]> {
  const all = await getCachedFaqs();
  if (category) {
    return all.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }
  return all;
}

// ================= GALLERY =================

const getCachedGallery = unstable_cache(
  async (): Promise<GalleryImage<string>[]> => {
    try {
      const items = await contentRepo.listGalleryImages();
      if (items && items.length > 0) {
        return items.map((g) => ({
          ...g,
          createdAt: g.createdAt?.toDate ? g.createdAt.toDate().toISOString() : undefined,
        }));
      }
    } catch (err) {
      console.warn("[Data:getGallery] Falling back to placeholders:", err);
    }
    return placeholderGallery.sort((a, b) => a.order - b.order);
  },
  ["gallery-cache"],
  { tags: ["gallery"], revalidate: 3600 }
);

export async function getGalleryImages(category?: GalleryCategory | "all"): Promise<GalleryImage<string>[]> {
  const all = await getCachedGallery();
  if (category && category !== "all") {
    return all.filter((g) => g.category === category);
  }
  return all;
}

// ================= SETTINGS =================

const getCachedSettings = unstable_cache(
  async (): Promise<ClientClinicSettings> => {
    try {
      const settings = await settingsRepo.getClinicSettings();
      return {
        ...settings,
        updatedAt: settings.updatedAt?.toDate ? settings.updatedAt.toDate().toISOString() : undefined,
      };
    } catch (err) {
      console.warn("[Data:getSettings] Falling back to default settings:", err);
      const defaults = settingsRepo.getDefaultClinicSettings();
      return {
        ...defaults,
        updatedAt: undefined,
      };
    }
  },
  ["clinic-settings-cache"],
  { tags: ["settings"], revalidate: 3600 }
);

export async function getSettings(): Promise<ClientClinicSettings> {
  return getCachedSettings();
}

// ================= STATIC PLACEHOLDERS =================

export async function getWhyChooseUs(): Promise<WhyChooseUsItem[]> {
  return placeholderWhyChooseUs;
}

export async function getHowItWorks(): Promise<HowItWorksStep[]> {
  return placeholderHowItWorks.sort((a, b) => a.step - b.step);
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
