# Clinic Platform API Reference

This document provides a comprehensive reference of all public and administrative REST API endpoints implemented in **Step 4: APIs & Backend Logic**.

---

## 1. Global Standards & Conventions

- **Base URL**: `/api`
- **Envelope Format**:
  - **Success (2xx)**: `{ "success": true, "data": ... }`
  - **Error (4xx / 5xx)**: `{ "success": false, "error": { "code": string, "message": string, "details"?: unknown } }`
- **Request Tracing**: Every response includes an `x-request-id` header (UUIDv4) for auditability.
- **Error Hygiene**: Internal database errors, environment variables, and stack traces are never exposed to clients; unhandled exceptions are logged server-side with their `x-request-id` and return `500 INTERNAL_ERROR`.
- **RBAC**: Handled server-side with `requireRole(request, ["admin" | "staff"])`.
- **Dev Bypass**: In `development` mode with `ADMIN_DEV_BYPASS=true`, returns a mock dev user or respects `x-dev-role` header. In `production`, this bypass is strictly disabled.

---

## 2. Public Endpoints

| Method | Path | Role | Description | Request Body | Success Response | Error Codes |
|---|---|---|---|---|---|---|
| `POST` | `/api/appointments` | Public | Submit consultation booking request | JSON (max 10KB): `name`, `phone`, `preferredDate?`, `preferredTime`, `service?`, `message?`, `consent=true`, `website=""` (honeypot) | `201 Created`: `{ reference: "APT-YYMMDD-XXXX", message: string, isDuplicate?: boolean }` | `400 VALIDATION_ERROR`, `413 PAYLOAD_TOO_LARGE`, `415 UNSUPPORTED_MEDIA_TYPE` |
| `POST` | `/api/contact` | Public | Submit patient inquiry message | JSON (max 10KB): `name`, `phone`, `email?`, `message`, `consent=true`, `website=""` (honeypot) | `201 Created`: `{ reference: "MSG-YYMMDD-XXXX", message: string }` | `400 VALIDATION_ERROR`, `413 PAYLOAD_TOO_LARGE`, `415 UNSUPPORTED_MEDIA_TYPE` |
| `GET` | `/api/public/services` | Public | Read-only active services list (`s-maxage=300`) | None | `200 OK`: `Service[]` | `404 NOT_FOUND` |
| `GET` | `/api/public/testimonials` | Public | Read-only verified reviews (`s-maxage=300`) | None | `200 OK`: `Testimonial[]` | `404 NOT_FOUND` |
| `GET` | `/api/public/faqs` | Public | Read-only active FAQs (`s-maxage=300`) | None | `200 OK`: `Faq[]` | `404 NOT_FOUND` |
| `GET` | `/api/public/gallery` | Public | Read-only gallery images (`s-maxage=300`) | None | `200 OK`: `GalleryImage[]` | `404 NOT_FOUND` |
| `GET` | `/api/public/settings` | Public | Read-only clinic identity & timings (`s-maxage=300`) | None | `200 OK`: `ClinicSettings` | `404 NOT_FOUND` |

---

## 3. Admin: Appointments

| Method | Path | Role | Description | Query / Body Schema | Success Response | Error Codes |
|---|---|---|---|---|---|---|
| `GET` | `/api/admin/appointments` | `admin`, `staff` | Paginated & filtered appointment list | Query: `status`, `service`, `from`, `to`, `q`, `cursor`, `limit` | `200 OK`: `{ appointments: Appointment[], totalCount: number, statusCounts: Record<string, number>, nextCursor?: string }` | `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `GET` | `/api/admin/appointments/[id]` | `admin`, `staff` | Get single appointment details | None | `200 OK`: `Appointment` | `401 UNAUTHORIZED`, `404 NOT_FOUND` |
| `PATCH` | `/api/admin/appointments/[id]` | `admin`, `staff` | Update status and/or internal notes | Body: `{ status?: AppointmentStatus, notes?: string }` | `200 OK`: `Appointment` (updated with appended activity audit log) | `400 INVALID_STATUS_TRANSITION`, `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `POST` | `/api/admin/appointments/bulk` | `admin` | Bulk update status (max 50) | Body: `{ ids: string[], status: AppointmentStatus }` | `200 OK`: `{ success: true, count: number, status: string }` | `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `GET` | `/api/admin/appointments/export` | `admin` | Download filtered appointments as CSV | Query: `status`, `service`, `from`, `to`, `q` | `200 OK` (Stream: `text/csv`, injection-sanitized with leading `'`) | `401 UNAUTHORIZED`, `403 FORBIDDEN` |

