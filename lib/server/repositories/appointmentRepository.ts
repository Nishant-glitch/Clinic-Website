import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAppointmentsCollection } from "@/lib/firebase/collections";
import { adminDb } from "@/lib/firebase/admin";
import type {
  ServerAppointment,
  AppointmentStatus,
  AppointmentActivity,
} from "@/lib/types";
import { AppError } from "@/lib/server/errors";

export interface AppointmentFilters {
  status?: AppointmentStatus | "all";
  service?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  q?: string;
  cursor?: string;
  limit?: number;
}

export interface ListAppointmentsResult {
  appointments: ServerAppointment[];
  nextCursor?: string;
  totalCount: number;
  statusCounts: Record<AppointmentStatus | "all", number>;
}

export async function createAppointment(
  data: Omit<ServerAppointment, "id" | "createdAt" | "updatedAt">
): Promise<ServerAppointment> {
  const collection = getAppointmentsCollection();
  const docRef = collection.doc();

  const record: Record<string, unknown> = {
    ...data,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Remove undefined properties
  for (const key of Object.keys(record)) {
    if (record[key] === undefined) {
      delete record[key];
    }
  }

  await docRef.set(record as unknown as ServerAppointment);

  return {
    ...data,
    id: docRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export async function findRecentByPhone(
  phone: string,
  withinMinutes = 10
): Promise<ServerAppointment | null> {
  try {
    const collection = getAppointmentsCollection();
    const cutoffMs = Date.now() - withinMinutes * 60 * 1000;

    const snapshot = await collection
      .where("phone", "==", phone)
      .limit(10)
      .get();

    if (snapshot.empty) return null;

    const matches = snapshot.docs
      .map((d) => d.data())
      .filter((a) => {
        if (a.status !== "new") return false;
        const createdMs = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        return createdMs >= cutoffMs;
      });

    return matches[0] ?? null;
  } catch (err) {
    console.warn("[findRecentByPhone] Warning:", err);
    return null;
  }
}

export async function findByIdempotencyKey(
  key: string
): Promise<ServerAppointment | null> {
  const collection = getAppointmentsCollection();
  const snapshot = await collection
    .where("idempotencyKey", "==", key)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

export async function getAppointmentById(
  id: string
): Promise<ServerAppointment | null> {
  const collection = getAppointmentsCollection();
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return doc.data() ?? null;
}

export async function listAppointments(
  filters: AppointmentFilters = {}
): Promise<ListAppointmentsResult> {
  const collection = getAppointmentsCollection();
  const limit = Math.min(filters.limit || 20, 100);

  // Retrieve status counts and items
  const allSnapshot = await collection.orderBy("createdAt", "desc").get();
  const allDocs = allSnapshot.docs.map((d) => d.data());

  const statusCounts: Record<AppointmentStatus | "all", number> = {
    all: allDocs.length,
    new: 0,
    called: 0,
    confirmed: 0,
    visited: 0,
    cancelled: 0,
  };

  for (const doc of allDocs) {
    if (statusCounts[doc.status] !== undefined) {
      statusCounts[doc.status]++;
    }
  }

  // Filter in memory for robust multi-field search and query combination
  let filtered = allDocs;

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((a) => a.status === filters.status);
  }

  if (filters.service && filters.service !== "all") {
    filtered = filtered.filter((a) => a.service?.toLowerCase() === filters.service?.toLowerCase());
  }

  if (filters.from) {
    const fromDate = new Date(`${filters.from}T00:00:00+05:30`);
    filtered = filtered.filter((a) => {
      const created = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
      return created >= fromDate;
    });
  }

  if (filters.to) {
    const toDate = new Date(`${filters.to}T23:59:59+05:30`);
    filtered = filtered.filter((a) => {
      const created = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
      return created <= toDate;
    });
  }

  if (filters.q) {
    const query = filters.q.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.phone.includes(query) ||
        a.reference?.toLowerCase().includes(query)
    );
  }

  const totalCount = filtered.length;

  // Pagination with cursor
  let startIndex = 0;
  if (filters.cursor) {
    const cursorIndex = filtered.findIndex((a) => a.id === filters.cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const pagedItems = filtered.slice(startIndex, startIndex + limit);
  const nextCursor =
    startIndex + limit < filtered.length ? pagedItems[pagedItems.length - 1]?.id : undefined;

  return {
    appointments: pagedItems,
    nextCursor,
    totalCount,
    statusCounts,
  };
}

export async function updateAppointment(
  id: string,
  patch: Partial<ServerAppointment>
): Promise<void> {
  const docRef = getAppointmentsCollection().doc(id);
  const updateData: Record<string, unknown> = {
    ...patch,
    updatedAt: FieldValue.serverTimestamp(),
  };
  delete updateData.id;
  await docRef.update(updateData);
}

/**
 * Validates allowed status progression lifecycle.
 */
export function validateStatusTransition(
  currentStatus: AppointmentStatus,
  newStatus: AppointmentStatus,
  userRole: string
): void {
  if (currentStatus === newStatus) return;

  const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    new: ["called", "cancelled"],
    called: ["confirmed", "cancelled"],
    confirmed: ["visited", "cancelled"],
    visited: ["cancelled"],
    cancelled: ["new"], // Reopening cancelled is admin only
  };

  const allowed = allowedTransitions[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      "INVALID_STATUS_TRANSITION",
      `Cannot transition appointment from '${currentStatus}' to '${newStatus}'`,
      400
    );
  }

  if (currentStatus === "cancelled" && newStatus === "new" && userRole !== "admin") {
    throw new AppError(
      "FORBIDDEN",
      "Only administrators can reopen a cancelled appointment",
      403
    );
  }
}

/**
 * Updates an appointment inside a Firestore transaction, appending an activity entry
 * and enforcing valid status transitions.
 */
export async function updateAppointmentWithActivity(
  id: string,
  patch: { status?: AppointmentStatus; notes?: string },
  actor: { uid: string; name: string; role: string }
): Promise<ServerAppointment> {
  const docRef = getAppointmentsCollection().doc(id);

  return adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(docRef);
    if (!doc.exists) {
      throw new AppError("NOT_FOUND", `Appointment ${id} not found`, 404);
    }

    const current = doc.data()!;
    const nowIso = new Date().toISOString();
    const newActivities: AppointmentActivity[] = [...(current.activity || [])];

    if (patch.status && patch.status !== current.status) {
      validateStatusTransition(current.status, patch.status, actor.role);

      newActivities.push({
        id: crypto.randomUUID(),
        type: "status_change",
        description: `Status changed from ${current.status} to ${patch.status}`,
        userName: actor.name,
        timestamp: nowIso,
      });
    }

    if (patch.notes !== undefined && patch.notes !== current.notes) {
      newActivities.push({
        id: crypto.randomUUID(),
        type: "note",
        description: `Staff notes updated`,
        userName: actor.name,
        timestamp: nowIso,
      });
    }

    const updatePayload: Record<string, unknown> = {
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      activity: newActivities,
      updatedAt: FieldValue.serverTimestamp(),
    };

    tx.update(docRef, updatePayload);

    return {
      ...current,
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      activity: newActivities,
      updatedAt: Timestamp.now(),
    };
  });
}

/**
 * Bulk updates multiple appointments status (admin only).
 */
export async function bulkUpdateAppointments(
  ids: string[],
  newStatus: AppointmentStatus,
  actor: { name: string }
): Promise<void> {
  const collection = getAppointmentsCollection();
  const batch = adminDb.batch();
  const nowIso = new Date().toISOString();

  for (const id of ids) {
    const ref = collection.doc(id);
    const activityEntry: AppointmentActivity = {
      id: crypto.randomUUID(),
      type: "status_change",
      description: `Bulk status update to ${newStatus}`,
      userName: actor.name,
      timestamp: nowIso,
    };

    batch.update(ref, {
      status: newStatus,
      activity: FieldValue.arrayUnion(activityEntry),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
}
