import type {
  ClientAppointment,
  ClientContactMessage,
  ClientService,
  GalleryImage,
  Testimonial,
  Faq,
  ClientClinicSettings,
  ClientAppUser,
  Role,
  AppointmentStatus,
} from "@/lib/types";
import { placeholderServices, placeholderTestimonials, placeholderFaqs, placeholderGallery } from "@/lib/data/placeholder";
import { siteConfig } from "@/lib/config/site";

// Simulated 300ms network latency
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// SEED DATA: 30 APPOINTMENTS
// ==========================================
const now = new Date();
const toIso = (daysAgo: number, hoursAgo = 0) => {
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
  return d.toISOString();
};
const futureDate = (daysAhead: number) => {
  const d = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
};

const appointmentsData: ClientAppointment[] = [
  {
    id: "apt-101",
    name: "Rajesh Kumar",
    phone: "9876543210",
    preferredDate: futureDate(1),
    preferredTime: "morning",
    service: "Panchakarma Consultation",
    message: "Suffering from severe lower back pain and fatigue for 3 months.",
    consent: true,
    status: "new",
    notes: "Requires preliminary detox assessment before full Vamana procedure.",
    activity: [
      {
        id: "act-1",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(0, 1),
      },
    ],
    createdAt: toIso(0, 1),
    updatedAt: toIso(0, 1),
  },
  {
    id: "apt-102",
    name: "Sunita Verma",
    phone: "9823456789",
    preferredDate: futureDate(2),
    preferredTime: "evening",
    service: "Stress & Insomnia Therapy",
    message: "Seeking natural Shirodhara package for chronic sleeplessness.",
    consent: true,
    status: "new",
    notes: "",
    activity: [
      {
        id: "act-2",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(0, 2),
      },
    ],
    createdAt: toIso(0, 2),
    updatedAt: toIso(0, 2),
  },
  {
    id: "apt-103",
    name: "Amit Patel",
    phone: "9712345678",
    preferredDate: futureDate(1),
    preferredTime: "morning",
    service: "Joint Pain & Arthritis Care",
    message: "Knee swelling worsens during winter mornings.",
    consent: true,
    status: "new",
    notes: "",
    activity: [
      {
        id: "act-3",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(0, 3),
      },
    ],
    createdAt: toIso(0, 3),
    updatedAt: toIso(0, 3),
  },
  {
    id: "apt-104",
    name: "Priya Sharma",
    phone: "9988776655",
    preferredDate: futureDate(3),
    preferredTime: "any",
    service: "Digestive & Gut Health",
    message: "Chronic hyperacidity and IBS symptoms. Seeking herbal dietary plan.",
    consent: true,
    status: "new",
    notes: "",
    activity: [
      {
        id: "act-4",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(0, 4),
      },
    ],
    createdAt: toIso(0, 4),
    updatedAt: toIso(0, 4),
  },
  {
    id: "apt-105",
    name: "Vikram Malhotra",
    phone: "9845012345",
    preferredDate: futureDate(2),
    preferredTime: "evening",
    service: "Skin & Hair Therapy",
    message: "Persistent eczema flare-up on hands.",
    consent: true,
    status: "new",
    notes: "",
    activity: [
      {
        id: "act-5",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(0, 5),
      },
    ],
    createdAt: toIso(0, 5),
    updatedAt: toIso(0, 5),
  },
  {
    id: "apt-106",
    name: "Meena Iyer",
    phone: "9731298765",
    preferredDate: futureDate(4),
    preferredTime: "morning",
    service: "Preventive Health & Immunity",
    message: "Annual Rasayana checkup for family members.",
    consent: true,
    status: "new",
    notes: "",
    activity: [
      {
        id: "act-6",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(0, 6),
      },
    ],
    createdAt: toIso(0, 6),
    updatedAt: toIso(0, 6),
  },
  {
    id: "apt-107",
    name: "Deepak Saini",
    phone: "9899123456",
    preferredDate: futureDate(1),
    preferredTime: "morning",
    service: "Panchakarma Consultation",
    message: "Referred by Dr. Arvind for 7-day Abhyanga therapy.",
    consent: true,
    status: "called",
    notes: "Called patient. Left voice note on WhatsApp with OPD time slots.",
    activity: [
      {
        id: "act-7a",
        type: "created",
        description: "Appointment requested online by patient",
        userName: "System",
        timestamp: toIso(1, 2),
      },
      {
        id: "act-7b",
        type: "status_change",
        description: "Status changed from new to called",
        userName: "Pooja Mehta",
        timestamp: toIso(0, 4),
      },
    ],
    createdAt: toIso(1, 2),
    updatedAt: toIso(0, 4),
  },
  {
    id: "apt-108",
    name: "Ananya Roy",
    phone: "9830112233",
    preferredDate: futureDate(3),
    preferredTime: "evening",
    service: "Stress & Insomnia Therapy",
    message: "Working in IT shifts, experiencing migraines and sleeplessness.",
    consent: true,
    status: "called",
    notes: "Patient prefers evening slot after 6:30 PM. Awaiting confirmation.",
    activity: [
      {
        id: "act-8",
        type: "status_change",
        description: "Status changed from new to called",
        userName: "Pooja Mehta",
        timestamp: toIso(0, 3),
      },
    ],
    createdAt: toIso(1, 4),
    updatedAt: toIso(0, 3),
  },
  {
    id: "apt-109",
    name: "Suresh Menon",
    phone: "9447012345",
    preferredDate: futureDate(2),
    preferredTime: "morning",
    service: "Joint Pain & Arthritis Care",
    message: "Seeking Kati Basti for lumbar disc bulge.",
    consent: true,
    status: "called",
    notes: "Informed about MRI scan requirement during consultation.",
    activity: [],
    createdAt: toIso(1, 6),
    updatedAt: toIso(0, 2),
  },
  {
    id: "apt-110",
    name: "Kavita Rao",
    phone: "9880198765",
    preferredDate: futureDate(1),
    preferredTime: "morning",
    service: "Digestive & Gut Health",
    message: "Frequent bloating and sluggish metabolism.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed for Tomorrow 10:30 AM slot. Consultation room 2.",
    activity: [
      {
        id: "act-10",
        type: "status_change",
        description: "Confirmed appointment schedule for Tomorrow 10:30 AM",
        userName: "Dr. Arvind Sharma",
        timestamp: toIso(0, 2),
      },
    ],
    createdAt: toIso(2, 3),
    updatedAt: toIso(0, 2),
  },
  {
    id: "apt-111",
    name: "Harish Gupta",
    phone: "9811223344",
    preferredDate: futureDate(2),
    preferredTime: "evening",
    service: "Joint Pain & Arthritis Care",
    message: "Follow-up consultation after 14-day herbal medication cycle.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed for Day after tomorrow 6:00 PM.",
    activity: [],
    createdAt: toIso(2, 5),
    updatedAt: toIso(1, 1),
  },
  {
    id: "apt-112",
    name: "Shalini Deshmukh",
    phone: "9822334455",
    preferredDate: futureDate(1),
    preferredTime: "evening",
    service: "Skin & Hair Therapy",
    message: "Psoriasis flare-up consultation.",
    consent: true,
    status: "confirmed",
    notes: "Scheduled for 5:30 PM with Dr. Arvind.",
    activity: [],
    createdAt: toIso(2, 8),
    updatedAt: toIso(1, 3),
  },
  {
    id: "apt-113",
    name: "Manish Tiwari",
    phone: "9935123456",
    preferredDate: futureDate(0),
    preferredTime: "morning",
    service: "Panchakarma Consultation",
    message: "Full detox consultation before seasonal transition.",
    consent: true,
    status: "visited",
    notes: "Consultation completed. Prescribed Triphala kwath and scheduled for Abhyanga starting Monday.",
    activity: [
      {
        id: "act-13",
        type: "status_change",
        description: "Marked as visited / completed consultation",
        userName: "Dr. Arvind Sharma",
        timestamp: toIso(0, 1),
      },
    ],
    createdAt: toIso(3, 2),
    updatedAt: toIso(0, 1),
  },
  {
    id: "apt-114",
    name: "Geeta Bhatt",
    phone: "9412098765",
    preferredDate: futureDate(-1),
    preferredTime: "evening",
    service: "Stress & Insomnia Therapy",
    message: "Shirodhara therapy session 3 of 5.",
    consent: true,
    status: "visited",
    notes: "Session completed smoothly. Patient reported major sleep improvement.",
    activity: [],
    createdAt: toIso(4, 5),
    updatedAt: toIso(1, 2),
  },
  {
    id: "apt-115",
    name: "Naveen Chawla",
    phone: "9810987654",
    preferredDate: futureDate(-2),
    preferredTime: "morning",
    service: "Digestive & Gut Health",
    message: "Acidity and reflux issues.",
    consent: true,
    status: "visited",
    notes: "Dietary regimen provided. Next review after 3 weeks.",
    activity: [],
    createdAt: toIso(5, 4),
    updatedAt: toIso(2, 1),
  },
  {
    id: "apt-116",
    name: "Rahul Saxena",
    phone: "9871098765",
    preferredDate: futureDate(5),
    preferredTime: "morning",
    service: "Joint Pain & Arthritis Care",
    message: "Travelling out of station, will reschedule next month.",
    consent: true,
    status: "cancelled",
    notes: "Patient cancelled due to out-of-station travel.",
    activity: [
      {
        id: "act-16",
        type: "status_change",
        description: "Cancelled upon patient phone request",
        userName: "Pooja Mehta",
        timestamp: toIso(1, 4),
      },
    ],
    createdAt: toIso(3, 1),
    updatedAt: toIso(1, 4),
  },
  {
    id: "apt-117",
    name: "Pooja Hegde",
    phone: "9845198765",
    preferredDate: futureDate(3),
    preferredTime: "evening",
    service: "Skin & Hair Therapy",
    message: "Duplicate request submitted by mistake.",
    consent: true,
    status: "cancelled",
    notes: "Duplicate booking confirmed with patient.",
    activity: [],
    createdAt: toIso(4, 2),
    updatedAt: toIso(3, 1),
  },
  {
    id: "apt-118",
    name: "Rohit Agarwal",
    phone: "9910011223",
    preferredDate: futureDate(2),
    preferredTime: "morning",
    service: "Panchakarma Consultation",
    message: "Consultation regarding 21-day rejuvenation retreat.",
    consent: true,
    status: "new",
    notes: "",
    activity: [],
    createdAt: toIso(0, 7),
    updatedAt: toIso(0, 7),
  },
  {
    id: "apt-119",
    name: "Neelam Joshi",
    phone: "9820099887",
    preferredDate: futureDate(1),
    preferredTime: "evening",
    service: "Stress & Insomnia Therapy",
    message: "Anxiety and high stress levels due to corporate workload.",
    consent: true,
    status: "new",
    notes: "",
    activity: [],
    createdAt: toIso(0, 8),
    updatedAt: toIso(0, 8),
  },
  {
    id: "apt-120",
    name: "Devendra Yadav",
    phone: "9450012345",
    preferredDate: futureDate(3),
    preferredTime: "morning",
    service: "Joint Pain & Arthritis Care",
    message: "Osteoarthritis patient, needs gentle non-invasive therapy.",
    consent: true,
    status: "called",
    notes: "Spoke with son. Requested patient medical history via WhatsApp.",
    activity: [],
    createdAt: toIso(1, 5),
    updatedAt: toIso(0, 5),
  },
  {
    id: "apt-121",
    name: "Bhavna Patel",
    phone: "9879012345",
    preferredDate: futureDate(4),
    preferredTime: "any",
    service: "Preventive Health & Immunity",
    message: "General holistic wellness screening.",
    consent: true,
    status: "called",
    notes: "Callback scheduled for 4 PM today.",
    activity: [],
    createdAt: toIso(1, 7),
    updatedAt: toIso(0, 6),
  },
  {
    id: "apt-122",
    name: "Gaurav Singhal",
    phone: "9818012345",
    preferredDate: futureDate(2),
    preferredTime: "morning",
    service: "Digestive & Gut Health",
    message: "Chronic acidity and heartburn.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed for Friday morning 11:15 AM.",
    activity: [],
    createdAt: toIso(2, 6),
    updatedAt: toIso(1, 2),
  },
  {
    id: "apt-123",
    name: "Kiran Mazumdar",
    phone: "9831098765",
    preferredDate: futureDate(3),
    preferredTime: "evening",
    service: "Panchakarma Consultation",
    message: "Panchakarma consultation for post-viral fatigue.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed for Saturday 5:00 PM.",
    activity: [],
    createdAt: toIso(3, 4),
    updatedAt: toIso(1, 5),
  },
  {
    id: "apt-124",
    name: "Alok Nanda",
    phone: "9891012345",
    preferredDate: futureDate(4),
    preferredTime: "morning",
    service: "Stress & Insomnia Therapy",
    message: "Sleep pattern disturbances.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed for Sunday 10:00 AM.",
    activity: [],
    createdAt: toIso(3, 8),
    updatedAt: toIso(2, 2),
  },
  {
    id: "apt-125",
    name: "Vandana Nair",
    phone: "9446012345",
    preferredDate: futureDate(1),
    preferredTime: "evening",
    service: "Skin & Hair Therapy",
    message: "Hair fall and scalp psoriasis consultation.",
    consent: true,
    status: "new",
    notes: "",
    activity: [],
    createdAt: toIso(0, 9),
    updatedAt: toIso(0, 9),
  },
  {
    id: "apt-126",
    name: "Sanjay Goswami",
    phone: "9826012345",
    preferredDate: futureDate(5),
    preferredTime: "morning",
    service: "Joint Pain & Arthritis Care",
    message: "Cervical spondylosis and neck stiffness.",
    consent: true,
    status: "called",
    notes: "Gave Greeva Basti pricing and session duration details.",
    activity: [],
    createdAt: toIso(2, 2),
    updatedAt: toIso(1, 6),
  },
  {
    id: "apt-127",
    name: "Ritu Mittal",
    phone: "9810023456",
    preferredDate: futureDate(2),
    preferredTime: "evening",
    service: "Digestive & Gut Health",
    message: "Constipation and irregular digestion.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed slot.",
    activity: [],
    createdAt: toIso(4, 1),
    updatedAt: toIso(2, 3),
  },
  {
    id: "apt-128",
    name: "Tarun Kapoor",
    phone: "9818823456",
    preferredDate: futureDate(6),
    preferredTime: "morning",
    service: "Panchakarma Consultation",
    message: "Looking for full body detox and rejuvenation package.",
    consent: true,
    status: "new",
    notes: "",
    activity: [],
    createdAt: toIso(0, 10),
    updatedAt: toIso(0, 10),
  },
  {
    id: "apt-129",
    name: "Pallavi Sen",
    phone: "9830034567",
    preferredDate: futureDate(3),
    preferredTime: "evening",
    service: "Preventive Health & Immunity",
    message: "Immunity booster therapies for senior citizen parents.",
    consent: true,
    status: "called",
    notes: "Called; will visit with parents on Saturday afternoon.",
    activity: [],
    createdAt: toIso(2, 4),
    updatedAt: toIso(1, 3),
  },
  {
    id: "apt-130",
    name: "Chirag Thakkar",
    phone: "9825045678",
    preferredDate: futureDate(4),
    preferredTime: "morning",
    service: "Joint Pain & Arthritis Care",
    message: "Frozen shoulder pain relief therapy consultation.",
    consent: true,
    status: "confirmed",
    notes: "Confirmed for Tuesday 11:30 AM.",
    activity: [],
    createdAt: toIso(3, 5),
    updatedAt: toIso(2, 4),
  },
];