---

## 4. Admin: Messages

| Method | Path | Role | Description | Query / Body Schema | Success Response | Error Codes |
|---|---|---|---|---|---|---|
| `GET` | `/api/admin/messages` | `admin`, `staff` | List inquiries with unread/search filter | Query: `unread`, `q`, `cursor`, `limit` | `200 OK`: `{ messages: ContactMessage[], unreadCount: number, totalCount: number, nextCursor?: string }` | `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `GET` | `/api/admin/messages/[id]` | `admin`, `staff` | Get single message details | None | `200 OK`: `ContactMessage` | `401 UNAUTHORIZED`, `404 NOT_FOUND` |
| `PATCH` | `/api/admin/messages/[id]` | `admin`, `staff` | Mark message read / unread | Body: `{ read: boolean }` | `200 OK`: `{ success: true, id: string, read: boolean }` | `400 VALIDATION_ERROR`, `401 UNAUTHORIZED` |
| `DELETE` | `/api/admin/messages/[id]` | `admin` | Delete contact inquiry | None | `200 OK`: `{ success: true, id: string }` | `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND` |

---

## 5. Admin: Content Management (`services`, `gallery`, `testimonials`, `faqs`)

| Method | Path | Role | Description | Request Body | Success Response | Revalidation Tag & Paths |
|---|---|---|---|---|---|---|
| `GET` | `/api/admin/content/[type]` | `admin` | List all items for content type | None | `200 OK`: `Array<Item>` | N/A |
| `POST` | `/api/admin/content/[type]` | `admin` | Create new content record | Zod schema matching content type | `201 Created`: `Item` | `services`, `gallery`, `testimonials`, `faqs` |
| `GET` | `/api/admin/content/[type]/[id]` | `admin` | Get specific content item | None | `200 OK`: `Item` | N/A |
| `PATCH` | `/api/admin/content/[type]/[id]` | `admin` | Partial update of content record | Partial Zod schema | `200 OK`: `Item` | `services`, `gallery`, `testimonials`, `faqs` |
| `DELETE` | `/api/admin/content/[type]/[id]` | `admin` | Delete content record (also purges Storage file for gallery) | None | `200 OK`: `{ success: true, id, type }` | `services`, `gallery`, `testimonials`, `faqs` |
| `POST` | `/api/admin/content/[type]/reorder` | `admin` | Batch update order fields | `{ ids: string[] }` | `200 OK`: `{ success: true, type, count }` | Matching tag + public pages |

---

## 6. Admin: Settings, Dashboard & Users

| Method | Path | Role | Description | Request Body | Success Response | Error Codes |
|---|---|---|---|---|---|---|
| `GET` | `/api/admin/settings` | `admin` | Get clinic settings document | None | `200 OK`: `ClinicSettings` | `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `PUT` | `/api/admin/settings` | `admin` | Update clinic settings document | `ClinicSettings` schema (strict timings, https socials, google maps embed) | `200 OK`: `ClinicSettings` | `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `GET` | `/api/admin/stats` | `admin`, `staff` | Real-time operational dashboard metrics | None | `200 OK`: `{ newToday, pendingCallbacks, confirmedThisWeek, unreadMessages, dailyRequests }` | `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `GET` | `/api/admin/users` | `admin` | List staff/admin accounts | None | `200 OK`: `AppUser[]` | `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `POST` | `/api/admin/users/invite` | `admin` | Invite new staff member | `{ email: string, role: "admin" \| "staff", name?: string }` | `201 Created`: `AppUser` | `400 USER_EXISTS`, `401 UNAUTHORIZED`, `403 FORBIDDEN` |
| `PATCH` | `/api/admin/users/[id]` | `admin` | Update role or active status | `{ role?: "admin" \| "staff", status?: "active" \| "disabled" }` | `200 OK`: `{ success: true, id, ... }` | `400 SELF_ROLE_CHANGE_FORBIDDEN`, `400 SELF_DISABLE_FORBIDDEN` |
