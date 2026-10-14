# Project Context: Single-Branch Clinic Platform

> **IMPORTANT**: Every future step must read this file and [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) first before authoring or modifying code.

---

## 1. Product

- **Overview**: Single-branch clinic website + admin panel.
- **Public Pages**:
  - Home (`/`)
  - About Us (`/about`)
  - Services (`/services`)
  - Gallery (`/gallery`)
  - Appointment Booking (`/appointment`)
  - Contact Us (`/contact`)
- **Layout Reference**: Follow the section flow of a typical Indian clinic site:
  1. Sticky Header with quick Phone / WhatsApp / "Book Appointment" CTA
  2. Hero section with doctor highlight and emergency contact pill
  3. Trust Strip (metrics, experience, happy patients, sanitized facility)
  4. Services grid
  5. Why Choose Us (hygiene, personal care, modern diagnostics)
  6. Testimonials (verified patient feedback carousel)
  7. Doctor Profile (credentials, registration number, experience)
  8. Gallery preview (clean reception, consultation room, equipment)
  9. FAQ accordion
  10. Location Map with landmark directions & parking guidance
  11. Footer with OPD hours, address, and legal links
  12. Site-wide quick booking popup / Floating Action Button
  *All content must be ORIGINAL placeholders, never copied from any other site.*
- **Design**: Material You (Material Design 3), purple seed `#6750A4`, as defined in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- **Pricing**: Remove pricing-tier sections; the clinic operates on personalized consultations and does not need fixed tier tables.

---

## 2. Roles & Permissions

- **`visitor`**: Browse public pages, submit appointment request, submit contact form.
- **`staff`**: View appointments and patient messages, update appointment status and notes.
- **`admin`**: Everything staff can do + edit website content (services, FAQs, doctor profile, timings, gallery) + manage staff users.

---

## 3. Appointment Model (Request-Based, No Time Slots)

- **Philosophy**: Patient submits a consultation request; clinic staff calls back to confirm the exact appointment schedule.
- **Fields**:
  - `name`: string (min 2, max 80 chars)
  - `phone`: string (Indian 10-digit mobile number)
  - `preferredDate`: string (optional, YYYY-MM-DD)
  - `preferredTime`: `"morning"` | `"evening"` | `"any"`
  - `service`: string (optional)
  - `message`: string (optional, max 500 chars)
  - `consent`: boolean (`true` required by India DPDP Act 2023)
  - `status`: `"new"` | `"called"` | `"confirmed"` | `"visited"` | `"cancelled"`
  - `notes`: string (internal staff/admin notes)
  - `createdAt`: ISO timestamp string
  - `updatedAt`: ISO timestamp string
- **Status Lifecycle Flow**:
  ```
  [new] ──> [called] ──> [confirmed] ──> [visited]
    │          │             │
    └───> ─────┴──────> ─────┴───────> [cancelled]
  ```

---

## 4. Entities (Firestore Collections)

- `appointments`: Patient consultation requests and callback tracking.
- `contactMessages`: Inquiries submitted through the contact form.
- `services`: Clinical services offered, descriptions, icons, and highlights.
- `galleryImages`: Verified facility, equipment, and clinic photos with captions.
- `testimonials`: Patient reviews, ratings, and feedback.
- `faqs`: Common patient questions and answers regarding consultations and visits.
- `settings/clinic`: Single document store containing:
  - `name`, `tagline`, `doctor` (name, qualifications, experience, reg number, bio)
  - `address` (street, area, city, state, pincode, fullAddress)
  - `phone`, `whatsapp`, `email`
  - `timings` (days, morning, evening, sunday, emergency note)
  - `mapEmbedUrl`, `socialLinks`
- `users`: User profiles with roles (`uid`, `role`: `'admin'` | `'staff'`, `name`, `email`).

---

## 5. Architecture Rules

1. **Strict Server-Only Public Writes**: Public users NEVER write to Firestore directly. All public writes go through `/api/*` route handlers using Firebase Admin SDK, validated with Zod.
2. **Static Server-Side Content with ISR**: Public content is fetched on the server and rendered statically with Incremental Static Regeneration (ISR) for instant load speeds and superior SEO.
3. **Admin Authentication & RBAC**: Firebase Auth email/password -> server session cookie (`session` / `__session`) -> middleware protects `/admin/*`. Roles are enforced via Firebase Auth custom claims (`admin`, `staff`).
4. **On-Demand Revalidation**: When an admin updates clinic content, invoke `revalidatePath()` via `/api/revalidate` so public pages update immediately without full rebuilds.
5. **Storage & Image Optimization**: Firebase Storage (Blaze plan). Compress images on client before upload (max 1600px width/height, WebP format). Only admins can upload files.
6. **Email Notifications**: Resend API dispatches instantaneous alerts to the clinic notification inbox upon new appointment requests and contact submissions.
7. **Hosting**: Vercel (Edge network, global CDN, automated deployments).
8. **Privacy Compliance (India DPDP Act 2023)**: Mandatory explicit consent checkbox on all submission forms, accessible privacy policy page, and minimal necessary data collection.

