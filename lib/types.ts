import type { Timestamp } from "firebase-admin/firestore";

export type TimestampField = Timestamp | string;

export type AppointmentStatus = "new" | "called" | "confirmed" | "visited" | "cancelled";

export type PreferredTime = "morning" | "evening" | "any";

export type Role = "admin" | "staff";

export interface Appointment<TDate = TimestampField> {
  id: string;
  name: string;
  phone: string;
  preferredDate?: string; // YYYY-MM-DD
  preferredTime: PreferredTime;
  service?: string;
  message?: string;
  consent: boolean;
  status: AppointmentStatus;
  notes?: string;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface ContactMessage<TDate = TimestampField> {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  consent: boolean;
  read?: boolean;
  archived?: boolean;
  createdAt: TDate;
}

export interface ServiceTreatmentStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service<TDate = TimestampField> {
  id: string;
  title: string;
  slug: string;
  category?: string;
  image?: string;
  shortDescription: string;
  fullDescription: string;
  content?: string;
  icon?: string;
  symptoms?: string[];
  treatmentProcess?: ServiceTreatmentStep[];
  benefits?: string[];
  duration?: string;
  whatToExpect?: string;
  faqs?: ServiceFaq[];
  active: boolean;
  order: number;
  createdAt?: TDate;
  updatedAt?: TDate;
}

export type GalleryCategory = "clinic" | "treatments" | "events" | "team";

export interface GalleryImage<TDate = TimestampField> {
  id: string;
  title: string;
  url: string;
  category: GalleryCategory;
  caption?: string;
  order: number;
  createdAt?: TDate;
}

export interface Testimonial<TDate = TimestampField> {
  id: string;
  patientName: string;
  rating: number; // 1-5
  treatment?: string;
  treatmentCategory?: string;
  review: string;
  text?: string;
  date?: string;
  verified: boolean;
  featured: boolean;
  createdAt?: TDate;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

export interface DoctorInfo {
  name: string;
  qualification: string;
  experience: string;
  specialization: string;
  registrationNumber: string;
  bio: string;
}

export interface ClinicAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

export interface ClinicTimings {
  days: string;
  morning: string;
  evening: string;
  sunday: string;
  emergencyNote: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface ClinicSettings<TDate = TimestampField> {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  doctor: DoctorInfo;
  address: ClinicAddress;
  timings: ClinicTimings;
  mapEmbedUrl: string;
  socialLinks: SocialLinks;
  updatedAt?: TDate;
}

export interface AppUser<TDate = TimestampField> {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: TDate;
  lastLoginAt?: TDate;
}

// Convenient Server/Client type aliases
export type ServerAppointment = Appointment<Timestamp>;
export type ClientAppointment = Appointment<string>;

export type ServerContactMessage = ContactMessage<Timestamp>;
export type ClientContactMessage = ContactMessage<string>;

export type ServerService = Service<Timestamp>;
export type ClientService = Service<string>;

export type ServerClinicSettings = ClinicSettings<Timestamp>;
export type ClientClinicSettings = ClinicSettings<string>;

export type ServerAppUser = AppUser<Timestamp>;
export type ClientAppUser = AppUser<string>;
