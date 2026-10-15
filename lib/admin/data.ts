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

export interface AppointmentFilters {
  status?: AppointmentStatus | "all" | string;
  service?: string;
  from?: string;
  to?: string;
  search?: string;
  q?: string;
  sortBy?: "date" | "name" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  pageSize?: number;
}

export interface ListAppointmentsResponse {
  appointments: ClientAppointment[];
  total: number;
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
  counts: Record<string, number>;
  statusCounts: Record<AppointmentStatus | "all", number>;
  nextCursor?: string;
}

export interface ListMessagesResponse {
  messages: ClientContactMessage[];
  unreadCount: number;
  totalCount: number;
  nextCursor?: string;
}

export interface DashboardStats {
  newToday: number;
  pendingCallbacks: number;
  confirmedThisWeek: number;
  unreadMessages: number;
  needsCall: ClientAppointment[];
  recentMessages: ClientContactMessage[];
  dailyRequests: Array<{ date: string; label: string; count: number }>;
}

/**
 * Universal client fetcher for /api/admin endpoints.
 * Handles dev-role headers, authentication redirects (401), and permission errors (403).
 */
async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  // In development, send client-selected dev role header
  if (typeof window !== "undefined") {
    const devRole = localStorage.getItem("clinic_admin_role") || "admin";
    headers.set("x-dev-role", devRole);
  }

  if (!headers.has("Content-Type") && init?.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Authentication required. Please log in.");
  }

  if (response.status === 403) {
    throw new Error("Permission denied. This action requires administrative privileges.");
  }

  const json = await response.json();

  if (!response.ok || !json.success) {
    const errorMsg = json.error?.message || "An unexpected error occurred.";
    throw new Error(errorMsg);
  }

  return json.data as T;
}

// ==========================================
// APPOINTMENTS
// ==========================================

export async function listAppointments(
  filters: AppointmentFilters = {}
): Promise<ListAppointmentsResponse> {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.service && filters.service !== "all") params.set("service", filters.service);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const query = filters.q || filters.search;
  if (query) params.set("q", query);
  const limit = filters.limit || filters.pageSize || 20;
  params.set("limit", String(limit));

  const result = await apiFetch<{
    appointments: ClientAppointment[];
    totalCount: number;
    statusCounts: Record<AppointmentStatus | "all", number>;
    nextCursor?: string;
  }>(`/api/admin/appointments?${params.toString()}`);

  const page = filters.page || 1;
  const total = result.totalCount || result.appointments?.length || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    appointments: result.appointments || [],
    total,
    totalCount: total,
    totalPages,
    page,
    limit,
    counts: result.statusCounts || {},
    statusCounts: result.statusCounts || {},
    nextCursor: result.nextCursor,
  };
}

export async function getAppointment(id: string): Promise<ClientAppointment | null> {
  return apiFetch<ClientAppointment>(`/api/admin/appointments/${id}`);
}

export async function updateAppointment(
  id: string,
  patch: Partial<ClientAppointment>
): Promise<ClientAppointment> {
  return apiFetch<ClientAppointment>(`/api/admin/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: patch.status,
      notes: patch.notes,
    }),
  });
}

export async function bulkUpdateAppointmentStatus(
  ids: string[],
  status: AppointmentStatus
): Promise<void> {
  await apiFetch(`/api/admin/appointments/bulk`, {
    method: "POST",
    body: JSON.stringify({ ids, status }),
  });
}

// ==========================================
// MESSAGES
// ==========================================

export async function listMessages(
  filters: { unreadOnly?: boolean; search?: string } = {}
): Promise<ClientContactMessage[]> {
  const params = new URLSearchParams();
  if (filters.unreadOnly) params.set("unread", "true");
  if (filters.search) params.set("q", filters.search);

  const res = await apiFetch<{
    messages: ClientContactMessage[];
    unreadCount: number;
    totalCount: number;
  }>(`/api/admin/messages?${params.toString()}`);

  return res.messages || [];
}

export async function markMessageRead(
  id: string,
  read = true
): Promise<ClientContactMessage> {
  await apiFetch(`/api/admin/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  });
  return { id, read } as unknown as ClientContactMessage;
}

export async function deleteMessage(id: string): Promise<void> {
  await apiFetch(`/api/admin/messages/${id}`, {
    method: "DELETE",
  });
}

// ==========================================
// SERVICES
// ==========================================

export async function listServices(): Promise<ClientService[]> {
  return apiFetch<ClientService[]>("/api/admin/content/services");
}

export async function getService(id: string): Promise<ClientService | null> {
  return apiFetch<ClientService>(`/api/admin/content/services/${id}`);
}

export async function createService(
  service: Omit<ClientService, "id">
): Promise<ClientService> {
  return apiFetch<ClientService>("/api/admin/content/services", {
    method: "POST",
    body: JSON.stringify(service),
  });
}