---

## 6. Non-Functional Requirements

- **Mobile-First & 4G Performance**: Optimized asset bundles, responsive layouts, Lighthouse score 90+.
- **SEO & Discoverability**: Comprehensive metadata, Open Graph cards, dynamic `sitemap.xml`, `robots.txt`, and structured `MedicalClinic` / `LocalBusiness` / `FAQPage` JSON-LD schemas.
- **Accessibility (a11y)**: Focus rings, semantic HTML5 tags, high-contrast text ratios, full keyboard navigation, `prefers-reduced-motion` compliance.
- **Target Scale**: ~1,000–5,000 visitors/day, ~20–100 consultation requests/day.

---

## 7. Build Steps Roadmap

1. **System design & setup** *(Completed)*
2. **Architecture & config** *(Completed)*
3. **Frontend**
4. **APIs & backend logic**
5. **Database & storage**
6. **Auth & permissions**
7. **Hosting & cloud**
8. **CI/CD & version control**
9. **Security**
10. **Rate limiting**
11. **Caching & CDN**
12. **Error tracking & logs**
13. **Monitoring & alerts**
14. **Testing**
15. **Scaling**
16. **SEO, performance, launch checklist**

---

## 8. Step 2 - Architecture

### 8.1 System Architecture Diagram

```text
+-------------------------------------------------------------------------+
|                              CLIENT BROWSER                             |
|  +--------------------+     +-------------------+     +---------------+  |
|  |  Public Patient UI |     | Admin Dashboard   |     | Image Upload  |  |
|  |  (Next.js SSR/ISR) |     | (Protected /admin)|     | (Client SDK)  |  |
|  +---------+----------+     +---------+---------+     +-------+-------+  |
+------------|--------------------------|-----------------------|---------+
             |                          |                       |
      HTTP POST (Zod)              Session Cookie         Firebase Storage
             |                          |                  /public/**
             v                          v                  (Admin role)
+-------------------------------------------------------+       |
|                  NEXT.JS SERVER RUNTIME               |       |
|  +-------------------------------------------------+  |       |
|  | Middleware: protects /admin/* (except login)    |  |       |
|  +-------------------------------------------------+  |       |
|  | API Handlers (/api/appointments, /api/contact)  |  |       |
|  |  - Validates input with Zod + honeypot check    |  |       |
|  |  - Protected serverEnv via "server-only"        |  |       |
|  |  - Standard ok() / fail() response envelope     |  |       |
|  +-------------------------+-----------------------+  |       |
+----------------------------|--------------------------+       |
                             |                                  |
              +--------------+---------------+                  |
              |                              |                  |
              v                              v                  v
+---------------------------+  +---------------------------+  +--------+
|   FIREBASE FIRESTORE      |  |        RESEND API         |  | FIRE-  |
| (via Firebase Admin SDK)  |  | (Staff Email Alert)       |  | BASE   |
| - appointments (new)      |  | - Direct notification     |  | STORAGE|
| - contactMessages         |  |   to clinic inbox         |  +--------+
| - settings, services, etc.|  +---------------------------+
+---------------------------+
```

### 8.2 Data Flow for Booking Request

```
1. [Patient Form]
   │
   │ Submits: name, 10-digit Indian phone, preferredDate (optional <= 60d),
   │ preferredTime ("morning"|"evening"|"any"), service (optional),
   │ message (optional), consent=true (DPDP 2023), website="" (honeypot)
   ▼
2. [POST /api/appointments]
   │
   │ Evaluated by appointmentRequestSchema (Zod)
   │ If honeypot filled or invalid payload ──> returns fail("VALIDATION_ERROR", ..., 400)
   ▼
3. [Firestore Persistence via Admin SDK]
   │
   │ getAppointmentsCollection().add(...)
   │ Status set to: "new"
   │ Timestamps set: createdAt, updatedAt (Firestore ServerTimestamp)
   ▼
4. [Email Alert via Resend]
   │
   │ Dispatches internal notification email to CLINIC_NOTIFY_EMAIL
   │ Contains patient name, sanitized phone, and preferred window
   ▼
5. [Client Response]
   │
   │ Returns ok({ message: "Appointment request received...", ... })
   │ Client UI presents confirmation toast/modal
   ▼
6. [Staff Callback Workflow]
   │
   │ Staff accesses /admin/appointments
   │ Lifecycle progression: [new] ──> [called] ──> [confirmed] ──> [visited]
```

