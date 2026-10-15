"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats, updateAppointment, markMessageRead } from "@/lib/admin/data";
import { StatCard } from "@/components/admin/StatCard";
import { StatusChip } from "@/components/admin/StatusChip";
import { PageHeader } from "@/components/admin/PageHeader";
import { RequestsChart } from "@/components/admin/RequestsChart";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { formatPhone, formatRelativeTime } from "@/lib/utils";
import {
  Clock,
  PhoneCall,
  CheckCircle2,
  MessageSquare,
  Phone,
  MessageCircle,
  Check,
  ArrowRight,
  Calendar,
} from "lucide-react";

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { showToast } = useAdminToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: getDashboardStats,
  });

  // Quick "Mark Called" mutation
  const markCalledMutation = useMutation({
    mutationFn: (id: string) =>
      updateAppointment(id, { status: "called" }),
    onSuccess: () => {
      showToast("Appointment marked as called");
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
    onError: () => {
      showToast("Failed to update status", "error");
    },
  });

  // Mark message as read
  const markMsgReadMutation = useMutation({
    mutationFn: (id: string) => markMessageRead(id, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Clinic Overview"
        description="Real-time patient consultation requests, pending callbacks, and patient inquiries."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/appointments"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors shadow-2xs"
            >
              <Calendar className="h-4 w-4" />
              <span>All Appointments</span>
            </Link>
          </div>
        }
      />

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="New Requests (Today)"
          value={isLoading ? "..." : stats?.newToday ?? 0}
          subtitle="Submitted online today"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Callbacks"
          value={isLoading ? "..." : stats?.pendingCallbacks ?? 0}
          subtitle="Status: New"
          icon={<PhoneCall className="h-5 w-5" />}
          className={stats && stats.pendingCallbacks > 0 ? "border-amber-300/80 bg-amber-50/40" : ""}
        />
        <StatCard
          title="Confirmed This Week"
          value={isLoading ? "..." : stats?.confirmedThisWeek ?? 0}
          subtitle="Ready for consultation"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Unread Messages"
          value={isLoading ? "..." : stats?.unreadMessages ?? 0}
          subtitle="Website inquiries"
          icon={<MessageSquare className="h-5 w-5" />}
        />
      </div>

      {/* 2. Middle Row: Needs a Call (Left) + Requests Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Needs a Call List (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span>Needs a Call</span>
                {stats && stats.needsCall.length > 0 && (
                  <span className="rounded-full bg-primary-container px-2 py-0.5 text-xs font-bold text-on-primary-container">
                    {stats.needsCall.length}
                  </span>
                )}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Latest patients awaiting callback confirmation
              </p>
            </div>
            <Link
              href="/admin/appointments?status=new"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-surface border border-outline-variant/60 p-4 h-24"
                />
              ))
            ) : stats && stats.needsCall.length > 0 ? (
              stats.needsCall.map((apt) => {
                const whatsappHref = `https://wa.me/91${apt.phone}?text=${encodeURIComponent(
                  `Namaste ${apt.name}, this is from the clinic regarding your appointment request for ${
                    apt.service || "consultation"
                  }. When is a convenient time to speak?`
                )}`;

                return (
                  <div
                    key={apt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-surface border border-outline-variant/60 p-4 shadow-2xs hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">{apt.name}</span>
                        <StatusChip status={apt.status} size="sm" />
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        Phone: <span className="font-medium text-on-surface">{formatPhone(apt.phone)}</span>
                        {apt.service && (
                          <span className="ml-2 font-medium text-primary">· {apt.service}</span>
                        )}
                      </p>
                      <p className="text-[11px] text-on-surface-variant/80">
                        Preferred: {apt.preferredDate || "Earliest available"} ({apt.preferredTime}) ·{" "}
                        {formatRelativeTime(apt.createdAt)}
                      </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <a
                        href={`tel:+91${apt.phone}`}
                        title="Call patient"
                        className="inline-flex items-center gap-1 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-900 px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="WhatsApp patient"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => markCalledMutation.mutate(apt.id)}
                        disabled={markCalledMutation.isPending}
                        title="Mark called"
                        className="inline-flex items-center gap-1 rounded-full bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Called</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-outline-variant bg-surface p-8 text-center text-xs text-on-surface-variant">
                No new pending callbacks. All patients have been attended to!
              </div>
            )}
          </div>
        </div>

        {/* Requests Chart (5 cols on lg) */}
        <div className="lg:col-span-5">
          <RequestsChart data={stats?.dailyRequests || []} />
        </div>
      </div>

      {/* 3. Bottom Row: Recent Messages (5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface">Recent Inquiries</h2>
            <p className="text-xs text-on-surface-variant">
              Inquiries submitted through the contact page
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            All messages <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-surface border border-outline-variant/60 divide-y divide-outline-variant/40 overflow-hidden shadow-2xs">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse bg-surface h-16" />
            ))
          ) : stats && stats.recentMessages.length > 0 ? (
            stats.recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/70 transition-colors ${
                  !msg.read ? "bg-primary-container/10 font-medium" : ""
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!msg.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" title="Unread" />
                    )}
                    <span className="font-bold text-sm text-on-surface">{msg.name}</span>
                    <span className="text-xs text-on-surface-variant">
                      ({formatPhone(msg.phone)})
                    </span>
                    <span className="text-[11px] text-on-surface-variant/70">
                      · {formatRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface line-clamp-1">
                    <span className="font-semibold text-primary mr-1">
                      {msg.subject ? `[${msg.subject}]` : ""}
                    </span>
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={`/admin/messages?id=${msg.id}`}
                    onClick={() => !msg.read && markMsgReadMutation.mutate(msg.id)}
                    className="rounded-full border border-outline-variant/60 px-3 py-1 text-xs font-medium hover:bg-surface-variant transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-on-surface-variant">
              No recent inquiries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