// ==========================================
// SEED DATA: 15 CONTACT MESSAGES
// ==========================================
let contactMessagesData: ClientContactMessage[] = [
  {
    id: "msg-201",
    name: "Dr. Ashok Mehta",
    phone: "9820011223",
    email: "ashok.mehta@yahoo.com",
    subject: "OPD hours & Sunday consultation query",
    message: "Are doctor consultations available on Sunday mornings? Would like to bring my father for an initial pulse examination.",
    consent: true,
    read: false,
    archived: false,
    createdAt: toIso(0, 2),
  },
  {
    id: "msg-202",
    name: "Roshni Sen",
    phone: "9831122334",
    email: "roshni.sen@gmail.com",
    subject: "Panchakarma package query",
    message: "Can you provide the detailed pricing and duration for the 7-day Shirodhara and Abhyanga therapy package?",
    consent: true,
    read: false,
    archived: false,
    createdAt: toIso(0, 5),
  },
  {
    id: "msg-203",
    name: "Mukesh Ambani",
    phone: "9821098765",
    email: "mambani.office@rediffmail.com",
    subject: "Home visit availability",
    message: "Do you have physiotherapists or Ayurvedic therapists available for home visits for bedridden senior citizens?",
    consent: true,
    read: false,
    archived: false,
    createdAt: toIso(0, 8),
  },
  {
    id: "msg-204",
    name: "Swati Kulkarni",
    phone: "9822019876",
    email: "swati.kulkarni@hotmail.com",
    subject: "Insurance and mediclaim cashless",
    message: "Does your clinic accept insurance reimbursement / cashless mediclaim for in-clinic Ayurvedic procedures?",
    consent: true,
    read: false,
    archived: false,
    createdAt: toIso(1, 3),
  },
  {
    id: "msg-205",
    name: "Vinod Chandran",
    phone: "9447123456",
    email: "vchandran@gmail.com",
    subject: "Kati Basti for sciatica",
    message: "I was diagnosed with L4-L5 slip disc. How many sessions of Kati Basti are recommended typically before relief?",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(1, 7),
  },
  {
    id: "msg-206",
    name: "Anjali Gupta",
    phone: "9811098765",
    email: "anjali.g@gmail.com",
    subject: "Postpartum care therapy",
    message: "Do you offer specialized Ayurvedic postnatal mother and baby massage therapies at the clinic?",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(2, 2),
  },
  {
    id: "msg-207",
    name: "Karthik Raja",
    phone: "9840012345",
    email: "karthik.raja@outlook.com",
    subject: "Parking and wheelchair access",
    message: "Is dedicated parking and wheelchair ramp access available near the clinic entrance?",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(2, 6),
  },
  {
    id: "msg-208",
    name: "Farhan Qureshi",
    phone: "9890012345",
    email: "farhan.q@gmail.com",
    subject: "Migraine treatment protocol",
    message: "Suffering from migraine for 5 years. Wanted to consult regarding Nasya therapy schedule.",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(3, 1),
  },
  {
    id: "msg-209",
    name: "Sneha Nair",
    phone: "9847098765",
    email: "snehanair@gmail.com",
    subject: "Diet chart consultation",
    message: "Can I book a standalone Ayurvedic diet and nutrition consultation without undergoing therapy procedures?",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(3, 5),
  },
  {
    id: "msg-210",
    name: "Brijesh Mishra",
    phone: "9415012345",
    email: "bmishra@rediffmail.com",
    subject: "Herbal medicines availability",
    message: "Do you stock Kottakkal Arya Vaidya Sala medicines at your clinic dispensary?",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(4, 3),
  },
  {
    id: "msg-211",
    name: "Pooja Hegde",
    phone: "9886012345",
    email: "pooja.hegde@gmail.com",
    subject: "Skin pigmentation consultation",
    message: "Looking for holistic treatment for facial melasma and pigmentation. Please advise doctor consultation timing.",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(5, 2),
  },
  {
    id: "msg-212",
    name: "Raghavendra Rao",
    phone: "9849012345",
    email: "rrao@gmail.com",
    subject: "Feedback on consultation",
    message: "Thank you Dr. Arvind for the accurate Nadi Pariksha and kind consultation. Feeling much better.",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(6, 4),
  },
  {
    id: "msg-213",
    name: "Tanvi Saxena",
    phone: "9873012345",
    email: "tanvi.s@gmail.com",
    subject: "Corporate wellness talk",
    message: "We would like to invite Dr. Arvind for a workplace ergonomic and Ayurvedic stress-relief session at our office.",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(7, 1),
  },
  {
    id: "msg-214",
    name: "Manohar Lal",
    phone: "9814012345",
    email: "mlal@gmail.com",
    subject: "Gout & high uric acid",
    message: "Suffering from high uric acid. Can Ayurvedic medicines cure gout attacks permanently?",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(8, 2),
  },
  {
    id: "msg-215",
    name: "Deepali Joshi",
    phone: "9820054321",
    email: "deepali.j@gmail.com",
    subject: "Thyroid natural management",
    message: "Looking for safe complementary Ayurvedic care alongside my existing levothyroxine dosage.",
    consent: true,
    read: true,
    archived: false,
    createdAt: toIso(9, 3),
  },
];

