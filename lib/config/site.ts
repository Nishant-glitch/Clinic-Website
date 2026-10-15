export interface DoctorInfo {
  name: string;
  qualification: string;
  experience: string;
  specialization: string;
  registrationNumber: string;
  bio: string;
  photoUrl: string;
  opdHours: string;
  consultationFeeNotice: string;
}

export interface ClinicAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  landmark: string;
}

export interface ClinicTimings {
  days: string;
  morning: string;
  evening: string;
  sunday: string;
  emergencyNote: string;
  isOpenToday: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappMessage: string;
  email: string;
  doctor: DoctorInfo;
  address: ClinicAddress;
  timings: ClinicTimings;
  socialLinks: SocialLinks;
  mapEmbedUrl: string;
  rating: {
    score: number;
    count: number;
    platform: string;
  };
}

/**
 * Site configuration with placeholder details.
 * All public components initially read from this typed config.
 * In later stages, this can be synced/overridden with Firestore clinic settings.
 */
export const siteConfig: SiteConfig = {
  name: "Dr. Sharma's Family Care Clinic",
  shortName: "Family Care Clinic",
  tagline: "Comprehensive, Compassionate Healthcare for Your Family",
  description:
    "Evidence-based, personalized outpatient medical care by Dr. Rajiv Sharma in Andheri West, Mumbai.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  whatsappMessage: "Hello, I would like to inquire about booking an appointment at the clinic.",
  email: "care@sharmaclinic.in",
  doctor: {
    name: "Dr. Rajesh Sharma",
    qualification: "MBBS, MD (General Medicine)",
    experience: "14+ Years Clinical Experience",
    specialization: "Senior Physician & Consultant",
    registrationNumber: "MCI-48291",
    bio: "Dr. Sharma has over 14 years of clinical experience specializing in internal medicine, hypertension, diabetes control, and preventive family healthcare.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    opdHours: "Mon - Sat: 10:00 AM - 1:30 PM & 5:30 PM - 9:00 PM",
    consultationFeeNotice: "Transparent consultation fee payable at clinic desk",
  },
  address: {
    street: "Shop 12-14, Ground Floor, Royal Arcade",
    area: "Opposite Grand Mall, Link Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    fullAddress: "Shop 12-14, Royal Arcade, Opposite Grand Mall, Link Road, Andheri West, Mumbai, Maharashtra 400053",
    landmark: "Opposite Grand Mall & 2 mins from Metro Station",
  },
  timings: {
    days: "Monday - Saturday",
    morning: "10:00 AM - 01:30 PM",
    evening: "05:30 PM - 09:00 PM",
    sunday: "Morning only (10:00 AM - 01:00 PM)",
    emergencyNote: "Prior appointment request recommended to ensure zero wait time",
    isOpenToday: "Open Today: 10:00 AM - 9:00 PM",
  },
  socialLinks: {
    facebook: "https://facebook.com/sharmaclinic",
    instagram: "https://instagram.com/sharmaclinic",
    youtube: "https://youtube.com/@sharmaclinic",
  },
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.8375826920173!2d72.833!3d19.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzIyLjgiTiA3MsKwNDknNTguOCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  rating: {
    score: 4.9,
    count: 380,
    platform: "Google Reviews",
  },
};
