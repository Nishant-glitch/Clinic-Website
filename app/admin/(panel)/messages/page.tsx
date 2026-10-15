"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMessages, markMessageRead, deleteMessage } from "@/lib/admin/data";
import type { ClientContactMessage } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterChips } from "@/components/admin/FilterChips";
import { SearchInput } from "@/components/admin/SearchInput";
import { SideSheet } from "@/components/admin/SideSheet";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatPhone, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [deleteCandidate, setDeleteCandidate] = React.useState<ClientContactMessage | null>(null);

  // URL is single source of truth: derive filter state with useMemo
  const filters = React.useMemo(() => {
    const rawTab = searchParams.get("tab") || (searchParams.get("unread") === "true" ? "unread" : "all");
    const tab = rawTab === "unread" ? "unread" : "all";
    const q = searchParams.get("q") || searchParams.get("search") || "";
    const id = searchParams.get("id") || null;
    return { tab, q, id };
  }, [searchParams]);

  // Update URL helper using window.history.replaceState (avoids RSC refetch loop)
  const updateQuery = React.useCallback((key: string, value: string | null) => {
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
    }
    if (key === "tab") {
      newParams.delete("unread");
    }

    const newSerialized = newParams.toString();
    if (newSerialized === currentSerialized) {
      return;
    }

    const newUrl = `${window.location.pathname}${newSerialized ? `?${newSerialized}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  // Memoize TanStack Query key from stable primitives
  const messagesQueryKey = React.useMemo(
    () => ["admin", "messages", filters.tab, filters.q] as const,
    [filters.tab, filters.q]
  );

  const { data: messages = [], isLoading } = useQuery({
    queryKey: messagesQueryKey,
    queryFn: () => listMessages({ unreadOnly: filters.tab === "unread", search: filters.q }),
  });

  // Derived selected message from URL
  const selectedMessage = React.useMemo(() => {
    if (!filters.id) return null;
    return messages.find((m) => m.id === filters.id) || null;
  }, [filters.id, messages]);

  // Mark read/unread mutation
  const toggleReadMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => markMessageRead(id, read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      showToast("Message deleted");
      updateQuery("id", null);
      setDeleteCandidate(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
    onError: () => {
      showToast("Failed to delete message", "error");
    },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleSelectMessage = (msg: ClientContactMessage) => {
    updateQuery("id", msg.id);
    if (!msg.read) {
      toggleReadMutation.mutate({ id: msg.id, read: true });
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Patient Inquiries"
        description="Patient messages, questions regarding OPD timings, and consultation feedback."
        badge={
          unreadCount > 0 ? (
            <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-on-primary">
              {unreadCount} Unread
            </span>
          ) : undefined
        }
      />

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterChips
          options={[
            { id: "all", label: "All Messages", count: messages.length },
            { id: "unread", label: "Unread", count: unreadCount },
          ]}
          selectedId={filters.tab}
          onChange={(id) => updateQuery("tab", id)}
        />

        <div className="w-full sm:w-72">
          <SearchInput
            value={filters.q}
            onChange={(val) => updateQuery("q", val)}
            placeholder="Search inquiries..."
          />
        </div>
      </div>

      {/* Messages List Container */}
      <div className="rounded-2xl border border-outline-variant/60 bg-surface divide-y divide-outline-variant/40 overflow-hidden shadow-2xs">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse h-20 bg-surface" />
          ))
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isUnread = !msg.read;
            return (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low cursor-pointer transition-colors ${
                  isUnread ? "bg-primary-container/15 font-semibold" : ""
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-1">
                    {isUnread ? (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-primary shadow-xs" />
                    ) : (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-outline-variant/60" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-on-surface">{msg.name}</span>
                      <span className="text-xs text-on-surface-variant font-mono">
                        {formatPhone(msg.phone)}
                      </span>
                      {msg.email && (
                        <span className="text-xs text-on-surface-variant">· {msg.email}</span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface line-clamp-1">
                      {msg.subject ? (
                        <span className="font-bold text-primary mr-1">[{msg.subject}]</span>
                      ) : null}
                      <span className="text-on-surface-variant">{msg.message}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] text-on-surface-variant">
                    {formatRelativeTime(msg.createdAt)}
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteCandidate(msg);
                      }}
                      title="Delete message"
                      className="p-1 rounded-full text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="No inquiries found"
            description="Your inbox is clear! Any inquiries submitted on the contact page will appear here."
          />
        )}
      </div>

      {/* Message Detail SideSheet */}
      <SideSheet
        isOpen={Boolean(selectedMessage)}
        onClose={() => updateQuery("id", null)}
        title={selectedMessage?.name}
        subtitle={
          selectedMessage
            ? `Received ${formatDate(selectedMessage.createdAt)}`
            : undefined
        }
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-6">
            {/* Quick Actions Bar */}
            <div className="rounded-2xl bg-surface-container p-3 flex items-center justify-between gap-2 flex-wrap">
              <div className="space-y-0.5">
                <p className="font-mono text-xs font-bold text-on-surface">
                  {formatPhone(selectedMessage.phone)}
                </p>
                {selectedMessage.email && (
                  <p className="text-xs text-on-surface-variant">{selectedMessage.email}</p>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <a
                  href={`tel:+91${selectedMessage.phone}`}
                  className="inline-flex items-center gap-1 rounded-full bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedMessage.phone}?text=${encodeURIComponent(
                    `Namaste ${selectedMessage.name}, clinic team here replying to your inquiry.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `Re: ${selectedMessage.subject || "Your Inquiry"}`
                    )}`}
                    className="inline-flex items-center gap-1 rounded-full bg-primary hover:bg-primary/90 text-on-primary px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Read/Unread Status Toggle */}
            <div className="flex items-center justify-between text-xs border-y border-outline-variant/40 py-2.5">
              <span className="text-on-surface-variant font-medium">Status:</span>
              <button
                type="button"
                onClick={() =>
                  toggleReadMutation.mutate({
                    id: selectedMessage.id,
                    read: !selectedMessage.read,
                  })
                }
                className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
              >
                {selectedMessage.read ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Mark Unread
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Mark Read
                  </>
                )}
              </button>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Subject & Inquiry Body
              </h4>
              <div className="rounded-2xl border border-outline-variant/60 bg-surface p-4 space-y-2">
                <p className="font-bold text-sm text-on-surface">
                  {selectedMessage.subject || "General Inquiry"}
                </p>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Consent note */}
            <div className="rounded-xl bg-surface-container-low p-3 text-xs text-on-surface-variant">
              Patient consented to callback & privacy policy per DPDP Act 2023.
            </div>

            {/* Delete button (Admin Only) */}
            {isAdmin && (
              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outlined"
                  size="sm"
                  onClick={() => setDeleteCandidate(selectedMessage)}
                  className="text-rose-700 border-rose-300 hover:bg-rose-50"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Delete Message
                </Button>
              </div>
            )}
          </div>
        )}
      </SideSheet>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={() => deleteCandidate && deleteMutation.mutate(deleteCandidate.id)}
        title="Delete Message?"
        description={`Are you sure you want to delete the message from ${deleteCandidate?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm">Loading messages...</div>}>
      <MessagesPageContent />
    </React.Suspense>
  );
}