export async function updateService(
  id: string,
  patch: Partial<ClientService>
): Promise<ClientService> {
  return apiFetch<ClientService>(`/api/admin/content/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch(`/api/admin/content/services/${id}`, {
    method: "DELETE",
  });
}

export async function reorderServices(ids: string[]): Promise<ClientService[]> {
  await apiFetch("/api/admin/content/services/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return listServices();
}

// ==========================================
// TESTIMONIALS
// ==========================================

export async function listTestimonials(): Promise<Testimonial<string>[]> {
  return apiFetch<Testimonial<string>[]>("/api/admin/content/testimonials");
}

export async function createTestimonial(
  testimonial: Omit<Testimonial<string>, "id">
): Promise<Testimonial<string>> {
  return apiFetch<Testimonial<string>>("/api/admin/content/testimonials", {
    method: "POST",
    body: JSON.stringify(testimonial),
  });
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Testimonial<string>>
): Promise<Testimonial<string>> {
  return apiFetch<Testimonial<string>>(`/api/admin/content/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiFetch(`/api/admin/content/testimonials/${id}`, {
    method: "DELETE",
  });
}

export async function reorderTestimonials(ids: string[]): Promise<Testimonial<string>[]> {
  await apiFetch("/api/admin/content/testimonials/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return listTestimonials();
}

// ==========================================
// FAQS
// ==========================================

export async function listFaqs(): Promise<Faq[]> {
  return apiFetch<Faq[]>("/api/admin/content/faqs");
}

export async function createFaq(faq: Omit<Faq, "id">): Promise<Faq> {
  return apiFetch<Faq>("/api/admin/content/faqs", {
    method: "POST",
    body: JSON.stringify(faq),
  });
}

export async function updateFaq(id: string, patch: Partial<Faq>): Promise<Faq> {
  return apiFetch<Faq>(`/api/admin/content/faqs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteFaq(id: string): Promise<void> {
  await apiFetch(`/api/admin/content/faqs/${id}`, {
    method: "DELETE",
  });
}

export async function reorderFaqs(ids: string[]): Promise<Faq[]> {
  await apiFetch("/api/admin/content/faqs/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return listFaqs();
}

// ==========================================
// GALLERY
// ==========================================

export async function listGalleryImages(): Promise<GalleryImage<string>[]> {
  return apiFetch<GalleryImage<string>[]>("/api/admin/content/gallery");
}

export async function createGalleryImage(
  image: Omit<GalleryImage<string>, "id">
): Promise<GalleryImage<string>> {
  return apiFetch<GalleryImage<string>>("/api/admin/content/gallery", {
    method: "POST",
    body: JSON.stringify(image),
  });
}

export async function updateGalleryImage(
  id: string,
  patch: Partial<GalleryImage<string>>
): Promise<GalleryImage<string>> {
  return apiFetch<GalleryImage<string>>(`/api/admin/content/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await apiFetch(`/api/admin/content/gallery/${id}`, {
    method: "DELETE",
  });
}

export async function reorderGalleryImages(ids: string[]): Promise<GalleryImage<string>[]> {
  await apiFetch("/api/admin/content/gallery/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return listGalleryImages();
}

// ==========================================
// CLINIC SETTINGS
// ==========================================

export async function getSettings(): Promise<ClientClinicSettings> {
  return apiFetch<ClientClinicSettings>("/api/admin/settings");
}

export async function updateSettings(
  patch: Partial<ClientClinicSettings>
): Promise<ClientClinicSettings> {
  return apiFetch<ClientClinicSettings>("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

// ==========================================
// USERS
// ==========================================

export async function listUsers(): Promise<ClientAppUser[]> {
  return apiFetch<ClientAppUser[]>("/api/admin/users");
}

export async function inviteUser(input: {
  email: string;
  role: Role;
  name?: string;
}): Promise<ClientAppUser> {
  return apiFetch<ClientAppUser>("/api/admin/users/invite", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateUserRole(
  uid: string,
  role: Role
): Promise<{ uid: string; role: Role; name: string }> {
  await apiFetch(`/api/admin/users/${uid}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  return { uid, role, name: "User" };
}

export async function disableUser(
  uid: string,
  disabled: boolean
): Promise<{ uid: string; status: "active" | "disabled"; name: string }> {
  const status: "active" | "disabled" = disabled ? "disabled" : "active";
  await apiFetch(`/api/admin/users/${uid}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return { uid, status, name: "User" };
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const [statsData, appointmentsRes, messagesRes] = await Promise.all([
    apiFetch<{
      newToday: number;
      pendingCallbacks: number;
      confirmedThisWeek: number;
      unreadMessages: number;
      dailyRequests: Array<{ date: string; label: string; count: number }>;
    }>("/api/admin/stats"),
    apiFetch<{ appointments: ClientAppointment[] }>("/api/admin/appointments?status=new&limit=5"),
    apiFetch<{ messages: ClientContactMessage[] }>("/api/admin/messages?limit=5"),
  ]);

  return {
    newToday: statsData.newToday,
    pendingCallbacks: statsData.pendingCallbacks,
    confirmedThisWeek: statsData.confirmedThisWeek,
    unreadMessages: statsData.unreadMessages,
    needsCall: appointmentsRes.appointments || [],
    recentMessages: messagesRes.messages || [],
    dailyRequests: statsData.dailyRequests || [],
  };
}