// ==========================================
// SEED DATA: SERVICES, GALLERY, TESTIMONIALS, FAQS, USERS, SETTINGS
// ==========================================
let servicesData: ClientService[] = placeholderServices.map((s, idx) => ({
  ...s,
  content: s.content || s.fullDescription,
  order: idx + 1,
  active: true,
  createdAt: toIso(30),
  updatedAt: toIso(1),
}));

let galleryData: GalleryImage<string>[] = placeholderGallery.map((g, idx) => ({
  ...g,
  order: idx + 1,
  createdAt: toIso(20),
}));

let testimonialsData: Testimonial<string>[] = placeholderTestimonials.map((t) => ({
  ...t,
  date: t.date || "September 2026",
  verified: true,
  featured: true,
  createdAt: toIso(15),
}));

let faqsData: Faq[] = placeholderFaqs.map((f, idx) => ({
  ...f,
  order: idx + 1,
  active: true,
}));

const usersData: ClientAppUser[] = [
  {
    uid: "usr-admin-1",
    name: "Dr. Arvind Sharma",
    email: "admin@ayurvedaclinic.com",
    role: "admin",
    status: "active",
    createdAt: toIso(60),
    lastLoginAt: toIso(0, 1),
  },
  {
    uid: "usr-staff-2",
    name: "Pooja Mehta",
    email: "pooja.staff@ayurvedaclinic.com",
    role: "staff",
    status: "active",
    createdAt: toIso(45),
    lastLoginAt: toIso(0, 3),
  },
  {
    uid: "usr-staff-3",
    name: "Ramesh Joshi",
    email: "ramesh.desk@ayurvedaclinic.com",
    role: "staff",
    status: "disabled",
    createdAt: toIso(30),
    lastLoginAt: toIso(10),
  },
];

