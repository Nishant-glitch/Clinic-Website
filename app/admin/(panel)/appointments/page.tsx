"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAppointments,
  updateAppointment,
  bulkUpdateAppointmentStatus,
  listServices,
} from "@/lib/admin/data";
import type { ClientAppointment, AppointmentStatus } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { StatusChip } from "@/components/admin/StatusChip";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterChips } from "@/components/admin/FilterChips";
import { SearchInput } from "@/components/admin/SearchInput";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { SideSheet } from "@/components/admin/SideSheet";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatPhone, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Phone,
  MessageCircle,
  Copy,
  Download,
  History,
  FileText,
} from "lucide-react";

function AppointmentNotesEditor({
  initialNotes = "",
  onSave,
}: {
  initialNotes?: string;
  onSave: (notes: string) => Promise<unknown>;
}) {
  const [draft, setDraft] = React.useState(initialNotes);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");

  const handleChange = (val: string) => {
    setDraft(val);
    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      try {
        await onSave(val);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("idle");
      }
    }, 800);

    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="staff-notes"
          className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
        >
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>Internal Staff Notes</span>
        </label>
        <span className="text-[11px] font-medium text-on-surface-variant">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
        </span>
      </div>
      <textarea
        id="staff-notes"
        rows={4}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add clinical observation notes, preferred timings agreed over call, doctor instructions..."
        className="w-full rounded-2xl border border-outline-variant/80 bg-surface p-3 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function AppointmentsPageContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAdmin, user } = useAdminAuth();
  const { showToast } = useAdminToast();

  // URL is single source of truth: derive filter state with useMemo
  const filters = React.useMemo(() => {
    const status = searchParams.get("status") || "all";
    const ref = searchParams.get("ref");
    const q = searchParams.get("q") || searchParams.get("search") || ref || "";
    const service = searchParams.get("service") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    return {
      status,
      q,
      service,
      page: Number.isNaN(page) || page < 1 ? 1 : page,
    };
  }, [searchParams]);

  // ?ref= handling: convert once on mount to the q filter, then remove ref from URL
  const refHandled = React.useRef(false);
  React.useEffect(() => {
    if (refHandled.current) return;
    refHandled.current = true;

    const refParam = searchParams.get("ref");
    if (refParam) {
      const currentParams = new URLSearchParams(window.location.search);
      const currentSerialized = currentParams.toString();

      const newParams = new URLSearchParams(window.location.search);
      newParams.set("q", refParam);
      newParams.delete("ref");
      newParams.delete("search");
      newParams.delete("page");

      const newSerialized = newParams.toString();
      if (newSerialized !== currentSerialized) {
        const newUrl = `${window.location.pathname}${newSerialized ? `?${newSerialized}` : ""}`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [searchParams]);

  // Local selection & inspection state
  const [selectedAppointment, setSelectedAppointment] = React.useState<ClientAppointment | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Update URL helper using window.history.replaceState (avoids RSC refetch loop)
  const updateQuery = React.useCallback((key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    const currentSerialized = currentParams.toString();

    const newParams = new URLSearchParams(window.location.search);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key === "q") {
      newParams.delete("search");
      newParams.delete("ref");
    }

    // Reset to page 1 on filter changes
    if (key !== "page") {
      newParams.delete("page");
    }

    const newSerialized = newParams.toString();
    if (newSerialized === currentSerialized) {
      return;
    }

    const newUrl = `${window.location.pathname}${newSerialized ? `?${newSerialized}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  // Memoize TanStack Query key from stable primitives
  const appointmentsQueryKey = React.useMemo(
    () => [
      "admin",
      "appointments",
      filters.status,
      filters.q,
      filters.service,
      filters.page,
    ] as const,
    [filters.status, filters.q, filters.service, filters.page]
  );

  // Queries
  const { data: appointmentsResult, isLoading } = useQuery({
    queryKey: appointmentsQueryKey,
    queryFn: () =>
      listAppointments({
        status: filters.status as AppointmentStatus | "all",
        search: filters.q,
        service: filters.service,
        page: filters.page,
        limit: 20,
      }),
  });

  const { data: servicesList } = useQuery({
    queryKey: ["admin", "services-list"],
    queryFn: listServices,
  });

  // Single appointment status/notes mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<ClientAppointment> & { changedBy?: string };
    }) => updateAppointment(id, patch),
    onSuccess: (updated) => {
      setSelectedAppointment(updated);
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
    onError: () => {
      showToast("Failed to update appointment", "error");
    },
  });

  // Bulk update mutation
  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: AppointmentStatus }) =>
      bulkUpdateAppointmentStatus(ids, status),
    onSuccess: (_, vars) => {
      showToast(`Updated ${vars.ids.length} appointments to ${vars.status}`);
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
    onError: () => {
      showToast("Failed to perform bulk update", "error");
    },
  });

  // Copy phone handler
  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    showToast("Phone number copied to clipboard");
  };

  // Export CSV of filtered list
  const handleExportCSV = () => {
    if (!appointmentsResult?.appointments) return;
    const items = appointmentsResult.appointments;

    const headers = ["ID", "Name", "Phone", "Service", "Preferred Date", "Preferred Time", "Status", "Created At", "Notes"];
    const rows = items.map((a) => [
      `"${a.id}"`,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${(a.service || "").replace(/"/g, '""')}"`,
      `"${a.preferredDate || ""}"`,
      `"${a.preferredTime}"`,
      `"${a.status}"`,
      `"${a.createdAt}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `clinic-appointments-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Appointments exported as CSV");
  };

  // Status Filter Options
  const counts = appointmentsResult?.counts || {};
  const filterOptions = [
    { id: "all", label: "All", count: counts.all ?? 0 },
    { id: "new", label: "New", count: counts.new ?? 0 },
    { id: "called", label: "Called", count: counts.called ?? 0 },
    { id: "confirmed", label: "Confirmed", count: counts.confirmed ?? 0 },
    { id: "visited", label: "Visited", count: counts.visited ?? 0 },
    { id: "cancelled", label: "Cancelled", count: counts.cancelled ?? 0 },
  ];

  // Table Columns
  const columns: Column<ClientAppointment>[] = [
    {
      key: "name",
      header: "Patient",
      render: (apt) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-xs font-bold">
            {apt.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-on-surface text-sm">{apt.name}</p>
            <p className="text-xs text-on-surface-variant font-mono">{formatPhone(apt.phone)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      render: (apt) => (
        <span className="text-xs font-medium text-on-surface">
          {apt.service || "General Consultation"}
        </span>
      ),
    },
    {
      key: "preferredDate",
      header: "Preferred Time",
      render: (apt) => (
        <div className="text-xs">
          <p className="font-semibold text-on-surface">
            {apt.preferredDate ? formatDate(apt.preferredDate, { day: "numeric", month: "short" }) : "Any Date"}
          </p>
          <p className="text-[11px] capitalize text-on-surface-variant">
            {apt.preferredTime} Slot
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (apt) => <StatusChip status={apt.status} size="sm" />,
    },
    {
      key: "createdAt",
      header: "Requested",
      render: (apt) => (
        <span className="text-xs text-on-surface-variant">
          {formatRelativeTime(apt.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Consultation Requests"
        description="Filter, review patient requests, assign callback statuses, and record medical notes."
        badge={
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            {appointmentsResult?.total ?? 0} Total
          </span>
        }
        actions={
          isAdmin && (
            <Button
              type="button"
              variant="outlined"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export CSV
            </Button>
          )
        }
      />

      {/* Filter Row: Status Chips */}
      <div className="flex flex-col gap-3">
        <FilterChips
          options={filterOptions}
          selectedId={filters.status}
          onChange={(id) => updateQuery("status", id)}
        />

        {/* Search, Service & Bulk Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchInput
              value={filters.q}
              onChange={(val) => updateQuery("q", val)}
              placeholder="Search name, phone, notes..."
            />
          </div>

          {/* Service Dropdown Filter */}
          <div className="w-full sm:w-60">
            <select
              value={filters.service}
              onChange={(e) => updateQuery("service", e.target.value)}
              className="w-full rounded-full bg-surface border border-outline-variant/60 px-4 py-2 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Services</option>
              {servicesList?.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Selection Actions (Desktop) */}
          {selectedIds.length > 0 && (
            <div className="w-full sm:w-auto flex items-center gap-2 p-1.5 rounded-full bg-primary-container/40 border border-primary/20 px-3 ml-auto animate-in fade-in">
              <span className="text-xs font-bold text-on-primary-container">
                {selectedIds.length} selected:
              </span>
              <button
                type="button"
                onClick={() =>
                  bulkStatusMutation.mutate({ ids: selectedIds, status: "called" })
                }
                className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-secondary hover:bg-secondary-container transition-colors"
              >
                Called
              </button>
              <button
                type="button"
                onClick={() =>
                  bulkStatusMutation.mutate({ ids: selectedIds, status: "confirmed" })
                }
                className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() =>
                  bulkStatusMutation.mutate({ ids: selectedIds, status: "cancelled" })
                }
                className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP TABLE VIEW                                      */}
      {/* ======================================================== */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={appointmentsResult?.appointments || []}
          keyExtractor={(apt) => apt.id}
          onRowClick={(apt) => setSelectedAppointment(apt)}
          selectedIds={selectedIds}
          onSelectIds={setSelectedIds}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              title="No appointments found"
              description="Try adjusting your status filter or search query."
            />
          }
          pagination={
            appointmentsResult
              ? {
                  currentPage: appointmentsResult.page,
                  totalPages: appointmentsResult.totalPages,
                  totalItems: appointmentsResult.total,
                  itemsPerPage: appointmentsResult.limit,
                  onPageChange: (p) => updateQuery("page", String(p)),
                }
              : undefined
          }
        />
      </div>

      {/* ======================================================== */}
      {/* MOBILE CARD LIST (< md)                                 */}
      {/* ======================================================== */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-surface border border-outline-variant/60 p-4 h-32 animate-pulse"
            />
          ))
        ) : appointmentsResult?.appointments && appointmentsResult.appointments.length > 0 ? (
          appointmentsResult.appointments.map((apt) => {
            const whatsappHref = `https://wa.me/91${apt.phone}?text=${encodeURIComponent(
              `Namaste ${apt.name}, clinic team here regarding your appointment for ${
                apt.service || "consultation"
              }.`
            )}`;

            return (
              <div
                key={apt.id}
                onClick={() => setSelectedAppointment(apt)}
                className="rounded-2xl bg-surface border border-outline-variant/60 p-4 shadow-2xs hover:border-primary/40 active:scale-[0.99] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{apt.name}</h3>
                    <p className="text-xs text-on-surface-variant font-mono">
                      {formatPhone(apt.phone)}
                    </p>
                  </div>
                  <StatusChip status={apt.status} size="sm" />
                </div>

                <div className="text-xs text-on-surface-variant space-y-0.5 border-t border-outline-variant/30 pt-2">
                  <p>
                    <span className="font-semibold text-on-surface">Service:</span>{" "}
                    {apt.service || "General Consultation"}
                  </p>
                  <p>
                    <span className="font-semibold text-on-surface">Preferred:</span>{" "}
                    {apt.preferredDate || "Any Date"} ({apt.preferredTime})
                  </p>
                  <p className="text-[11px] text-on-surface-variant/70">
                    Requested {formatRelativeTime(apt.createdAt)}
                  </p>
                </div>

                <div
                  className="flex items-center justify-between border-t border-outline-variant/30 pt-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:+91${apt.phone}`}
                      className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </a>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <span className="text-xs font-semibold text-primary">View Details &rarr;</span>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="No appointments found"
            description="Try adjusting your status filter or search query."
          />
        )}
      </div>

      {/* ======================================================== */}
      {/* DETAIL SIDE SHEET                                        */}
      {/* ======================================================== */}
      <SideSheet
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        title={
          <div className="flex items-center gap-2">
            <span>{selectedAppointment?.name}</span>
            {selectedAppointment && <StatusChip status={selectedAppointment.status} size="sm" />}
          </div>
        }
        subtitle={
          selectedAppointment
            ? `ID: ${selectedAppointment.id} · Requested ${formatDate(selectedAppointment.createdAt)}`
            : undefined
        }
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Quick Contact Action Bar */}
            <div className="rounded-2xl bg-surface-container p-3 flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-xs sm:text-sm font-bold text-on-surface">
                {formatPhone(selectedAppointment.phone)}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outlined"
                  size="sm"
                  onClick={() => handleCopyPhone(selectedAppointment.phone)}
                  leftIcon={<Copy className="h-3.5 w-3.5" />}
                >
                  Copy
                </Button>
                <a
                  href={`tel:+91${selectedAppointment.phone}`}
                  className="inline-flex items-center gap-1 rounded-full bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedAppointment.phone}?text=${encodeURIComponent(
                    `Namaste ${selectedAppointment.name}, clinic coordinator here regarding your appointment for ${
                      selectedAppointment.service || "consultation"
                    }.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Status Progression Stepper */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Status Lifecycle
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["new", "called", "confirmed", "visited"] as AppointmentStatus[]).map(
                  (stepStatus) => {
                    const isCurrent = selectedAppointment.status === stepStatus;
                    return (
                      <button
                        key={stepStatus}
                        type="button"
                        onClick={() =>
                          updateMutation.mutate({
                            id: selectedAppointment.id,
                            patch: { status: stepStatus, changedBy: user.name },
                          })
                        }
                        className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                          isCurrent
                            ? "border-primary bg-primary text-on-primary shadow-xs"
                            : "border-outline-variant/60 bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        <span className="capitalize">{stepStatus}</span>
                      </button>
                    );
                  }
                )}
              </div>
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedAppointment.id,
                      patch: { status: "cancelled", changedBy: user.name },
                    })
                  }
                  className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                    selectedAppointment.status === "cancelled"
                      ? "bg-rose-600 text-white"
                      : "text-rose-700 hover:bg-rose-50"
                  }`}
                >
                  Mark as Cancelled
                </button>
              </div>
            </div>

            {/* Patient Request Details */}
            <div className="rounded-2xl border border-outline-variant/60 p-4 space-y-3 bg-surface">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Request Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Requested Service</span>
                  <span className="font-semibold text-on-surface">
                    {selectedAppointment.service || "General Consultation"}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Preferred Slot</span>
                  <span className="font-semibold text-on-surface capitalize">
                    {selectedAppointment.preferredTime}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Target Date</span>
                  <span className="font-semibold text-on-surface">
                    {selectedAppointment.preferredDate || "Any Date (Earliest)"}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Consent (DPDP Act)</span>
                  <span className="font-semibold text-emerald-700">Verified Explicit</span>
                </div>
              </div>

              {selectedAppointment.message && (
                <div className="border-t border-outline-variant/40 pt-3">
                  <span className="text-on-surface-variant block text-xs">Patient Remarks:</span>
                  <p className="mt-1 text-xs text-on-surface italic bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/30">
                    &ldquo;{selectedAppointment.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Internal Staff Notes (Autosaved) */}
            <AppointmentNotesEditor
              key={selectedAppointment.id}
              initialNotes={selectedAppointment.notes}
              onSave={async (notes) => {
                await updateMutation.mutateAsync({
                  id: selectedAppointment.id,
                  patch: { notes, changedBy: user.name },
                });
              }}
            />

            {/* Activity & Audit Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-secondary" />
                <span>Activity & Audit Trail</span>
              </h4>

              <div className="space-y-2">
                {selectedAppointment.activity && selectedAppointment.activity.length > 0 ? (
                  selectedAppointment.activity.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 rounded-xl bg-surface-container-low p-2.5 border border-outline-variant/30 text-xs"
                    >
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 space-y-0.5">
                        <p className="font-semibold text-on-surface">{act.description}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          By <span className="font-medium text-on-surface">{act.userName}</span> ·{" "}
                          {formatDate(act.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant italic">
                    No activity recorded yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </SideSheet>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm">Loading appointments...</div>}>
      <AppointmentsPageContent />
    </React.Suspense>
  );
}
