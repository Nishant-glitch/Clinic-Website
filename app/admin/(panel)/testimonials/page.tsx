"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "@/lib/admin/data";
import type { Testimonial } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Star, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function TestimonialsAdminPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Testimonial<string> | null>(null);
  const [deleteCandidate, setDeleteCandidate] = React.useState<Testimonial<string> | null>(null);

  // Form State
  const [patientName, setPatientName] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [treatment, setTreatment] = React.useState("");
  const [review, setReview] = React.useState("");
  const [featured, setFeatured] = React.useState(true);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: listTestimonials,
  });

  const openCreate = () => {
    setEditingItem(null);
    setPatientName("");
    setRating(5);
    setTreatment("");
    setReview("");
    setFeatured(true);
    setEditorOpen(true);
  };

  const openEdit = (t: Testimonial<string>) => {
    setEditingItem(t);
    setPatientName(t.patientName);
    setRating(t.rating);
    setTreatment(t.treatment || "");
    setReview(t.review || t.text || "");
    setFeatured(t.featured ?? true);
    setEditorOpen(true);
  };

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (newItems: Testimonial<string>[]) =>
      reorderTestimonials(newItems.map((i) => i.id)),
    onSuccess: () => {
      showToast("Testimonials reordered");
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!patientName.trim() || !review.trim()) {
        throw new Error("Patient name and review text are required.");
      }

      const payload = {
        patientName: patientName.trim(),
        rating,
        treatment: treatment.trim() || "Ayurvedic Consultation",
        review: review.trim(),
        text: review.trim(),
        date: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
        verified: true,
        featured,
      };

      if (editingItem) {
        return updateTestimonial(editingItem.id, payload);
      } else {
        return createTestimonial(payload);
      }
    },
    onSuccess: () => {
      showToast(editingItem ? "Testimonial updated" : "Testimonial added");
      setEditorOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });

  // Toggle visible/featured mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateTestimonial(id, { featured }),
    onSuccess: () => {
      showToast("Visibility updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      showToast("Testimonial deleted");
      setDeleteCandidate(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    },
  });

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin Access Required"
        description="You need administrator privileges to manage patient reviews."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Testimonials"
        description="Manage patient stories, verified ratings, and testimonials displayed on the homepage."
        badge={
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            {testimonials.length} Reviews
          </span>
        }
        actions={
          <Button
            type="button"
            variant="filled"
            size="sm"
            onClick={openCreate}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Testimonial
          </Button>
        }
      />

      <div className="rounded-2xl border border-outline-variant/60 bg-surface p-4 sm:p-6 shadow-2xs">
        <div className="mb-4 text-xs text-on-surface-variant font-medium">
          Drag items to reorder how they appear in the patient review carousel.
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <SortableList
            items={testimonials}
            onReorder={(newItems) => reorderMutation.mutate(newItems)}
            renderItem={(t) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full py-1">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface truncate">
                      {t.patientName}
                    </span>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3 w-3 ${
                            idx < t.rating ? "fill-current" : "text-outline-variant/60"
                          }`}
                        />
                      ))}
                    </div>
                    {t.treatment && (
                      <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-on-surface-variant">
                        {t.treatment}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-1 italic">
                    &ldquo;{t.review || t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleVisibilityMutation.mutate({
                        id: t.id,
                        featured: !t.featured,
                      })
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                      t.featured
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {t.featured ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(t)}
                    title="Edit review"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(t)}
                    title="Delete review"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          />
        ) : (
          <EmptyState
            title="No Testimonials"
            description="Add patient reviews and ratings to build credibility."
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditorOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-outline-variant p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-on-surface">
              {editingItem ? "Edit Testimonial" : "Add Patient Testimonial"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Patient Name *
                </label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Mrs. Sunita Sharma"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-1 py-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            starVal <= rating ? "fill-current" : "text-outline-variant/60"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Treatment Category
                  </label>
                  <Input
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="e.g. Shirodhara & Stress Care"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Patient Review Text *
                </label>
                <Textarea
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="What the patient said about doctor guidance, hygiene, and treatment results..."
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span>Display on public website review carousel</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/40">
              <Button type="button" variant="text" size="sm" onClick={() => setEditorOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                size="sm"
                onClick={() => saveMutation.mutate()}
                isLoading={saveMutation.isPending}
              >
                {editingItem ? "Save Changes" : "Add Testimonial"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={() => deleteCandidate && deleteMutation.mutate(deleteCandidate.id)}
        title="Delete Testimonial?"
        description={`Are you sure you want to delete the testimonial from ${deleteCandidate?.patientName}?`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