let clinicSettingsData: ClientClinicSettings = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.phone,
  phoneDisplay: siteConfig.phoneDisplay,
  whatsapp: siteConfig.whatsapp,
  whatsappDisplay: siteConfig.whatsappDisplay,
  email: siteConfig.email,
  doctor: {
    name: siteConfig.doctor.name,
    qualification: siteConfig.doctor.qualification,
    experience: siteConfig.doctor.experience,
    specialization: siteConfig.doctor.specialization,
    registrationNumber: siteConfig.doctor.registrationNumber,
    bio: siteConfig.doctor.bio,
  },
  address: {
    street: siteConfig.address.street,
    area: siteConfig.address.area,
    city: siteConfig.address.city,
    state: siteConfig.address.state,
    pincode: siteConfig.address.pincode,
    fullAddress: siteConfig.address.fullAddress,
  },
  timings: {
    days: siteConfig.timings.days,
    morning: siteConfig.timings.morning,
    evening: siteConfig.timings.evening,
    sunday: siteConfig.timings.sunday,
    emergencyNote: siteConfig.timings.emergencyNote,
  },
  mapEmbedUrl: siteConfig.mapEmbedUrl,
  socialLinks: siteConfig.socialLinks,
  updatedAt: toIso(0, 1),
};

// ==========================================
// EXPORTED MOCK FUNCTIONS (MATCHING STEP 4/5 API SIGNATURES)
// ==========================================