### 8.3 File Map of Architecture Components

| File Path | Purpose |
|---|---|
| [`lib/env.client.ts`](file:///Users/nishantsingh/clinic-website/lib/env.client.ts) | Client environment validator for `NEXT_PUBLIC_*` variables. Inlined at build time. |
| [`lib/env.server.ts`](file:///Users/nishantsingh/clinic-website/lib/env.server.ts) | Server-only secrets validator (`import "server-only"`). Replaces escaped newlines in private key. |
| [`lib/env.ts`](file:///Users/nishantsingh/clinic-website/lib/env.ts) | Central environment export hub with compile-time client boundary protection. |
| [`lib/types.ts`](file:///Users/nishantsingh/clinic-website/lib/types.ts) | Canonical shared models (`Appointment`, `ContactMessage`, `Service`, etc.) supporting Firestore `Timestamp` on server and `string` on client. |
| [`lib/validators/appointment.ts`](file:///Users/nishantsingh/clinic-website/lib/validators/appointment.ts) | Zod validator for appointment requests: Indian mobile sanitization, 60-day date boundary, consent, and honeypot. |
| [`lib/validators/contact.ts`](file:///Users/nishantsingh/clinic-website/lib/validators/contact.ts) | Zod validator for inquiries: name, phone, email, message length, consent, and honeypot. |
| [`lib/firebase/client.ts`](file:///Users/nishantsingh/clinic-website/lib/firebase/client.ts) | Firebase Client SDK singleton with lazy proxy getters for `auth`, `db`, and `storage`. |
| [`lib/firebase/admin.ts`](file:///Users/nishantsingh/clinic-website/lib/firebase/admin.ts) | Firebase Admin SDK singleton initialized with `cert()`. Dual callable + property exports for `adminDb`, `adminAuth`, `adminStorage`. |
| [`lib/firebase/collections.ts`](file:///Users/nishantsingh/clinic-website/lib/firebase/collections.ts) | Typed collection names, Firestore data converters (`toFirestore`/`fromFirestore`), and query helpers. |
| [`lib/api.ts`](file:///Users/nishantsingh/clinic-website/lib/api.ts) | Standardized API response envelopes: `ok(data)` and `fail(code, message, status)`. |
| [`lib/utils.ts`](file:///Users/nishantsingh/clinic-website/lib/utils.ts) | Utilities: `cn()`, `formatDate` (`Asia/Kolkata` IST timezone), `formatPhone` (`+91` format). |
| [`styles/tokens.css`](file:///Users/nishantsingh/clinic-website/styles/tokens.css) | Material You (M3) CSS variables: colors, radiuses (`xs` to `3xl`), and motion easing/durations. |
| [`app/globals.css`](file:///Users/nishantsingh/clinic-website/app/globals.css) | Tailwind v4 `@theme` mappings, responsive type scales (`display-lg` to `label-sm`), and `prefers-reduced-motion`. |
| [`middleware.ts`](file:///Users/nishantsingh/clinic-website/middleware.ts) | Edge session gate protecting `/admin/*` routes. Redirects unauthenticated visitors to `/admin/login`. |
| [`firestore.rules`](file:///Users/nishantsingh/clinic-website/firestore.rules) | Locked down security rules: default deny, role-based read for appointments/messages, admin-only writes. |
| [`storage.rules`](file:///Users/nishantsingh/clinic-website/storage.rules) | Cloud Storage rules: public read on `/public/**`, admin-only upload, 5MB image filter. |
| [`firebase.json`](file:///Users/nishantsingh/clinic-website/firebase.json) & [`.firebaserc`](file:///Users/nishantsingh/clinic-website/.firebaserc) | Firebase CLI deployment configuration. |
| [`app/api/health/route.ts`](file:///Users/nishantsingh/clinic-website/app/api/health/route.ts) | System health endpoint pinging Firestore without exposing secrets. |
