import type { Service, GalleryImage, Testimonial, Faq } from "@/lib/types";

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  badge: string;
}

export interface ClinicStat {
  value: string;
  label: string;
  subtext: string;
}

export interface TrustBadge {
  title: string;
  description: string;
  iconName: string;
}

export const placeholderServices: Service<string>[] = [
  {
    id: "general-consultation",
    title: "General Medical Consultation",
    slug: "general-consultation",
    shortDescription: "In-depth clinical assessment for acute viral fever, seasonal illness, respiratory infections, and stomach ailments.",
    fullDescription: "Comprehensive outpatient clinical evaluation by Dr. Sharma. We provide evidence-based diagnosis, accurate physical examinations, and personalized treatment plans without over-prescription.",
    icon: "Stethoscope",
    symptoms: ["Viral fever & chills", "Persistent cough & cold", "Throat pain & tonsillitis", "Headache & body pain"],
    active: true,
    order: 1,
  },
  {
    id: "diabetes-hypertension",
    title: "Diabetes & BP Management",
    slug: "diabetes-hypertension",
    shortDescription: "Holistic chronic illness care with blood sugar profiling, BP stabilization, diet planning, and complication prevention.",
    fullDescription: "Proactive, protocol-driven treatment for type 2 diabetes, prediabetes, and hypertension. Focused on long-term cardiovascular and renal health through monitored lifestyle adjustments and tailored medication.",
    icon: "Activity",
    symptoms: ["Unexplained fatigue", "Frequent urination", "Fluctuating blood pressure", "Dizziness or breathlessness"],
    active: true,
    order: 2,
  },
  {
    id: "pediatric-care",
    title: "Pediatric & Child Health",
    slug: "pediatric-care",
    shortDescription: "Gentle child consultations, fever management, growth monitoring, dietary guidance, and vaccination counseling.",
    fullDescription: "Child-friendly medical consultations focused on developmental milestones, childhood infections, pediatric nutrition, and seasonal flu management in a calm, stress-free environment.",
    icon: "HeartPulse",
    symptoms: ["High fever in children", "Loss of appetite", "Wheezing or cold", "Stomach ache & indigestion"],
    active: true,
    order: 3,
  },
  {
    id: "preventive-health",
    title: "Preventive Health Checkup",
    slug: "preventive-health",
    shortDescription: "Early detection screening packages for adults and seniors to identify metabolic risks before symptoms emerge.",
    fullDescription: "Periodic health screenings including baseline vitals, BMI assessment, cardiac risk evaluation, lipid screening guidance, and customized preventive lifestyle roadmaps.",
    icon: "ShieldCheck",
    symptoms: ["Annual health check", "Executive stress", "Family history of heart disease", "Weight management"],
    active: true,
    order: 4,
  },
  {
    id: "minor-procedures",
    title: "Minor Surgical & Wound Care",
    slug: "minor-procedures",
    shortDescription: "Aseptic wound dressing, minor injury suturing, abscess drainage, ear wax clearance, and suture removal.",
    fullDescription: "Immediate minor procedural room care maintaining hospital-grade sterilization protocols. Fast pain relief and antiseptic care for cuts, lacerations, burns, and foreign body removal.",
    icon: "Bandage",
    symptoms: ["Minor cuts & lacerations", "Diabetic foot dressing", "Skin abscess or boils", "Ear blockage & pain"],
    active: true,
    order: 5,
  },
  {
    id: "diagnostic-ecg-pathology",
    title: "On-site ECG & Diagnostic Tests",
    slug: "diagnostic-ecg-pathology",
    shortDescription: "Quick resting 12-lead ECG recording, rapid blood sugar tests, urine routine, and tie-up lab sample collection.",
    fullDescription: "Immediate bedside diagnostic facilities to aid prompt clinical decisions. Accurate 12-lead ECG reporting within 10 minutes and seamless partner lab sample collection at clinic doorstep.",
    icon: "FileHeart",
    symptoms: ["Chest discomfort", "Palpitations", "Immediate blood sugar check", "Pre-op medical fitness"],
    active: true,
    order: 6,
  },
];