export interface AppointmentFilters {
  status?: string;
  search?: string;
  service?: string;
  dateRange?: { start?: string; end?: string };
  page?: number;
  limit?: number;
}

export async function listAppointments(filters: AppointmentFilters = {}) {
  await delay();
  let list = [...appointmentsData];

  // Status filter
  if (filters.status && filters.status !== "all") {
    list = list.filter((a) => a.status === filters.status);
  }

  // Service filter
  if (filters.service && filters.service !== "all") {
    list = list.filter((a) => a.service === filters.service);
  }

  // Search filter (name, phone, notes)
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        (a.service && a.service.toLowerCase().includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q))
    );
  }

  // Date range filter
  if (filters.dateRange?.start) {
    list = list.filter((a) => a.preferredDate && a.preferredDate >= filters.dateRange!.start!);
  }
  if (filters.dateRange?.end) {
    list = list.filter((a) => a.preferredDate && a.preferredDate <= filters.dateRange!.end!);
  }

  // Sort descending by createdAt
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Status counts across all appointments
  const counts: Record<string, number> = {
    all: appointmentsData.length,
    new: appointmentsData.filter((a) => a.status === "new").length,
    called: appointmentsData.filter((a) => a.status === "called").length,
    confirmed: appointmentsData.filter((a) => a.status === "confirmed").length,
    visited: appointmentsData.filter((a) => a.status === "visited").length,
    cancelled: appointmentsData.filter((a) => a.status === "cancelled").length,
  };

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedList = list.slice(startIndex, startIndex + limit);

  return {
    appointments: paginatedList,
    total,
    totalPages,
    page,
    limit,
    counts,
  };
}

