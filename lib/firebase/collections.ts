import "server-only";
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
  WithFieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import type {
  ServerAppointment,
  ServerContactMessage,
  ServerService,
  GalleryImage,
  Testimonial,
  Faq,
  ServerClinicSettings,
  ServerAppUser,
} from "@/lib/types";
import { adminDb } from "./admin";

export const COLLECTIONS = {
  APPOINTMENTS: "appointments",
  CONTACT_MESSAGES: "contactMessages",
  SERVICES: "services",
  GALLERY_IMAGES: "galleryImages",
  TESTIMONIALS: "testimonials",
  FAQS: "faqs",
  SETTINGS: "settings",
  USERS: "users",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

// --- Converters ---

export const appointmentConverter: FirestoreDataConverter<ServerAppointment> = {
  toFirestore(model: WithFieldValue<ServerAppointment>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ServerAppointment {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      reference: data.reference,
      name: data.name ?? "",
      phone: data.phone ?? "",
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime ?? "any",
      service: data.service,
      message: data.message,
      consent: Boolean(data.consent),
      consentAt: data.consentAt,
      privacyPolicyVersion: data.privacyPolicyVersion,
      source: data.source,
      idempotencyKey: data.idempotencyKey,
      emailStatus: data.emailStatus,
      status: data.status ?? "new",
      notes: data.notes,
      activity: data.activity ?? [],
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    };
  },
};

export const contactMessageConverter: FirestoreDataConverter<ServerContactMessage> = {
  toFirestore(model: WithFieldValue<ServerContactMessage>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ServerContactMessage {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      reference: data.reference,
      name: data.name ?? "",
      phone: data.phone ?? "",
      email: data.email,
      subject: data.subject,
      message: data.message ?? "",
      consent: Boolean(data.consent),
      consentAt: data.consentAt,
      privacyPolicyVersion: data.privacyPolicyVersion,
      emailStatus: data.emailStatus,
      read: Boolean(data.read),
      archived: Boolean(data.archived),
      createdAt: data.createdAt as Timestamp,
    };
  },
};

export const serviceConverter: FirestoreDataConverter<ServerService> = {
  toFirestore(model: WithFieldValue<ServerService>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ServerService {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      category: data.category,
      image: data.image,
      shortDescription: data.shortDescription ?? "",
      fullDescription: data.fullDescription ?? "",
      content: data.content,
      icon: data.icon,
      symptoms: data.symptoms ?? [],
      treatmentProcess: data.treatmentProcess ?? [],
      benefits: data.benefits ?? [],
      duration: data.duration,
      whatToExpect: data.whatToExpect,
      faqs: data.faqs ?? [],
      active: data.active ?? true,
      order: data.order ?? 0,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    };
  },
};

export const galleryImageConverter: FirestoreDataConverter<GalleryImage<Timestamp>> = {
  toFirestore(model: WithFieldValue<GalleryImage<Timestamp>>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): GalleryImage<Timestamp> {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title ?? "",
      url: data.url ?? "",
      storagePath: data.storagePath,
      category: data.category ?? "clinic",
      caption: data.caption,
      width: data.width,
      height: data.height,
      order: data.order ?? 0,
      createdAt: data.createdAt as Timestamp,
    };
  },
};

export const testimonialConverter: FirestoreDataConverter<Testimonial<Timestamp>> = {
  toFirestore(model: WithFieldValue<Testimonial<Timestamp>>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Testimonial<Timestamp> {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      patientName: data.patientName ?? "",
      rating: data.rating ?? 5,
      treatment: data.treatment,
      review: data.review ?? "",
      verified: Boolean(data.verified),
      featured: Boolean(data.featured),
      createdAt: data.createdAt as Timestamp,
    };
  },
};

export const faqConverter: FirestoreDataConverter<Faq> = {
  toFirestore(model: WithFieldValue<Faq>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Faq {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      question: data.question ?? "",
      answer: data.answer ?? "",
      category: data.category ?? "General",
      order: data.order ?? 0,
      active: data.active ?? true,
    };
  },
};

export const clinicSettingsConverter: FirestoreDataConverter<ServerClinicSettings> = {
  toFirestore(model: WithFieldValue<ServerClinicSettings>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ServerClinicSettings {
    const data = snapshot.data();
    return {
      name: data.name ?? "Clinic Name",
      tagline: data.tagline ?? "",
      phone: data.phone ?? "",
      phoneDisplay: data.phoneDisplay ?? "",
      whatsapp: data.whatsapp ?? "",
      whatsappDisplay: data.whatsappDisplay ?? "",
      email: data.email ?? "",
      doctor: data.doctor ?? {
        name: "",
        qualification: "",
        experience: "",
        specialization: "",
        registrationNumber: "",
        bio: "",
      },
      address: data.address ?? {
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: "",
      },
      timings: data.timings ?? {
        days: "",
        morning: "",
        evening: "",
        sunday: "",
        emergencyNote: "",
      },
      mapEmbedUrl: data.mapEmbedUrl ?? "",
      socialLinks: data.socialLinks ?? {},
      updatedAt: data.updatedAt as Timestamp,
    };
  },
};

export const userConverter: FirestoreDataConverter<ServerAppUser> = {
  toFirestore(model: WithFieldValue<ServerAppUser>): DocumentData {
    return { ...model };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ServerAppUser {
    const data = snapshot.data();
    return {
      uid: snapshot.id,
      email: data.email ?? "",
      name: data.name ?? "",
      role: data.role ?? "staff",
      status: (data.status as "active" | "disabled") ?? "active",
      createdAt: data.createdAt as Timestamp,
      lastLoginAt: data.lastLoginAt as Timestamp | undefined,
    };
  },
};

// --- Typed Collection Reference Getters ---

export const getAppointmentsCollection = () =>
  adminDb.collection(COLLECTIONS.APPOINTMENTS).withConverter(appointmentConverter);

export const getContactMessagesCollection = () =>
  adminDb.collection(COLLECTIONS.CONTACT_MESSAGES).withConverter(contactMessageConverter);

export const getServicesCollection = () =>
  adminDb.collection(COLLECTIONS.SERVICES).withConverter(serviceConverter);

export const getGalleryImagesCollection = () =>
  adminDb.collection(COLLECTIONS.GALLERY_IMAGES).withConverter(galleryImageConverter);

export const getTestimonialsCollection = () =>
  adminDb.collection(COLLECTIONS.TESTIMONIALS).withConverter(testimonialConverter);

export const getFaqsCollection = () =>
  adminDb.collection(COLLECTIONS.FAQS).withConverter(faqConverter);

export const getClinicSettingsDocument = () =>
  adminDb.collection(COLLECTIONS.SETTINGS).doc("clinic").withConverter(clinicSettingsConverter);

export const getUsersCollection = () =>
  adminDb.collection(COLLECTIONS.USERS).withConverter(userConverter);