export const placeholderWhyChooseUs: WhyChooseUsItem[] = [
  {
    id: "doctor-experience",
    title: "Direct Doctor Attention",
    description: "Every patient is thoroughly evaluated by our senior physician without rushed 2-minute appointments.",
    iconName: "UserCheck",
    tag: "14+ Yrs Exp",
  },
  {
    id: "zero-queue",
    title: "Zero Waiting Callback Flow",
    description: "Submit your request online; our staff calls to coordinate your exact arrival slot to minimize waiting room delays.",
    iconName: "Clock",
    tag: "Time-Saving",
  },
  {
    id: "hygienic-facility",
    title: "100% Sanitized & Sterile Clinic",
    description: "Strict daily disinfection, disposable medical sheets, and hospital-grade sterilization for every instrument.",
    iconName: "Sparkles",
    tag: "High Hygiene",
  },
  {
    id: "ethical-practice",
    title: "Ethical & Rational Treatment",
    description: "No unnecessary blood tests or redundant medications. Only honest, science-backed medical recommendations.",
    iconName: "FileCheck",
    tag: "Evidence-Based",
  },
  {
    id: "whatsapp-support",
    title: "Follow-Up WhatsApp Support",
    description: "Clarify prescription doubts or report symptom updates directly with our clinic desk over WhatsApp.",
    iconName: "MessageCircle",
    tag: "Patient First",
  },
  {
    id: "transparent-charges",
    title: "Transparent & Affordable Care",
    description: "Clear consultation fees with zero hidden hospital charges, making high-quality healthcare accessible for all families.",
    iconName: "Coins",
    tag: "Honest Pricing",
  },
];

export const placeholderHowItWorks: HowItWorksStep[] = [
  {
    step: 1,
    title: "Send Your Request",
    description: "Choose your preferred date and time window (morning/evening) through our quick 1-minute form.",
    badge: "Takes 60 seconds",
  },
  {
    step: 2,
    title: "Front Desk Callback",
    description: "Our receptionist calls your number to confirm doctor availability and lock your consultation slot.",
    badge: "Within 15-30 mins",
  },
  {
    step: 3,
    title: "Visit Without Queue",
    description: "Arrive at your confirmed slot, undergo doctor consultation, and get your digital prescription.",
    badge: "Zero waiting room stress",
  },
];

export const placeholderTestimonials: Testimonial<string>[] = [
  {
    id: "test-1",
    patientName: "Sanjay Deshmukh",
    rating: 5,
    treatment: "Chronic Diabetes Care",
    review: "Dr. Sharma took the time to explain my HbA1c report in detail. Within 3 months of following his balanced regimen, my blood sugar levels are finally within safe limits.",
    verified: true,
    featured: true,
    createdAt: "2026-09-12",
  },
  {
    id: "test-2",
    patientName: "Meenakshi Iyer",
    rating: 5,
    treatment: "Viral Fever & Chest Infection",
    review: "The appointment request system is a lifesaver. Instead of sitting in a crowded clinic for hours with high fever, they called back and gave me an exact arrival time. Very professional.",
    verified: true,
    featured: true,
    createdAt: "2026-09-28",
  },
  {
    id: "test-3",
    patientName: "Vikram Malhotra",
    rating: 5,
    treatment: "Hypertension & Lifestyle Consultation",
    review: "Extremely ethical doctor. He did not order 10 different blood tests right away—started with simple dietary adjustments and monitored my BP weekly. Highly recommended.",
    verified: true,
    featured: true,
    createdAt: "2026-10-02",
  },
  {
    id: "test-4",
    patientName: "Anjali Pathak",
    rating: 5,
    treatment: "Pediatric Consultation",
    review: "Dr. Sharma was wonderful with my 4-year-old daughter. He made her smile before checking her chest and ears. Clean clinic, very polite reception staff.",
    verified: true,
    featured: true,
    createdAt: "2026-10-08",
  },
  {
    id: "test-5",
    patientName: "Ramesh Chawla",
    rating: 5,
    treatment: "Annual Preventive Checkup",
    review: "Comprehensive checkup with on-site ECG done in 10 minutes. The doctor provided very sensible preventive advice for my heart health.",
    verified: true,
    featured: false,
    createdAt: "2026-10-10",
  },
];

