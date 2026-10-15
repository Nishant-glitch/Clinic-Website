import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  getServicesCollection,
  getGalleryImagesCollection,
  getTestimonialsCollection,
  getFaqsCollection,
} from "@/lib/firebase/collections";
import { adminDb } from "@/lib/firebase/admin";
import type {
  ServerService,
  GalleryImage,
  Testimonial,
  Faq,
} from "@/lib/types";

// ================= SERVICES =================

export async function listServices(activeOnly = false): Promise<ServerService[]> {
  const collection = getServicesCollection();
  const snapshot = await collection.orderBy("order", "asc").get();
  const items = snapshot.docs.map((d) => d.data());
  return activeOnly ? items.filter((s) => s.active) : items;
}

export async function getServiceById(id: string): Promise<ServerService | null> {
  const doc = await getServicesCollection().doc(id).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function getServiceBySlug(slug: string): Promise<ServerService | null> {
  const snapshot = await getServicesCollection()
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

export async function createService(
  data: Omit<ServerService, "id" | "createdAt" | "updatedAt">
): Promise<ServerService> {
  const collection = getServicesCollection();
  const docRef = collection.doc();

  const record: Record<string, unknown> = {
    ...data,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(record as unknown as ServerService);

  return {
    ...data,
    id: docRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export async function updateService(
  id: string,
  patch: Partial<ServerService>
): Promise<void> {
  const docRef = getServicesCollection().doc(id);
  const updateData: Record<string, unknown> = {
    ...patch,
    updatedAt: FieldValue.serverTimestamp(),
  };
  delete updateData.id;
  await docRef.update(updateData);
}

export async function deleteService(id: string): Promise<void> {
  await getServicesCollection().doc(id).delete();
}

export async function reorderServices(ids: string[]): Promise<void> {
  const collection = getServicesCollection();
  const batch = adminDb.batch();

  ids.forEach((id, index) => {
    batch.update(collection.doc(id), {
      order: index,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

// ================= GALLERY =================

export async function listGalleryImages(): Promise<GalleryImage<Timestamp>[]> {
  const collection = getGalleryImagesCollection();
  const snapshot = await collection.orderBy("order", "asc").get();
  return snapshot.docs.map((d) => d.data());
}

export async function getGalleryImageById(
  id: string
): Promise<GalleryImage<Timestamp> | null> {
  const doc = await getGalleryImagesCollection().doc(id).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function createGalleryImage(
  data: Omit<GalleryImage<Timestamp>, "id" | "createdAt">
): Promise<GalleryImage<Timestamp>> {
  const collection = getGalleryImagesCollection();
  const docRef = collection.doc();

  const record: Record<string, unknown> = {
    ...data,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(record as unknown as GalleryImage<Timestamp>);

  return {
    ...data,
    id: docRef.id,
    createdAt: Timestamp.now(),
  };
}

export async function updateGalleryImage(
  id: string,
  patch: Partial<GalleryImage<Timestamp>>
): Promise<void> {
  const docRef = getGalleryImagesCollection().doc(id);
  const updateData: Record<string, unknown> = { ...patch };
  delete updateData.id;
  await docRef.update(updateData);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await getGalleryImagesCollection().doc(id).delete();
}

export async function reorderGalleryImages(ids: string[]): Promise<void> {
  const collection = getGalleryImagesCollection();
  const batch = adminDb.batch();

  ids.forEach((id, index) => {
    batch.update(collection.doc(id), { order: index });
  });

  await batch.commit();
}

// ================= TESTIMONIALS =================

export async function listTestimonials(featuredOnly = false): Promise<Testimonial<Timestamp>[]> {
  const collection = getTestimonialsCollection();
  const snapshot = await collection.orderBy("createdAt", "desc").get();
  const items = snapshot.docs.map((d) => d.data());
  return featuredOnly ? items.filter((t) => t.featured) : items;
}

export async function getTestimonialById(
  id: string
): Promise<Testimonial<Timestamp> | null> {
  const doc = await getTestimonialsCollection().doc(id).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function createTestimonial(
  data: Omit<Testimonial<Timestamp>, "id" | "createdAt">
): Promise<Testimonial<Timestamp>> {
  const collection = getTestimonialsCollection();
  const docRef = collection.doc();

  const record: Record<string, unknown> = {
    ...data,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(record as unknown as Testimonial<Timestamp>);

  return {
    ...data,
    id: docRef.id,
    createdAt: Timestamp.now(),
  };
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Testimonial<Timestamp>>
): Promise<void> {
  const docRef = getTestimonialsCollection().doc(id);
  const updateData: Record<string, unknown> = { ...patch };
  delete updateData.id;
  await docRef.update(updateData);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await getTestimonialsCollection().doc(id).delete();
}

export async function reorderTestimonials(ids: string[]): Promise<void> {
  const collection = getTestimonialsCollection();
  const batch = adminDb.batch();

  ids.forEach((id, index) => {
    batch.update(collection.doc(id), { order: index });
  });

  await batch.commit();
}

// ================= FAQS =================

export async function listFaqs(activeOnly = false): Promise<Faq[]> {
  const collection = getFaqsCollection();
  const snapshot = await collection.orderBy("order", "asc").get();
  const items = snapshot.docs.map((d) => d.data());
  return activeOnly ? items.filter((f) => f.active) : items;
}

export async function getFaqById(id: string): Promise<Faq | null> {
  const doc = await getFaqsCollection().doc(id).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function createFaq(
  data: Omit<Faq, "id">
): Promise<Faq> {
  const collection = getFaqsCollection();
  const docRef = collection.doc();

  const record = {
    ...data,
    id: docRef.id,
  };

  await docRef.set(record);
  return record;
}

export async function updateFaq(
  id: string,
  patch: Partial<Faq>
): Promise<void> {
  const docRef = getFaqsCollection().doc(id);
  const updateData: Record<string, unknown> = { ...patch };
  delete updateData.id;
  await docRef.update(updateData);
}

export async function deleteFaq(id: string): Promise<void> {
  await getFaqsCollection().doc(id).delete();
}

export async function reorderFaqs(ids: string[]): Promise<void> {
  const collection = getFaqsCollection();
  const batch = adminDb.batch();

  ids.forEach((id, index) => {
    batch.update(collection.doc(id), { order: index });
  });

  await batch.commit();
}