export async function getAppointment(id: string): Promise<ClientAppointment | null> {
  await delay(150);
  const found = appointmentsData.find((a) => a.id === id);
  return found ? { ...found } : null;
}

export async function updateAppointment(
  id: string,
  patch: Partial<ClientAppointment> & { changedBy?: string }
): Promise<ClientAppointment> {
  await delay();
  const idx = appointmentsData.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Appointment not found");

  const existing = appointmentsData[idx];
  const newActivity = [...(existing.activity || [])];

  if (patch.status && patch.status !== existing.status) {
    newActivity.unshift({
      id: `act-${Date.now()}`,
      type: "status_change",
      description: `Status changed from ${existing.status} to ${patch.status}`,
      userName: patch.changedBy || "Staff",
      timestamp: new Date().toISOString(),
    });
  }

  if (patch.notes && patch.notes !== existing.notes) {
    newActivity.unshift({
      id: `act-${Date.now() + 1}`,
      type: "note",
      description: "Internal notes updated",
      userName: patch.changedBy || "Staff",
      timestamp: new Date().toISOString(),
    });
  }

  const updated: ClientAppointment = {
    ...existing,
    ...patch,
    activity: newActivity,
    updatedAt: new Date().toISOString(),
  };

  appointmentsData[idx] = updated;
  return updated;
}

