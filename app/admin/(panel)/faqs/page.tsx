"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFaqs, createFaq, updateFaq, deleteFaq, reorderFaqs } from "@/lib/admin/data";
import type { Faq } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function FaqsAdminPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingFaq, setEditingFaq] = React.useState<Faq | null>(null);
  const [deleteCandidate, setDeleteCandidate] = React.useState<Faq | null>(null);

  // Form State
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState("Consultation");

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: listFaqs,
  });

  const openCreate = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("Consultation");
    setEditorOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || "Consultation");
    setEditorOpen(true);
  };

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (newFaqs: Faq[]) => reorderFaqs(newFaqs.map((f) => f.id)),
    onSuccess: () => {
      showToast("FAQ order updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!question.trim() || !answer.trim()) {
        throw new Error("Question and Answer are required.");
      }

      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category,
        order: faqs.length + 1,
        active: true,
      };

      if (editingFaq) {
        return updateFaq(editingFaq.id, payload);
      } else {
        return createFaq(payload);
      }
    },
    onSuccess: () => {
      showToast(editingFaq ? "FAQ updated" : "FAQ created");
      setEditorOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => {
      showToast("FAQ removed");
      setDeleteCandidate(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
    },
  });

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin Access Required"
        description="You need administrator privileges to manage FAQs."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequently Asked Questions"
        description="Manage questions and answers displayed in the accordion on the homepage and contact page."
        badge={
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            {faqs.length} FAQs
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
            Add FAQ
          </Button>
        }
      />

      <div className="rounded-2xl border border-outline-variant/60 bg-surface p-4 sm:p-6 shadow-2xs">
        <div className="mb-4 text-xs text-on-surface-variant font-medium">
          Drag questions by the handle to reorder the FAQ accordion display.
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : faqs.length > 0 ? (
          <SortableList
            items={faqs}
            onReorder={(newItems) => reorderMutation.mutate(newItems)}
            renderItem={(faq) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full py-1">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface truncate">
                      {faq.question}
                    </span>
                    {faq.category && (
                      <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-on-surface-variant">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-1">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(faq)}
                    title="Edit FAQ"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(faq)}
                    title="Delete FAQ"
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
            title="No FAQs Created"
            description="Add questions and answers to address common patient concerns."
          />
        )}
      </div>

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditorOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-outline-variant p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-on-surface">
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Question *
                </label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Do I need to fast before Panchakarma?"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="Consultation">Consultation & OPD</option>
                  <option value="Treatments">Treatments & Therapies</option>
                  <option value="Medicines">Ayurvedic Medicines & Diet</option>
                  <option value="Appointments">Booking & Rescheduling</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Answer *
                </label>
                <Textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Clear, helpful response for patients..."
                  required
                />
              </div>
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
                {editingFaq ? "Save Changes" : "Create FAQ"}
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
        title="Delete FAQ?"
        description={`Are you sure you want to delete "${deleteCandidate?.question}"?`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
