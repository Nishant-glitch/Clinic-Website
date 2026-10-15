import "server-only";
import { revalidateTag, revalidatePath } from "next/cache";
import * as repo from "@/lib/server/repositories/contentRepository";
import { adminStorage } from "@/lib/firebase/admin";
import type {
  ServerService,
  GalleryImage,
  Testimonial,
  Faq,
} from "@/lib/types";
import { Timestamp } from "firebase-admin/firestore";
import { AppError } from "@/lib/server/errors";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function safeRevalidate(tag: string, paths: string[] = []) {
  try {
    revalidateTag(tag, "max");
    for (const path of paths) {
      revalidatePath(path);
    }
  } catch (err) {
    console.warn(`[Cache Revalidation] Could not revalidate tag '${tag}':`, err);
  }
}

// ================= SERVICES =================

export async function listServices(activeOnly = false) {
  return repo.listServices(activeOnly);
}

export async function getService(id: string) {
  return repo.getServiceById(id);
}

export async function createService(
  input: Omit<ServerService, "id" | "createdAt" | "updatedAt" | "slug" | "fullDescription"> & {
    slug?: string;
    fullDescription?: string;
  }
) {
  let slug = input.slug ? slugify(input.slug) : slugify(input.title);
  if (!slug) slug = `service-${Date.now()}`;

  // Check unique slug
  const existing = await repo.getServiceBySlug(slug);
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  const created = await repo.createService({
    ...input,
    slug,
    fullDescription: input.fullDescription || input.shortDescription || "",
  });

  safeRevalidate("services", ["/", "/services", `/services/${slug}`]);
  return created;
}

export async function updateService(
  id: string,
  patch: Partial<ServerService>
) {
  const current = await repo.getServiceById(id);
  if (!current) {
    throw new AppError("NOT_FOUND", `Service with ID ${id} not found`, 404);
  }

  const slug = patch.slug ? slugify(patch.slug) : current.slug;
  if (slug !== current.slug) {
    const existing = await repo.getServiceBySlug(slug);
    if (existing && existing.id !== id) {
      throw new AppError("DUPLICATE_SLUG", `A service with slug '${slug}' already exists`, 400);
    }
  }

  await repo.updateService(id, {
    ...patch,
    slug,
  });

  safeRevalidate("services", ["/", "/services", `/services/${slug}`, `/services/${current.slug}`]);
  return repo.getServiceById(id);
}

export async function deleteService(id: string) {
  const current = await repo.getServiceById(id);
  if (!current) return;

  await repo.deleteService(id);
  safeRevalidate("services", ["/", "/services", `/services/${current.slug}`]);
}

export async function reorderServices(ids: string[]) {
  await repo.reorderServices(ids);
  safeRevalidate("services", ["/", "/services"]);
}

// ================= GALLERY =================

export async function listGalleryImages() {
  return repo.listGalleryImages();
}

export async function createGalleryImage(
  input: Omit<GalleryImage<Timestamp>, "id" | "createdAt">
) {
  const created = await repo.createGalleryImage(input);
  safeRevalidate("gallery", ["/", "/gallery"]);
  return created;
}

export async function updateGalleryImage(
  id: string,
  patch: Partial<GalleryImage<Timestamp>>
) {
  await repo.updateGalleryImage(id, patch);
  safeRevalidate("gallery", ["/", "/gallery"]);
  return repo.getGalleryImageById(id);
}

export async function deleteGalleryImage(id: string) {
  const image = await repo.getGalleryImageById(id);
  if (image?.storagePath) {
    try {
      await adminStorage.bucket().file(image.storagePath).delete();
    } catch {
      // Storage file might not exist or already be deleted
    }
  }

  await repo.deleteGalleryImage(id);
  safeRevalidate("gallery", ["/", "/gallery"]);
}

export async function reorderGalleryImages(ids: string[]) {
  await repo.reorderGalleryImages(ids);
  safeRevalidate("gallery", ["/", "/gallery"]);
}

// ================= TESTIMONIALS =================

export async function listTestimonials(featuredOnly = false) {
  return repo.listTestimonials(featuredOnly);
}

export async function createTestimonial(
  input: Omit<Testimonial<Timestamp>, "id" | "createdAt">
) {
  const created = await repo.createTestimonial(input);
  safeRevalidate("testimonials", ["/", "/about"]);
  return created;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Testimonial<Timestamp>>
) {
  await repo.updateTestimonial(id, patch);
  safeRevalidate("testimonials", ["/", "/about"]);
  return repo.getTestimonialById(id);
}

export async function deleteTestimonial(id: string) {
  await repo.deleteTestimonial(id);
  safeRevalidate("testimonials", ["/", "/about"]);
}

export async function reorderTestimonials(ids: string[]) {
  await repo.reorderTestimonials(ids);
  safeRevalidate("testimonials", ["/", "/about"]);
}

// ================= FAQS =================

export async function listFaqs(activeOnly = false) {
  return repo.listFaqs(activeOnly);
}

export async function createFaq(input: Omit<Faq, "id">) {
  const created = await repo.createFaq(input);
  safeRevalidate("faqs", ["/", "/services"]);
  return created;
}

export async function updateFaq(id: string, patch: Partial<Faq>) {
  await repo.updateFaq(id, patch);
  safeRevalidate("faqs", ["/", "/services"]);
  return repo.getFaqById(id);
}

export async function deleteFaq(id: string) {
  await repo.deleteFaq(id);
  safeRevalidate("faqs", ["/", "/services"]);
}

export async function reorderFaqs(ids: string[]) {
  await repo.reorderFaqs(ids);
  safeRevalidate("faqs", ["/", "/services"]);
}