export const placeholderFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "How does the appointment request system work?",
    answer: "You simply submit your name, phone number, and preferred date/time window on our website. Our front desk reviews the clinic schedule and calls you within 30 minutes to confirm your exact consultation slot.",
    category: "Appointments",
    order: 1,
    active: true,
  },
  {
    id: "faq-2",
    question: "Can I walk in directly without an online booking?",
    answer: "Yes, walk-ins are always welcome. However, priority is given to pre-scheduled appointments to ensure patients do not experience prolonged waiting room congestion.",
    category: "Appointments",
    order: 2,
    active: true,
  },
  {
    id: "faq-3",
    question: "What are the clinic OPD consultation hours?",
    answer: "We are open Monday through Saturday from 10:00 AM to 1:30 PM (Morning session) and 5:30 PM to 9:00 PM (Evening session). On Sundays, we operate a morning session from 10:00 AM to 1:00 PM.",
    category: "Clinic Hours",
    order: 3,
    active: true,
  },
  {
    id: "faq-4",
    question: "Do you have on-site diagnostic testing available?",
    answer: "Yes, we provide immediate resting 12-lead ECG, blood glucose checks, and basic vitals monitoring in-clinic. For full blood panels and pathology tests, our partner labs collect samples directly.",
    category: "Services",
    order: 4,
    active: true,
  },
  {
    id: "faq-5",
    question: "What payment modes are accepted at the clinic?",
    answer: "We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and cash at our reception desk.",
    category: "Billing",
    order: 5,
    active: true,
  },
  {
    id: "faq-6",
    question: "How can I follow up or clarify my prescription?",
    answer: "Patients who have consulted within the last 7 days can message our official clinic WhatsApp number with their patient ID or prescription photo for quick routine queries.",
    category: "Follow-up",
    order: 6,
    active: true,
  },
];

export const placeholderGallery: GalleryImage<string>[] = [
  {
    id: "gal-1",
    title: "Reception & Waiting Area",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    category: "clinic",
    caption: "Spacious, air-conditioned patient reception with comfortable seating.",
    order: 1,
  },
  {
    id: "gal-2",
    title: "Doctor Consultation Chamber",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    category: "consultation",
    caption: "Private, sanitized chamber equipped for thorough clinical assessments.",
    order: 2,
  },
  {
    id: "gal-3",
    title: "Examination Bed & Diagnostic Station",
    url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
    category: "facility",
    caption: "Hygienic examination setup with disposable medical paper covers.",
    order: 3,
  },
  {
    id: "gal-4",
    title: "Sterilized Medical Equipment",
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    category: "equipment",
    caption: "Autoclaved surgical kits and calibrated blood pressure apparatus.",
    order: 4,
  },
  {
    id: "gal-5",
    title: "Vitals & Triage Station",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    category: "facility",
    caption: "Fast, gentle recording of temperature, pulse oximetry, and BP.",
    order: 5,
  },
  {
    id: "gal-6",
    title: "Pharmacy & Sample Collection Corner",
    url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
    category: "facility",
    caption: "Organized essential medicines and sterile diagnostic sample dispatch.",
    order: 6,
  },
];

export const placeholderStats: ClinicStat[] = [
  {
    value: "14+",
    label: "Years of Trust",
    subtext: "Continuous medical service in Mumbai",
  },
  {
    value: "18,000+",
    label: "Patients Consulted",
    subtext: "Families trusting our care",
  },
  {
    value: "4.9 ★",
    label: "Patient Rating",
    subtext: "Based on 380+ Google reviews",
  },
  {
    value: "98%",
    label: "On-Time Consultations",
    subtext: "Minimizing waiting room delays",
  },
];

export const placeholderTrustBadges: TrustBadge[] = [
  {
    title: "Certified MD Physician",
    description: "Evidence-based clinical consultation",
    iconName: "Award",
  },
  {
    title: "Hygienic & Sanitized",
    description: "Daily disinfection protocols",
    iconName: "ShieldCheck",
  },
  {
    title: "Zero Waiting Callback",
    description: "Prior scheduled slots save time",
    iconName: "Clock",
  },
  {
    title: "Affordable Care",
    description: "Honest charges & zero unnecessary tests",
    iconName: "HeartHandshake",
  },
];
