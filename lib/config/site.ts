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

export interface SiteConfig {
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
  socialLinks: SocialLinks;
  mapEmbedUrl: string;
}

/**
 * Site configuration with placeholder details.
 * All public components initially read from this typed config.
 * In later stages, this can be synced/overridden with Firestore clinic settings.
 */
export const siteConfig: SiteConfig = {
  name: "Your Clinic Name",
  tagline: "Comprehensive, Compassionate Healthcare for Your Family",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  email: "contact@yourclinic.com",
  doctor: {
    name: "Dr. Clinic Doctor",
    qualification: "MBBS, MD (General Medicine)",
    experience: "12+ Years Experience",
    specialization: "General Physician & Consultant",
    registrationNumber: "MCI-123456",
    bio: "Dedicated healthcare professional providing patient-centric, evidence-based treatments and consultations.",
  },
  address: {
    street: "123 Health Avenue, Main Road",
    area: "Near Central Square",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    fullAddress: "123 Health Avenue, Near Central Square, Main Road, Mumbai, Maharashtra 400001",
  },
  timings: {
    days: "Monday - Saturday",
    morning: "10:00 AM - 01:30 PM",
    evening: "05:30 PM - 09:00 PM",
    sunday: "Morning only (10:00 AM - 01:00 PM)",
    emergencyNote: "Prior appointment recommended for consultations",
  },
  socialLinks: {
    facebook: "https://facebook.com/yourclinic",
    instagram: "https://instagram.com/yourclinic",
    youtube: "https://youtube.com/@yourclinic",
  },
  mapEmbedUrl: "https://maps.google.com/maps?q=Mumbai&t=&z=13&ie=UTF8&iwloc=&output=embed",
};
