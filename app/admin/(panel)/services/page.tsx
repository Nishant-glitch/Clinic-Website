"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listServices, updateService, deleteService, reorderServices } from "@/lib/admin/data";
import type { ClientService } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function ServicesAdminPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [deleteCandidate, setDeleteCandidate] = React.useState<ClientService | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: listServices,
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (newServices: ClientService[]) =>
      reorderServices(newServices.map((s) => s.id)),
    onMutate: async (newServices) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "services"] });
      const previous = queryClient.getQueryData<ClientService[]>(["admin", "services"]);
      queryClient.setQueryData(["admin", "services"], newServices);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "services"], context.previous);
      }
      showToast("Failed to reorder services", "error");
    },
    onSuccess: () => {
      showToast("Service order updated");
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateService(id, { active }),
    onSuccess: (updated) => {
      showToast(`Service ${updated.active ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      showToast("Service deleted");
      setDeleteCandidate(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: () => {
      showToast("Failed to delete service", "error");
    },
  });

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin Access Required"
        description="You need administrator privileges to manage clinical services."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Services"
        description="Manage clinical offerings, treatments, FAQs, and display order across the website."
        badge={
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            {services.length} Services
          </span>
        }
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </Link>
        }
      />

      <div className="rounded-2xl border border-outline-variant/60 bg-surface p-4 sm:p-6 shadow-2xs">
        <div className="mb-4 flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <span>Drag items by the handle on the left to reorder how they appear to patients.</span>
          <span className="hidden sm:inline">Active Status</span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <SortableList
            items={services}
            onReorder={(newItems) => reorderMutation.mutate(newItems)}
            renderItem={(service) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full py-1">
                <div className="flex items-center gap-3 min-w-0">
                  {service.image ? (
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-outline-variant/40">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 rounded-xl bg-primary-container text-on-primary-container items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  )}

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-on-surface truncate">
                        {service.title}
                      </h3>
                      {service.category && (
                        <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-on-surface-variant">
                          {service.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Active toggle button */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleActiveMutation.mutate({
                        id: service.id,
                        active: !service.active,
                      })
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      service.active
                        ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                        : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80"
                    }`}
                  >
                    {service.active ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>

                  {/* Public preview link */}
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    title="View public page"
                    className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {/* Edit button */}
                  <Link
                    href={`/admin/services/${service.id}`}
                    title="Edit Service"
                    className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary-container/30 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(service)}
                    title="Delete Service"
                    className="p-1.5 rounded-full text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          />
        ) : (
          <EmptyState
            title="No Services Found"
            description="Add your first clinical service to display on the patient website."
            action={
              <Link
                href="/admin/services/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </Link>
            }
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={() => deleteCandidate && deleteMutation.mutate(deleteCandidate.id)}
        title="Delete Service?"
        description={`Are you sure you want to delete "${deleteCandidate?.title}"? It will be removed from the patient website and navigation.`}
        confirmLabel="Delete Service"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