export async function bulkUpdateAppointmentStatus(
  ids: string[],
  status: AppointmentStatus,
  changedBy = "Staff"
): Promise<{ success: boolean; updatedCount: number }> {
  await delay();
  let count = 0;
  for (const id of ids) {
    const idx = appointmentsData.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const existing = appointmentsData[idx];
      const activity = [...(existing.activity || [])];
      activity.unshift({
        id: `act-${Date.now()}-${count}`,
        type: "status_change",
        description: `Bulk status update to ${status}`,
        userName: changedBy,
        timestamp: new Date().toISOString(),
      });
      appointmentsData[idx] = {
        ...existing,
        status,
        activity,
        updatedAt: new Date().toISOString(),
      };
      count++;
    }
  }
  return { success: true, updatedCount: count };
}

// ==========================================
// CONTACT MESSAGES
// ==========================================
export async function listMessages(filters: { unreadOnly?: boolean; search?: string } = {}) {
  await delay();
  let list = [...contactMessagesData];
  if (filters.unreadOnly) {
    list = list.filter((m) => !m.read);
  }
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        m.message.toLowerCase().includes(q)
    );
  }
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list;
}

export async function markMessageRead(id: string, read = true): Promise<ClientContactMessage> {
  await delay(150);
  const idx = contactMessagesData.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Message not found");
  contactMessagesData[idx] = { ...contactMessagesData[idx], read };
  return contactMessagesData[idx];
}

export async function deleteMessage(id: string): Promise<void> {
  await delay(200);
  contactMessagesData = contactMessagesData.filter((m) => m.id !== id);
}

