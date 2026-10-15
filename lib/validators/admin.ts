import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "new",
  "called",
  "confirmed",
  "visited",
  "cancelled",
]);

export const appointmentPatchSchema = z
  .object({
    status: appointmentStatusSchema.optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export const appointmentBulkSchema = z
  .object({
    ids: z.array(z.string().min(1)).min(1).max(50),
    status: appointmentStatusSchema,
  })
  .strict();

export const messagePatchSchema = z
  .object({
    read: z.boolean(),
  })
  .strict();

export const serviceTreatmentStepSchema = z.object({
  step: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const serviceFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const serviceAdminSchema = z
  .object({
    title: z.string().min(2).max(100),
    slug: z.string().min(2).max(100).optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    shortDescription: z.string().min(5).max(300),
    fullDescription: z.string().optional(),
    content: z.string().optional(),
    icon: z.string().optional(),
    symptoms: z.array(z.string()).optional(),
    treatmentProcess: z.array(serviceTreatmentStepSchema).optional(),
    benefits: z.array(z.string()).optional(),
    duration: z.string().optional(),
    whatToExpect: z.string().optional(),
    faqs: z.array(serviceFaqSchema).optional(),
    active: z.boolean().default(true),
    order: z.number().default(0),
  })
  .strict();

export const galleryAdminSchema = z
  .object({
    title: z.string().min(1).max(100),
    url: z.string().min(1),
    storagePath: z.string().optional(),
    category: z.enum(["clinic", "treatments", "events", "team"]).default("clinic"),
    caption: z.string().max(200).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    order: z.number().default(0),
  })
  .strict();

export const testimonialAdminSchema = z
  .object({
    patientName: z.string().min(2).max(60),
    rating: z.number().min(1).max(5),
    treatment: z.string().optional(),
    treatmentCategory: z.string().optional(),
    review: z.string().min(5).max(1000),
    text: z.string().optional(),
    date: z.string().optional(),
    verified: z.boolean().default(true),
    featured: z.boolean().default(false),
  })
  .strict();

export const faqAdminSchema = z
  .object({
    question: z.string().min(5).max(300),
    answer: z.string().min(5).max(2000),
    category: z.string().default("General"),
    order: z.number().default(0),
    active: z.boolean().default(true),
  })
  .strict();

export const reorderSchema = z
  .object({
    ids: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const clinicSettingsSchema = z
  .object({
    name: z.string().min(2).max(100),
    tagline: z.string().max(200).optional().default(""),
    phone: z.string().min(10).max(15),
    phoneDisplay: z.string().min(10).max(25),
    whatsapp: z.string().min(10).max(15),
    whatsappDisplay: z.string().min(10).max(25),
    email: z.string().email(),
    doctor: z.object({
      name: z.string().min(2),
      qualification: z.string().min(2),
      experience: z.string(),
      specialization: z.string(),
      registrationNumber: z.string(),
      bio: z.string(),
    }),
    address: z.object({
      street: z.string(),
      area: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      fullAddress: z.string(),
    }),
    timings: z.object({
      days: z.string(),
      morning: z.string(),
      evening: z.string(),
      sunday: z.string(),
      emergencyNote: z.string().optional().default(""),
    }),
    mapEmbedUrl: z.string().refine((url) => url.startsWith("https://www.google.com/maps/embed"), {
      message: "Map embed URL must start with https://www.google.com/maps/embed",
    }),
    socialLinks: z.object({
      facebook: z.string().url().refine((u) => u.startsWith("https://"), "Must be HTTPS").optional().or(z.literal("")),
      instagram: z.string().url().refine((u) => u.startsWith("https://"), "Must be HTTPS").optional().or(z.literal("")),
      youtube: z.string().url().refine((u) => u.startsWith("https://"), "Must be HTTPS").optional().or(z.literal("")),
      twitter: z.string().url().refine((u) => u.startsWith("https://"), "Must be HTTPS").optional().or(z.literal("")),
    }),
  })
  .strict();

export const userInviteSchema = z
  .object({
    email: z.string().email(),
    role: z.enum(["admin", "staff"]),
    name: z.string().optional(),
  })
  .strict();

export const userPatchSchema = z
  .object({
    role: z.enum(["admin", "staff"]).optional(),
    status: z.enum(["active", "disabled"]).optional(),
  })
  .strict();

export type AppointmentPatchInput = z.infer<typeof appointmentPatchSchema>;
export type AppointmentBulkInput = z.infer<typeof appointmentBulkSchema>;
export type MessagePatchInput = z.infer<typeof messagePatchSchema>;
export type ServiceAdminInput = z.infer<typeof serviceAdminSchema>;
export type GalleryAdminInput = z.infer<typeof galleryAdminSchema>;
export type TestimonialAdminInput = z.infer<typeof testimonialAdminSchema>;
export type FaqAdminInput = z.infer<typeof faqAdminSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
export type ClinicSettingsInput = z.infer<typeof clinicSettingsSchema>;
export type UserInviteInput = z.infer<typeof userInviteSchema>;
export type UserPatchInput = z.infer<typeof userPatchSchema>;
