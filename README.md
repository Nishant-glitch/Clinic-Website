# Single-Branch Clinic Website & Admin Portal

A modern, production-grade web platform and management system designed for a single-branch medical clinic in India. Built with Next.js App Router, TypeScript, Tailwind CSS, Material You (Material Design 3), Firebase (Auth, Firestore, Storage), and Resend.

---

## 🏥 Product Overview

- **Public Patient Portal**:
  - Home, About Us, Clinical Services, Photo Gallery, Appointment Booking, Contact Us & Location Map.
  - Section flow tailored for Indian clinics: Sticky header with Call/WhatsApp, Hero, Trust Strip, Services, Doctor Profile, Patient Feedback, FAQ, and Google Maps directions.
  - Request-based appointment booking (no rigid slots; staff receives request and initiates callback).
- **Admin & Staff Management Panel**:
  - Secure `/admin` portal guarded by middleware and Firebase Auth.
  - Appointment callback pipeline (`new` ➔ `called` ➔ `confirmed` ➔ `visited` / `cancelled`).
  - Contact inquiry inbox and real-time content management with on-demand ISR revalidation.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router, Server Components, TypeScript)
- **Styling**: Tailwind CSS with Material You (MD3) CSS variables (Seed: `#6750A4`)
- **Typography**: Roboto (400, 500, 700) + Noto Sans Devanagari via `next/font/google`
- **Backend & Database**: Firebase Firestore, Firebase Storage, Firebase Admin SDK
- **Authentication**: Firebase Auth with role-based custom claims (`admin`, `staff`)
- **Form Handling & Validation**: React Hook Form with Zod schemas
- **Email Notifications**: Resend API
- **Animations & Carousel**: Framer Motion & Swiper
- **Icons**: Lucide React

---

## 📁 Folder Structure

```
clinic-website/
├── app/
│   ├── (public)/               # Public patient-facing pages
│   │   ├── page.tsx            # Home page (Hero, Trust, Services, Doctor, etc.)
│   │   ├── about/page.tsx      # Clinic background and doctor philosophy
│   │   ├── services/page.tsx   # Detailed medical services & treatments
│   │   ├── gallery/page.tsx    # Facility photos & tour
│   │   ├── appointment/page.tsx# Request-based appointment booking form
│   │   ├── contact/page.tsx    # Contact information & Google Map
│   │   └── layout.tsx          # Public layout (Header, Footer, MobileNav)
│   ├── admin/                  # Protected clinic management portal
│   │   ├── page.tsx            # Admin redirect
│   │   ├── login/page.tsx      # Staff/Admin credentials login
│   │   ├── dashboard/page.tsx  # Operational overview and metrics
│   │   ├── appointments/page.tsx# Callback workflow & status tracking
│   │   ├── messages/page.tsx   # Contact form inquiries
│   │   ├── content/page.tsx    # Services, doctor details, FAQs, timings editor
│   │   └── layout.tsx          # Admin layout shell
│   ├── api/                    # Route handlers (Server writes only)
│   │   ├── appointments/       # Public appointment submission (Admin SDK)
│   │   ├── contact/            # Public inquiry submission (Admin SDK)
│   │   ├── admin/              # Staff & admin operational endpoints
│   │   ├── health/             # System health & Firestore ping check
│   │   └── revalidate/         # On-demand ISR revalidation handler
│   ├── globals.css             # Tailwind v4 directives & theme definitions
│   └── layout.tsx              # Root HTML layout with Roboto & Devanagari fonts
├── components/
│   ├── ui/                     # Material Design 3 UI components
│   │   ├── Button.tsx          # Filled, outlined, tonal MD3 button variants
│   │   ├── Card.tsx            # Elevated, filled, outlined MD3 cards
│   │   ├── Input.tsx           # Form text inputs with validation states
│   │   ├── Textarea.tsx        # Multi-line inputs
│   │   ├── Select.tsx          # Styled dropdown selections
│   │   ├── FAB.tsx             # Floating Action Buttons (WhatsApp/Book)
│   │   └── Badge.tsx           # Status tags and category chips
│   ├── sections/               # Modular landing page sections
│   │   ├── Hero.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Testimonials.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── FAQSection.tsx
│   │   └── LocationMap.tsx
│   └── layout/                 # Shared site wrappers
│       ├── Header.tsx          # Sticky top bar with call/WhatsApp CTAs
│       ├── Footer.tsx          # Clinic hours, address, and legal links
│       └── MobileNav.tsx       # Bottom bar for mobile devices
├── lib/
│   ├── config/
│   │   └── site.ts             # Central typed clinic info (name, doctor, timings)
│   ├── env.client.ts           # Client-safe environment validator
│   ├── env.server.ts           # Server-only environment validator
│   ├── env.ts                  # Re-exporting environment validation hub
│   ├── types.ts                # Shared TypeScript models (dual Timestamp/ISO)
│   ├── api.ts                  # Standardized ok(data) / fail(code, message) helpers
│   ├── utils.ts                # Class merging (clsx+twMerge), formatDate (IST), formatPhone
│   ├── firebase/
│   │   ├── client.ts           # Firebase client SDK initialization
│   │   ├── admin.ts            # Firebase Admin SDK singleton
│   │   └── collections.ts      # Typed Firestore converters and collection references
│   ├── validators/             # Zod validation schemas (appointment.ts, contact.ts)
│   └── email/                  # Resend notifications and email templates
├── styles/
│   └── tokens.css              # Material You #6750A4 design tokens (Light/Dark)
├── docs/
│   ├── PROJECT_CONTEXT.md      # Master product context & architectural rules
│   └── DESIGN_SYSTEM.md        # MD3 color tokens, typography, and styling guide
├── firestore.rules             # Cloud Firestore security rules
├── storage.rules               # Cloud Storage security rules
├── firebase.json               # Firebase CLI deployment config
├── .firebaserc                 # Firebase project target binding
├── middleware.ts               # Edge session protection for /admin/*
└── .env.example                # Sample environment variables template
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm (installed with Node)

### 2. Environment Setup
Copy the environment template and populate your credentials:
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_FIREBASE_*`: Firebase Client credentials from Firebase Console.
- `FIREBASE_ADMIN_*`: Firebase Service Account credentials for server-side writes.
- `RESEND_API_KEY`: API key from [Resend](https://resend.com) for email alerts.
- `CLINIC_NOTIFY_EMAIL`: Clinic's email address to receive new appointment notifications.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔥 Deploying Firebase Security Rules

Deploy the Firestore and Storage rules directly to your Firebase project:

1. Install Firebase CLI globally (if not already installed):
   ```bash
   npm i -g firebase-tools
   ```
2. Log in with your Google account:
   ```bash
   firebase login
   ```
3. Link your project ID (or edit `.firebaserc`):
   ```bash
   firebase use your-firebase-project-id
   ```
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

---

## 📋 Build Steps Roadmap

1. **System design & setup** *(Completed)*
2. **Architecture & config** *(Completed in this step)*
3. Frontend
4. APIs & backend logic
5. Database & storage
6. Auth & permissions
7. Hosting & cloud
8. CI/CD & version control
9. Security
10. Rate limiting
11. Caching & CDN
12. Error tracking & logs
13. Monitoring & alerts
14. Testing
15. Scaling
16. SEO, performance, launch checklist