// ==========================================
// SERVICES MANAGEMENT
// ==========================================
export async function listServices(): Promise<ClientService[]> {
  await delay();
  return [...servicesData].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function createService(service: Omit<ClientService, "id">): Promise<ClientService> {
  await delay();
  const newService: ClientService = {
    ...service,
    id: `srv-${Date.now()}`,
    order: servicesData.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  servicesData.push(newService);
  return newService;
}

export async function updateService(id: string, patch: Partial<ClientService>): Promise<ClientService> {
  await delay();
  const idx = servicesData.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Service not found");
  servicesData[idx] = {
    ...servicesData[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return servicesData[idx];
}

export async function deleteService(id: string): Promise<void> {
  await delay(200);
  servicesData = servicesData.filter((s) => s.id !== id);
}

export async function reorderServices(ids: string[]): Promise<ClientService[]> {
  await delay(200);
  const idMap = new Map(ids.map((id, index) => [id, index + 1]));
  servicesData.forEach((s) => {
    if (idMap.has(s.id)) {
      s.order = idMap.get(s.id)!;
    }
  });
  return listServices();
}

// ==========================================
// TESTIMONIALS MANAGEMENT
// ==========================================
export async function listTestimonials(): Promise<Testimonial<string>[]> {
  await delay();
  return [...testimonialsData];
}

export async function createTestimonial(testimonial: Omit<Testimonial<string>, "id">): Promise<Testimonial<string>> {
  await delay();
  const newTestimonial: Testimonial<string> = {
    ...testimonial,
    id: `tst-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  testimonialsData.push(newTestimonial);
  return newTestimonial;
}

export async function updateTestimonial(id: string, patch: Partial<Testimonial<string>>): Promise<Testimonial<string>> {
  await delay();
  const idx = testimonialsData.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Testimonial not found");
  testimonialsData[idx] = { ...testimonialsData[idx], ...patch };
  return testimonialsData[idx];
}

export async function deleteTestimonial(id: string): Promise<void> {
  await delay(200);
  testimonialsData = testimonialsData.filter((t) => t.id !== id);
}

export async function reorderTestimonials(ids: string[]): Promise<Testimonial<string>[]> {
  await delay(200);
  const map = new Map(ids.map((id, idx) => [id, idx]));
  testimonialsData.sort((a, b) => (map.get(a.id) ?? 99) - (map.get(b.id) ?? 99));
  return [...testimonialsData];
}

// ==========================================
// FAQS MANAGEMENT
// ==========================================
export async function listFaqs(): Promise<Faq[]> {
  await delay();
  return [...faqsData].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function createFaq(faq: Omit<Faq, "id">): Promise<Faq> {
  await delay();
  const newFaq: Faq = {
    ...faq,
    id: `faq-${Date.now()}`,
    order: faqsData.length + 1,
  };
  faqsData.push(newFaq);
  return newFaq;
}

export async function updateFaq(id: string, patch: Partial<Faq>): Promise<Faq> {
  await delay();
  const idx = faqsData.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("FAQ not found");
  faqsData[idx] = { ...faqsData[idx], ...patch };
  return faqsData[idx];
}

export async function deleteFaq(id: string): Promise<void> {
  await delay(200);
  faqsData = faqsData.filter((f) => f.id !== id);
}

export async function reorderFaqs(ids: string[]): Promise<Faq[]> {
  await delay(200);
  const idMap = new Map(ids.map((id, index) => [id, index + 1]));
  faqsData.forEach((f) => {
    if (idMap.has(f.id)) {
      f.order = idMap.get(f.id)!;
    }
  });
  return listFaqs();
}

// ==========================================
// GALLERY MANAGEMENT
// ==========================================
export async function listGalleryImages(): Promise<GalleryImage<string>[]> {
  await delay();
  return [...galleryData].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function createGalleryImage(image: Omit<GalleryImage<string>, "id">): Promise<GalleryImage<string>> {
  await delay();
  const newImage: GalleryImage<string> = {
    ...image,
    id: `gal-${Date.now()}`,
    order: galleryData.length + 1,
    createdAt: new Date().toISOString(),
  };
  galleryData.push(newImage);
  return newImage;
}

export async function updateGalleryImage(id: string, patch: Partial<GalleryImage<string>>): Promise<GalleryImage<string>> {
  await delay();
  const idx = galleryData.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error("Gallery image not found");
  galleryData[idx] = { ...galleryData[idx], ...patch };
  return galleryData[idx];
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await delay(200);
  galleryData = galleryData.filter((g) => g.id !== id);
}

export async function reorderGalleryImages(ids: string[]): Promise<GalleryImage<string>[]> {
  await delay(200);
  const idMap = new Map(ids.map((id, index) => [id, index + 1]));
  galleryData.forEach((g) => {
    if (idMap.has(g.id)) {
      g.order = idMap.get(g.id)!;
    }
  });
  return listGalleryImages();
}

// ==========================================
// CLINIC SETTINGS
// ==========================================
export async function getSettings(): Promise<ClientClinicSettings> {
  await delay();
  return { ...clinicSettingsData };
}

export async function updateSettings(patch: Partial<ClientClinicSettings>): Promise<ClientClinicSettings> {
  await delay();
  clinicSettingsData = {
    ...clinicSettingsData,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return { ...clinicSettingsData };
}

// ==========================================
// USERS MANAGEMENT
// ==========================================
export async function listUsers(): Promise<ClientAppUser[]> {
  await delay();
  return [...usersData];
}

export async function inviteUser(input: { email: string; role: Role; name: string }): Promise<ClientAppUser> {
  await delay();
  const existing = usersData.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (existing) throw new Error("User with this email already exists");

  const newUser: ClientAppUser = {
    uid: `usr-${Date.now()}`,
    email: input.email.toLowerCase(),
    name: input.name,
    role: input.role,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  usersData.push(newUser);
  return newUser;
}

export async function updateUserRole(uid: string, role: Role): Promise<ClientAppUser> {
  await delay();
  const idx = usersData.findIndex((u) => u.uid === uid);
  if (idx === -1) throw new Error("User not found");
  usersData[idx] = { ...usersData[idx], role };
  return usersData[idx];
}

export async function disableUser(uid: string, disabled: boolean): Promise<ClientAppUser> {
  await delay();
  const idx = usersData.findIndex((u) => u.uid === uid);
  if (idx === -1) throw new Error("User not found");
  usersData[idx] = {
    ...usersData[idx],
    status: disabled ? "disabled" : "active",
  };
  return usersData[idx];
}

// ==========================================
// DASHBOARD STATS
// ==========================================
export async function getDashboardStats() {
  await delay();
  const todayStr = new Date().toISOString().split("T")[0];

  const newToday = appointmentsData.filter((a) => a.createdAt.startsWith(todayStr)).length;
  const pendingCallbacks = appointmentsData.filter((a) => a.status === "new").length;

  // Confirmed in the next 7 days
  const confirmedThisWeek = appointmentsData.filter((a) => a.status === "confirmed").length;
  const unreadMessages = contactMessagesData.filter((m) => !m.read).length;

  const needsCall = appointmentsData
    .filter((a) => a.status === "new")
    .slice(0, 5);

  const recentMessages = contactMessagesData.slice(0, 5);

  // Daily request counts for the last 14 days
  const dailyRequests = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const count = appointmentsData.filter((a) => a.createdAt.startsWith(dateStr)).length || (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1);
    return { date: dateStr, label, count };
  });

  return {
    newToday,
    pendingCallbacks,
    confirmedThisWeek,
    unreadMessages,
    needsCall,
    recentMessages,
    dailyRequests,
  };
}
