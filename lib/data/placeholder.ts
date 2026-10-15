import type {
  Service,
  GalleryImage,
  Testimonial,
  Faq,
} from "@/lib/types";

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

export interface ClinicStory {
  title: string;
  subtitle: string;
  paragraphs: string[];
  image: string;
  highlights: string[];
}

export interface ClinicMissionVision {
  mission: {
    title: string;
    description: string;
    points: string[];
  };
  vision: {
    title: string;
    description: string;
    points: string[];
  };
}

export interface DoctorFullProfile {
  name: string;
  role: string;
  qualifications: string[];
  experienceYears: number;
  registrationNumber: string;
  specializations: string[];
  image: string;
  bio: string[];
  opdSchedule: { day: string; hours: string }[];
}

export interface ClinicValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ClinicFacility {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const placeholderServices: Service<string>[] = [
  {
    id: "general-consultation",
    title: "General Medical Consultation",
    slug: "general-consultation",
    category: "General OPD",
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "In-depth clinical assessment for acute viral fever, seasonal illness, respiratory infections, and stomach ailments.",
    fullDescription: "Comprehensive outpatient clinical evaluation by Dr. Sharma. We provide evidence-based diagnosis, accurate physical examinations, and personalized treatment plans without over-prescription.",
    content: "Our General OPD consultation serves as the first line of medical defense for you and your family. We take time to listen, review previous medical histories, and perform methodical physical examinations to address the root cause of symptoms rather than simply suppressing them.",
    icon: "Stethoscope",
    symptoms: [
      "Viral fever & chills",
      "Persistent cough & cold",
      "Throat pain & tonsillitis",
      "Headache, dizziness & body pain",
      "Digestive issues & nausea",
    ],
    treatmentProcess: [
      {
        step: 1,
        title: "Clinical History & Vitals",
        description: "Review of onset timeline, previous drug allergies, baseline temperature, blood pressure, and pulse oximetry.",
      },
      {
        step: 2,
        title: "Physical Examination",
        description: "Chest auscultation, throat inspection, abdominal palpation, and targeted clinical assessments.",
      },
      {
        step: 3,
        title: "Rational Treatment Plan",
        description: "Clear prescription with plain-language dosage instructions, dietary cautions, and red-flag symptom warnings.",
      },
      {
        step: 4,
        title: "Follow-Up Coordination",
        description: "Scheduled reassessment within 3 to 5 days, with easy WhatsApp updates for routine symptom monitoring.",
      },
    ],
    benefits: [
      "Attentive 15-20 minute consultations without rushed diagnoses",
      "Strict avoidance of unnecessary antibiotic over-prescription",
      "Clear explanation of disease mechanisms and home recovery tips",
      "Direct follow-up access for urgent symptom queries",
    ],
    duration: "20-25 Minutes",
    whatToExpect: "Please bring along any current medication strips or recent lab reports. If fever is present, note highest recorded temperatures.",
    faqs: [
      {
        question: "Can I walk in without an appointment for sudden fever?",
        answer: "Yes, acute emergency walk-ins are accommodated. However, booking a callback online guarantees priority queue entry.",
      },
      {
        question: "Are pediatric patients treated under general consultation?",
        answer: "Yes, children aged 2 years and above are treated for fevers, respiratory infections, and common gastrointestinal ailments.",
      },
      {
        question: "Does the consultation fee cover follow-up reviews?",
        answer: "Routine follow-up reviews within 5 days for the same acute complaint are provided at zero or nominal consultation charges.",
      },
    ],
    active: true,
    order: 1,
  },
  {
    id: "diabetes-hypertension",
    title: "Diabetes & BP Management",
    slug: "diabetes-hypertension",
    category: "Chronic Disease",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Holistic chronic illness care with blood sugar profiling, BP stabilization, diet planning, and complication prevention.",
    fullDescription: "Proactive, protocol-driven treatment for type 2 diabetes, prediabetes, and hypertension. Focused on long-term cardiovascular and renal health through monitored lifestyle adjustments and tailored medication.",
    content: "Managing chronic lifestyle conditions requires long-term partnership rather than occasional pill adjustments. We emphasize organ protection—preserving kidney, eye, nerve, and cardiovascular health through periodic HbA1c tracking and progressive lifestyle refinement.",
    icon: "Activity",
    symptoms: [
      "Unexplained fatigue & weakness",
      "Frequent nighttime urination & excessive thirst",
      "Fluctuating blood pressure readings",
      "Tingling numbness in feet or hands",
      "Occasional morning headaches or palpitations",
    ],
    treatmentProcess: [
      {
        step: 1,
        title: "Metabolic Profiling",
        description: "Assessment of HbA1c, fasting glucose, lipid profile, and renal function markers.",
      },
      {
        step: 2,
        title: "Cardiovascular Screen",
        description: "Resting BP measurement in both arms, pulse variability, and resting ECG check when indicated.",
      },
      {
        step: 3,
        title: "Regimen Personalization",
        description: "Selecting optimal medication molecules with minimal hypoglycemia risk and maximum organ protection.",
      },
      {
        step: 4,
        title: "Nutrition & Exercise Roadmap",
        description: "Practical Indian dietary adaptations and realistic daily physical activity targets.",
      },
    ],
    benefits: [
      "Targeted HbA1c stabilization without extreme hypoglycemia episodes",
      "Protection of vital organs (kidneys, retina, heart arteries)",
      "Digital logging of home BP and glucose charts",
      "Practical meal planning tailored to traditional family cuisine",
    ],
    duration: "30 Minutes",
    whatToExpect: "Bring your home glucose monitoring log (if maintained) and your last 6 months of lab reports.",
    faqs: [
      {
        question: "How frequently do I need checkups once blood sugar stabilizes?",
        answer: "Stable patients typically review every 3 months for HbA1c checks, with home blood glucose logged weekly.",
      },
      {
        question: "Can type 2 diabetes be reversed?",
        answer: "In early stages (within 3-5 years of diagnosis), significant remission is achievable through targeted weight reduction and nutrition changes.",
      },
      {
        question: "Do you recommend immediate insulin therapy?",
        answer: "Oral medications and lifestyle changes are prioritized first; insulin is suggested only when clinically imperative for pancreatic rest.",
      },
    ],
    active: true,
    order: 2,
  },
  {
    id: "pediatric-care",
    title: "Pediatric & Child Health",
    slug: "pediatric-care",
    category: "Pediatrics",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Gentle child consultations, fever management, growth monitoring, dietary guidance, and vaccination counseling.",
    fullDescription: "Child-friendly medical consultations focused on developmental milestones, childhood infections, pediatric nutrition, and seasonal flu management in a calm, stress-free environment.",
    content: "We understand that children require patience, warmth, and a comforting environment. Dr. Sharma approaches young patients with gentle reassurance, engaging them before examination to ensure accurate assessments without medical anxiety.",
    icon: "HeartPulse",
    symptoms: [
      "Recurrent fevers, ear infections, or throat pain",
      "Poor appetite, fussy eating, or sluggish weight gain",
      "Nocturnal cough, wheezing, or allergic bronchitis",
      "Frequent loose stools or constipation",
      "Skin rashes, eczema, and allergy flares",
    ],
    treatmentProcess: [
      {
        step: 1,
        title: "Friendly Ice-Breaking",
        description: "Allowing the child to settle in the exam room, observe toys, and feel secure before touching instruments.",
      },
      {
        step: 2,
        title: "Growth & Vitals Check",
        description: "Weight, height, chest clear-breath assessment, and gentle ENT otoscopic inspection.",
      },
      {
        step: 3,
        title: "Child-Safe Therapy",
        description: "Weight-adjusted liquid suspensions with clear dosing syringes and taste guidance for parents.",
      },
      {
        step: 4,
        title: "Parental Guidance",
        description: "Clear instructions on hydration, tepid sponging thresholds, and when to seek emergency care.",
      },
    ],
    benefits: [
      "Stress-free consultations minimizing white-coat anxiety in children",
      "Precise weight-based medication dosages",
      "Comprehensive developmental milestone checks",
      "Practical nutritional counsel for picky toddlers and growing kids",
    ],
    duration: "25 Minutes",
    whatToExpect: "Bring your child's immunization card and growth tracker booklet if available.",
    faqs: [
      {
        question: "At what temperature should I give fever medicine to my child?",
        answer: "Generally above 100.5°F if the child is uncomfortable. We provide exact weight-based Paracetamol doses during consultation.",
      },
      {
        question: "Do you provide vaccination counseling?",
        answer: "Yes, we review the IAP (Indian Academy of Pediatrics) national immunization schedule and recommend required boosters.",
      },
      {
        question: "What if my child vomits medication immediately?",
        answer: "If vomiting occurs within 15 minutes of an oral suspension, our team provides instant dosage adjustment instructions via phone.",
      },
    ],
    active: true,
    order: 3,
  },
  {
    id: "preventive-health",
    title: "Preventive Health Checkup",
    slug: "preventive-health",
    category: "Preventive",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Early detection screening packages for adults and seniors to identify metabolic risks before symptoms emerge.",
    fullDescription: "Periodic health screenings including baseline vitals, BMI assessment, cardiac risk evaluation, lipid screening guidance, and customized preventive lifestyle roadmaps.",
    content: "The best medical care stops disease before symptoms ever begin. Our preventive health evaluations are designed for working professionals, homemakers, and senior citizens seeking an honest, comprehensive health baseline without bloated corporate hospital packages.",
    icon: "ShieldCheck",
    symptoms: [
      "Annual routine fitness checkup",
      "Sedentary desk lifestyle with high work stress",
      "Family history of heart attacks, stroke, or diabetes",
      "Unexplained low stamina or brain fog",
      "Pre-employment or insurance fitness evaluation",
    ],
    treatmentProcess: [
      {
        step: 1,
        title: "Pre-Screen Consultation",
        description: "Family risk profiling, dietary recall, physical activity logs, and targeted organ system review.",
      },
      {
        step: 2,
        title: "Comprehensive Physical Vitals",
        description: "Resting BP, resting ECG, BMI, abdominal girth, and peripheral vascular checks.",
      },
      {
        step: 3,
        title: "Tailored Lab Testing",
        description: "Rationalized fasting blood panel (HbA1c, Lipids, CBC, Liver & Kidney profile) without redundant add-ons.",
      },
      {
        step: 4,
        title: "1-on-1 Results Review",
        description: "Doctor discusses each parameter in simple language and formulates a 12-month wellness plan.",
      },
    ],
    benefits: [
      "Identification of silent cardiovascular & metabolic risks years in advance",
      "Zero inflated or useless diagnostic tests",
      "Clear, actionable lifestyle benchmarks for diet and exercise",
      "Digital archival of reports for future comparative tracking",
    ],
    duration: "40 Minutes",
    whatToExpect: "Come on a 10-12 hour overnight fast if you wish to complete blood sample collection during the morning slot.",
    faqs: [
      {
        question: "How frequently should a healthy adult get screened?",
        answer: "Once every 2 years for adults under 35; annually for individuals aged 35 and above.",
      },
      {
        question: "Are blood tests done inside the clinic?",
        answer: "We collect samples in our clean triage room and dispatch them to NABL-accredited diagnostic partner laboratories.",
      },
      {
        question: "How soon do I receive my test reports?",
        answer: "Standard blood panels are ready within 12 to 24 hours, followed by a detailed physician review session.",
      },
    ],
    active: true,
    order: 4,
  },
  {
    id: "minor-procedures",
    title: "Minor Surgical & Wound Care",
    slug: "minor-procedures",
    category: "Procedures",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Aseptic wound dressing, minor injury suturing, abscess drainage, ear wax clearance, and suture removal.",
    fullDescription: "Immediate minor procedural room care maintaining hospital-grade sterilization protocols. Fast pain relief and antiseptic care for cuts, lacerations, burns, and foreign body removal.",
    content: "Minor injuries, cuts, burns, or infected cysts require immediate, sterile intervention to prevent secondary infections and severe scarring. Our procedure room is equipped with autoclaved stainless instruments, local anesthetics, and advanced dressing materials.",
    icon: "Bandage",
    symptoms: [
      "Sharp cuts, glass lacerations, or kitchen injuries",
      "Painful boils, sebaceous cysts, or localized abscesses",
      "Thermal kitchen burns or abrasive road rash",
      "Hardened ear wax buildup causing reduced hearing",
      "Post-surgery suture removal or diabetic ulcer dressing",
    ],
    treatmentProcess: [
      {
        step: 1,
        title: "Antiseptic Assessment",
        description: "Irrigation with sterile saline to inspect wound depth, foreign particles, and tendon involvement.",
      },
      {
        step: 2,
        title: "Pain-Free Anesthesia",
        description: "Local infiltration anesthesia to ensure the procedure is performed completely without pain.",
      },
      {
        step: 3,
        title: "Precision Intervention",
        description: "Fine cosmetic suturing, aseptic abscess incision/drainage, or gentle ear syringe irrigation.",
      },
      {
        step: 4,
        title: "Antiseptic Dressing & Tetanus",
        description: "Non-stick medicated dressing, Tetanus toxoid booster check, and oral antibiotic coverage if indicated.",
      },
    ],
    benefits: [
      "Avoids tedious emergency room waiting queues at large hospitals",
      "Strict hospital-grade autoclaved instruments for zero cross-infection",
      "Cosmetically conscious closure minimizing scar formation",
      "Comprehensive instructions for keeping dressings clean and dry",
    ],
    duration: "25-35 Minutes",
    whatToExpect: "Inform the doctor if you are taking blood-thinning medications (Aspirin, Clopidogrel) or have local anesthetic allergies.",
    faqs: [
      {
        question: "Do you provide Tetanus Toxoid (TT) injections?",
        answer: "Yes, TT boosters are kept in temperature-controlled refrigerators and administered immediately for cut injuries.",
      },
      {
        question: "When should sutures be removed after a cut?",
        answer: "Facial sutures in 5-7 days; limb and scalp sutures in 8-10 days depending on tissue healing.",
      },
      {
        question: "Is ear wax removal painful?",
        answer: "Not at all. We use warm sterile saline irrigation or gentle cerumen loops after softening drops.",
      },
    ],
    active: true,
    order: 5,
  },
  {
    id: "diagnostic-ecg-pathology",
    title: "On-site ECG & Diagnostic Tests",
    slug: "diagnostic-ecg-pathology",
    category: "Diagnostics",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Quick resting 12-lead ECG recording, rapid blood sugar tests, urine routine, and tie-up lab sample collection.",
    fullDescription: "Immediate bedside diagnostic facilities to aid prompt clinical decisions. Accurate 12-lead ECG reporting within 10 minutes and seamless partner lab sample collection at clinic doorstep.",
    content: "When diagnostic answers are needed right away—such as during chest discomfort, acute abdominal pain, or diabetic crises—our clinic provides immediate point-of-care testing to guide critical medical decisions without delay.",
    icon: "FileHeart",
    symptoms: [
      "Sudden chest heaviness, tightness, or radiating arm pain",
      "Rapid, irregular heartbeats or sudden palpitations",
      "Acute dizziness, lightheadedness, or blackouts",
      "Immediate blood glucose check for suspected hypoglycemia",
      "Urinary burning or suspected kidney stone colic",
    ],
    treatmentProcess: [
      {
        step: 1,
        title: "Immediate Patient Triage",
        description: "Priority recording of vital signs, oxygen saturation, and resting pulse rhythm.",
      },
      {
        step: 2,
        title: "12-Lead ECG Acquisition",
        description: "Placement of precordial and limb leads using conductive gel for artifact-free trace recordings.",
      },
      {
        step: 3,
        title: "Doctor Interpretation",
        description: "Immediate physical review of ST-T wave morphology, PR interval, and rhythm abnormalities.",
      },
      {
        step: 4,
        title: "Action & Referral Support",
        description: "Prescription of emergency stabilization medicine or swift referral coordination with nearby cardiology units if required.",
      },
    ],
    benefits: [
      "Accurate 12-lead digital ECG trace generated in under 5 minutes",
      "Immediate interpretation by qualified physician",
      "Rapid point-of-care capillary blood glucose verification",
      "Convenient tie-up with NABL labs for blood and urine pathology",
    ],
    duration: "15-20 Minutes",
    whatToExpect: "Wear loose, comfortable clothing for easy chest lead placement. Remain relaxed and quiet during tracing.",
    faqs: [
      {
        question: "What should I do if I have active chest pain?",
        answer: "Notify our staff immediately upon arrival for zero-wait ECG triage, or dial emergency services if pain is crushing.",
      },
      {
        question: "Do I get a printed ECG copy to take home?",
        answer: "Yes, you receive both a printed thermal ECG strip and a high-resolution digital PDF for your permanent records.",
      },
      {
        question: "Can I get routine blood tests done at the same visit?",
        answer: "Yes, blood samples can be collected right after your consultation for all standard pathology investigations.",
      },
    ],
    active: true,
    order: 6,
  },
];

export const placeholderGallery: GalleryImage<string>[] = [
  {
    id: "gal-1",
    title: "Dr. Sharma's Consultation Room",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    category: "clinic",
    caption: "Quiet, private consultation chamber designed for focused, unhurried patient listening.",
    order: 1,
  },
  {
    id: "gal-2",
    title: "Sterile Minor Procedure Suite",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    category: "treatments",
    caption: "Equipped with autoclaved surgical packs, modern LED surgical illumination, and antiseptic dressing trays.",
    order: 2,
  },
  {
    id: "gal-3",
    title: "Welcoming Reception & Information Desk",
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    category: "clinic",
    caption: "Digital check-in desk providing friendly callback verification and minimal waiting coordination.",
    order: 3,
  },
  {
    id: "gal-4",
    title: "Clean Air Patient Waiting Lounge",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    category: "clinic",
    caption: "Spaced seating with HEPA air filtration and quiet ambient acoustics.",
    order: 4,
  },
  {
    id: "gal-5",
    title: "Digital Vitals & Diagnostic Station",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    category: "treatments",
    caption: "Precision calibrated digital BP monitors, 12-lead ECG machine, and pulse oximeters.",
    order: 5,
  },
  {
    id: "gal-6",
    title: "Pharmacy & Sample Dispatch Corner",
    url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
    category: "clinic",
    caption: "Cold-chain medicine storage and NABL laboratory sample dispatch protocols.",
    order: 6,
  },
  {
    id: "gal-7",
    title: "Community Health & Diabetes Camp",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    category: "events",
    caption: "Annual free blood glucose and hypertension screening camp conducted for Andheri West residents.",
    order: 7,
  },
  {
    id: "gal-8",
    title: "Clinical Staff Training Session",
    url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80",
    category: "team",
    caption: "Continuous nursing and front-desk training on infection control and patient empathy.",
    order: 8,
  },
  {
    id: "gal-9",
    title: "Elderly Care Consultation Session",
    url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    category: "treatments",
    caption: "Dedicated geriatric care assessments focusing on mobility, polypharmacy, and fall prevention.",
    order: 9,
  },
  {
    id: "gal-10",
    title: "Senior Nursing Care Team",
    url: "https://images.unsplash.com/photo-1594824813583-09efeb77ad66?auto=format&fit=crop&w=1200&q=80",
    category: "team",
    caption: "Our certified clinical assistants dedicated to comfortable patient visits.",
    order: 10,
  },
  {
    id: "gal-11",
    title: "World Health Day Preventive Seminar",
    url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
    category: "events",
    caption: "Dr. Sharma addressing local community members on cardiovascular prevention and stress management.",
    order: 11,
  },
  {
    id: "gal-12",
    title: "Aseptic Instrument Sterilization Unit",
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    category: "clinic",
    caption: "Multi-stage autoclave cycle ensuring 100% bacterial and viral spore eradication.",
    order: 12,
  },
];

export const placeholderClinicStory: ClinicStory = {
  title: "Founded on Ethical Medicine & Compassionate Care",
  subtitle: "Serving Mumbai families since 2011 with clinical integrity, transparent fees, and personal patient attention.",
  paragraphs: [
    "Dr. Sharma's Family Care Clinic was founded in 2011 with a simple, resolute mission: to provide families in Andheri West with the kind of attentive, evidence-based medical care that feels increasingly rare in large corporate hospitals.",
    "After over a decade of clinical experience in prominent government and tertiary private hospitals, Dr. Rajiv Sharma recognized that outpatient consultations were becoming dangerously hurried. Patients left with multiple prescriptions and heavy diagnostic bills, yet rarely understood what was causing their distress.",
    "Our clinic was established to restore the sacred doctor-patient relationship. Here, every consultation begins with attentive listening. We believe in prescribing only what is medically necessary, explaining every condition in plain language, and maintaining an environment so clean and respectful that you feel at ease the moment you step through our doors.",
  ],
  image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
  highlights: [
    "Over 14 consecutive years serving the local community",
    "Zero commercial tie-ups with pharma commissions",
    "Evidence-based guidelines following ICMR & WHO protocols",
    "Direct doctor phone callback for acute prescription questions",
  ],
};

export const placeholderMissionVision: ClinicMissionVision = {
  mission: {
    title: "Our Mission",
    description: "To deliver accessible, high-standard outpatient medical care with empathy, clarity, and rational prescriptions for every family.",
    points: [
      "Prioritizing patient health over commercial diagnostic incentives",
      "Ensuring patients fully comprehend their diagnosis and therapy",
      "Treating patients with the warmth, dignity, and respect we would expect for our own families",
    ],
  },
  vision: {
    title: "Our Vision",
    description: "To be the most trusted, dependable primary healthcare sanctuary in Mumbai, recognized for clinical excellence and transparent ethics.",
    points: [
      "Pioneering digital-first appointment workflows that eliminate waiting room fatigue",
      "Promoting preventative wellness to reduce preventable chronic hospitalizations",
      "Setting the benchmark for clinic hygiene and environmental sterilization",
    ],
  },
};

export const placeholderDoctorProfile: DoctorFullProfile = {
  name: "Dr. Rajiv Sharma",
  role: "Chief Medical Consultant & Family Physician",
  qualifications: [
    "MBBS — Grant Government Medical College & Sir J.J. Group of Hospitals, Mumbai (2007)",
    "MD (Internal Medicine) — Topiwala National Medical College & BYL Nair Hospital (2011)",
    "Post-Graduate Diploma in Clinical Cardiology (PGDCC)",
    "Fellow of the Indian Academy of Clinical Medicine (FIACM)",
  ],
  experienceYears: 15,
  registrationNumber: "MCI-2009-48291 (Maharashtra Medical Council)",
  specializations: [
    "General Internal Medicine",
    "Type 2 Diabetes & Metabolic Disorders",
    "Hypertension & Preventive Cardiology",
    "Pediatric Infectious Diseases",
    "Geriatric Healthcare & Polypharmacy",
  ],
  image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
  bio: [
    "Dr. Rajiv Sharma is a respected family physician with over 15 years of dedicated clinical practice. His medical approach is anchored in thorough physical examinations, rational pharmacology, and clear patient communication.",
    "Prior to establishing his family clinic in Andheri West, Dr. Sharma served as Senior Medical Officer in leading Mumbai municipal hospitals, handling diverse acute and critical medical cases. He is actively involved in community health education and regular clinical updates.",
    "Outside the clinic, Dr. Sharma is a passionate advocate for community physical fitness, conducting periodic free wellness camps for senior citizens and young professionals.",
  ],
  opdSchedule: [
    { day: "Monday – Friday", hours: "9:00 AM – 1:00 PM & 5:00 PM – 8:30 PM" },
    { day: "Saturday", hours: "9:00 AM – 1:00 PM & 5:00 PM – 8:00 PM" },
    { day: "Sunday", hours: "10:00 AM – 1:00 PM (Emergency & Prior Booking Only)" },
  ],
};

export const placeholderValues: ClinicValue[] = [
  {
    id: "val-1",
    title: "Patient-First Integrity",
    description: "Every decision, test, and prescription is evaluated solely by one question: 'Is this genuinely necessary for the patient's recovery?'",
    iconName: "ShieldCheck",
  },
  {
    id: "val-2",
    title: "Empathy & Active Listening",
    description: "We never interrupt. Understanding your concerns, lifestyle stress, and history is the cornerstone of accurate diagnosis.",
    iconName: "HeartHandshake",
  },
  {
    id: "val-3",
    title: "Rational Medicine",
    description: "We strictly oppose antibiotic overuse and unscientific pill cocktails. Clean, targeted treatment brings faster, safer healing.",
    iconName: "FileCheck",
  },
  {
    id: "val-4",
    title: "Absolute Hygiene",
    description: "Hospital-grade autoclaving, single-use examination paper rolls, and medical air filters safeguard your safety.",
    iconName: "Sparkles",
  },
];

export const placeholderFacilities: ClinicFacility[] = [
  {
    id: "fac-1",
    title: "Private Consultation Suites",
    description: "Acoustically insulated consultation rooms ensuring complete patient privacy and confidentiality.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fac-2",
    title: "Sterile Minor OT & Dressing Room",
    description: "Autoclaved surgical kits, non-stick dressings, and local anesthesia facilities for cut injuries and sutures.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fac-3",
    title: "Point-of-Care Diagnostics",
    description: "12-lead digital ECG, instant blood glucose monitors, pulse oximetry, and temperature profiling.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fac-4",
    title: "HEPA Air Filtered Waiting Lounge",
    description: "Clean, calming waiting area with socially distanced seating, clean drinking water, and sanitizing points.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
  },
];

export const placeholderWhyChooseUs: WhyChooseUsItem[] = [
  {
    id: "doctor-experience",
    title: "Direct Doctor Attention",
    description: "Every patient is thoroughly evaluated by our senior physician without rushed 2-minute appointments.",
    iconName: "UserCheck",
    tag: "15+ Yrs Exp",
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
    badge: "Prompt care",
  },
];

export const placeholderTestimonials: Testimonial<string>[] = [
  {
    id: "test-1",
    patientName: "Sunita Deshmukh",
    rating: 5,
    treatment: "General OPD & Senior Health",
    treatmentCategory: "General OPD & Senior Health",
    review: "Dr. Rajiv Sharma is an exceptional doctor. When my mother had prolonged weakness, instead of ordering expensive scans, he accurately diagnosed vitamin deficiency and stabilized her diet. Within 3 weeks she felt energetic again. His humility and patience are remarkable.",
    text: "Dr. Rajiv Sharma is an exceptional doctor. When my mother had prolonged weakness, instead of ordering expensive scans, he accurately diagnosed vitamin deficiency and stabilized her diet. Within 3 weeks she felt energetic again. His humility and patience are remarkable.",
    date: "2026-03-12",
    verified: true,
    featured: true,
  },
  {
    id: "test-2",
    patientName: "Amitabh Verma",
    rating: 5,
    treatment: "Hypertension Management",
    treatmentCategory: "Hypertension Management",
    review: "I was diagnosed with high blood pressure 2 years ago and felt anxious. Dr. Sharma took 30 minutes to explain the physiology, adjusted my lifestyle, and gave very mild medicine. My readings are now consistently 120/80. The clinic is spotless and calm.",
    text: "I was diagnosed with high blood pressure 2 years ago and felt anxious. Dr. Sharma took 30 minutes to explain the physiology, adjusted my lifestyle, and gave very mild medicine. My readings are now consistently 120/80. The clinic is spotless and calm.",
    date: "2026-02-28",
    verified: true,
    featured: true,
  },
  {
    id: "test-3",
    patientName: "Pooja & Rohan Kulkarni",
    rating: 5,
    treatment: "Pediatric Consultation",
    treatmentCategory: "Pediatric Consultation",
    review: "Our 4-year-old son caught a high seasonal fever. Dr. Sharma examined him so gently that our son was smiling instead of crying. He gave precise syrup dosages and checked on his recovery over WhatsApp. Truly a family doctor you can count on.",
    text: "Our 4-year-old son caught a high seasonal fever. Dr. Sharma examined him so gently that our son was smiling instead of crying. He gave precise syrup dosages and checked on his recovery over WhatsApp. Truly a family doctor you can count on.",
    date: "2026-02-15",
    verified: true,
    featured: true,
  },
  {
    id: "test-4",
    patientName: "Kavita Nair",
    rating: 5,
    treatment: "Minor Wound Suturing",
    treatmentCategory: "Minor Wound Suturing",
    review: "Had a nasty kitchen knife cut late in the evening. Reached the clinic and Dr. Sharma dressed and sutured it immediately with local anesthesia. No pain at all, healed cleanly without a prominent scar. Thank you for the quick emergency help!",
    text: "Had a nasty kitchen knife cut late in the evening. Reached the clinic and Dr. Sharma dressed and sutured it immediately with local anesthesia. No pain at all, healed cleanly without a prominent scar. Thank you for the quick emergency help!",
    date: "2026-01-20",
    verified: true,
    featured: true,
  },
  {
    id: "test-5",
    patientName: "Vikram Singhania",
    rating: 5,
    treatment: "Preventive Health Checkup",
    treatmentCategory: "Preventive Health Checkup",
    review: "Finding an honest doctor in Mumbai who doesn't prescribe unnecessary medicine is a blessing. Dr. Sharma's consultations are thorough, thoughtful, and transparent. The online callback appointment saved me 45 minutes of waiting.",
    text: "Finding an honest doctor in Mumbai who doesn't prescribe unnecessary medicine is a blessing. Dr. Sharma's consultations are thorough, thoughtful, and transparent. The online callback appointment saved me 45 minutes of waiting.",
    date: "2026-01-08",
    verified: true,
    featured: true,
  },
  {
    id: "test-6",
    patientName: "Meenakshi Iyer",
    rating: 5,
    treatment: "Diabetes Management",
    treatmentCategory: "Diabetes Management",
    review: "My diabetes numbers were fluctuating erratically. Dr. Sharma restructured my diet plan and timing without restricting everything I enjoyed. My HbA1c reduced from 8.8 to 6.9 in 4 months. Grateful for his systematic guidance.",
    text: "My diabetes numbers were fluctuating erratically. Dr. Sharma restructured my diet plan and timing without restricting everything I enjoyed. My HbA1c reduced from 8.8 to 6.9 in 4 months. Grateful for his systematic guidance.",
    date: "2025-12-18",
    verified: true,
    featured: true,
  },
];

export const placeholderFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "Do I need a prior appointment or can I walk in directly?",
    answer: "Both are welcome! Walk-in patients are accommodated during regular OPD hours. However, scheduling an online callback ensures your slot is reserved, allowing you to walk in with near-zero waiting time.",
    category: "General",
    active: true,
    order: 1,
  },
  {
    id: "faq-2",
    question: "What are the clinic's OPD consultation timings?",
    answer: "We are open Monday to Friday from 9:00 AM – 1:00 PM (Morning) and 5:00 PM – 8:30 PM (Evening). Saturdays 9:00 AM – 1:00 PM & 5:00 PM – 8:00 PM. Sundays are open 10:00 AM – 1:00 PM for urgent consultations.",
    category: "Timings",
    active: true,
    order: 2,
  },
  {
    id: "faq-3",
    question: "What is the standard consultation fee?",
    answer: "General OPD consultations are ₹500. Routine follow-ups within 5 days for the same illness are conducted at zero consultation charges. Procedures and diagnostic tests have transparent, fixed price charts.",
    category: "Fees",
    active: true,
    order: 3,
  },
  {
    id: "faq-4",
    question: "Can I receive consultation and follow-up guidance over WhatsApp?",
    answer: "Yes, registered clinic patients can clarify prescription dosages or send lab reports directly to our clinic WhatsApp desk. For new illnesses, an in-person physical examination is always recommended.",
    category: "General",
    active: true,
    order: 4,
  },
  {
    id: "faq-5",
    question: "Are blood tests and diagnostic reports collected at the clinic?",
    answer: "Yes! We perform on-site resting 12-lead ECG and point-of-care blood sugar tests. For comprehensive pathology blood panels, our certified phlebotomist collects samples right here in our sterile sample corner.",
    category: "Services",
    active: true,
    order: 5,
  },
  {
    id: "faq-6",
    question: "What if I need to cancel or reschedule my consultation slot?",
    answer: "There are no cancellation fees. Simply drop a quick WhatsApp message or call our front desk, and our team will be glad to adjust your timing without any hassle.",
    category: "Appointments",
    active: true,
    order: 6,
  },
];

export const placeholderStats: ClinicStat[] = [
  {
    value: "15+",
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
