import "server-only";
import type { AppointmentRequestOutput } from "@/lib/validators/appointment";
import * as repo from "@/lib/server/repositories/appointmentRepository";
import { generateReference, normalizeName, normalizePhone, toCsvString } from "@/lib/server/utils";
import { sendAppointmentNotificationEmail } from "@/lib/email";
import type { AppointmentStatus, ServerAppointment } from "@/lib/types";

export interface CreateAppointmentOptions {
  idempotencyKey?: string | null;
}

export async function createAppointmentRequest(
  input: AppointmentRequestOutput,
  options: CreateAppointmentOptions = {}
): Promise<{ reference: string; isDuplicate?: boolean }> {
  // 1. Honeypot check: If bot filled the hidden website field, return fake success without saving
  if (input.website && input.website.trim().length > 0) {
    console.warn("[Bot Honeypot] Caught bot appointment submission with website field filled.");
    return { reference: "APT-OK-200" };
  }

  const phone = normalizePhone(input.phone);
  const name = normalizeName(input.name);

  // 2. Idempotency Key check: If header provided and already processed, return existing
  if (options.idempotencyKey) {
    const existingKey = await repo.findByIdempotencyKey(options.idempotencyKey);
    if (existingKey && existingKey.reference) {
      return { reference: existingKey.reference };
    }
  }

  // 3. Duplicate guard: Same phone number with status 'new' created in the last 10 minutes
  const recentAppointment = await repo.findRecentByPhone(phone, 10);
  if (recentAppointment && recentAppointment.reference) {
    console.info(`[Duplicate Guard] Reusing recent appointment ${recentAppointment.reference} for phone ${phone}`);
    return { reference: recentAppointment.reference, isDuplicate: true };
  }

  // 4. Generate reference code
  const reference = generateReference("APT");
  const nowIso = new Date().toISOString();

  // 5. Persist to Firestore
  const newAppointment = await repo.createAppointment({
    reference,
    name,
    phone,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    service: input.service || "General Consultation",
    message: input.message,
    consent: true,
    consentAt: nowIso,
    privacyPolicyVersion: "1.0",
    source: input.source || "website",
    idempotencyKey: options.idempotencyKey || undefined,
    status: "new",
    emailStatus: "sent",
    activity: [
      {
        id: crypto.randomUUID(),
        type: "created",
        description: `Consultation request submitted from ${input.source || "website"}`,
        userName: "Patient",
        timestamp: nowIso,
      },
    ],
  });

  // 6. Non-blocking clinic notification email
  void (async () => {
    try {
      const emailRes = await sendAppointmentNotificationEmail({
        reference,
        name,
        phone,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        service: input.service,
        message: input.message,
      });

      if (!emailRes.success) {
        await repo.updateAppointment(newAppointment.id, { emailStatus: "failed" });
      }
    } catch (err) {
      console.error("[Email Notification Error]:", err);
      await repo.updateAppointment(newAppointment.id, { emailStatus: "failed" });
    }
  })();

  return { reference };
}

export async function listAppointments(filters: repo.AppointmentFilters) {
  return repo.listAppointments(filters);
}

export async function getAppointment(id: string) {
  return repo.getAppointmentById(id);
}

export async function updateAppointment(
  id: string,
  patch: { status?: AppointmentStatus; notes?: string },
  actor: { uid: string; name: string; role: string }
) {
  return repo.updateAppointmentWithActivity(id, patch, actor);
}

export async function bulkUpdateAppointments(
  ids: string[],
  status: AppointmentStatus,
  actor: { name: string }
) {
  return repo.bulkUpdateAppointments(ids, status, actor);
}

export async function exportAppointmentsCsv(filters: repo.AppointmentFilters): Promise<string> {
  const result = await repo.listAppointments({ ...filters, limit: 1000 });
  const headers = [
    "Reference",
    "Patient Name",
    "Phone",
    "Service",
    "Preferred Date",
    "Preferred Time",
    "Status",
    "Source",
    "Staff Notes",
    "Created At",
  ];

  const rows = result.appointments.map((a: ServerAppointment) => {
    const createdDate = a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : "";
    return [
      a.reference || a.id,
      a.name,
      `+91 ${a.phone}`,
      a.service || "General Consultation",
      a.preferredDate || "",
      a.preferredTime,
      a.status,
      a.source || "website",
      a.notes || "",
      createdDate,
    ];
  });

  return toCsvString(headers, rows);
}
