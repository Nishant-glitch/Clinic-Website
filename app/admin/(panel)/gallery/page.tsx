"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "@/lib/admin/data";
import type { GalleryImage, GalleryCategory } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterChips } from "@/components/admin/FilterChips";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Edit, X, UploadCloud } from "lucide-react";

export default function GalleryAdminPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [isUploadingOpen, setIsUploadingOpen] = React.useState(false);
  const [editingImage, setEditingImage] = React.useState<GalleryImage<string> | null>(null);
  const [deleteCandidate, setDeleteCandidate] = React.useState<GalleryImage<string> | null>(null);

  // New Image Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newUrl, setNewUrl] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<GalleryCategory>("clinic");
  const [newCaption, setNewCaption] = React.useState("");

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: listGalleryImages,
  });

  // Filtered list
  const filteredImages = React.useMemo(() => {
    if (activeCategory === "all") return images;
    return images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  // Create image mutation
  const createMutation = useMutation({
    mutationFn: () => {
      if (!newUrl) throw new Error("Please upload an image first.");
      return createGalleryImage({
        title: newTitle.trim() || "Clinic Facility",
        url: newUrl,
        category: newCategory,
        caption: newCaption.trim() || undefined,
        order: images.length + 1,
      });
    },
    onSuccess: () => {
      showToast("Image added to gallery!");
      setIsUploadingOpen(false);
      setNewTitle("");
      setNewUrl("");
      setNewCaption("");
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });

  // Update image mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<GalleryImage<string>> }) =>
      updateGalleryImage(id, patch),
    onSuccess: () => {
      showToast("Image details updated");
      setEditingImage(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: () => {
      showToast("Image removed from gallery");
      setDeleteCandidate(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin Access Required"
        description="You need administrator privileges to manage the clinic photo gallery."
      />
    );
  }

  const categoryCounts = {
    all: images.length,
    clinic: images.filter((i) => i.category === "clinic").length,
    treatments: images.filter((i) => i.category === "treatments").length,
    events: images.filter((i) => i.category === "events").length,
    team: images.filter((i) => i.category === "team").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Photo Gallery"
        description="Manage verified facility photos, treatment suites, and clinic team pictures."
        badge={
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            {images.length} Photos
          </span>
        }
        actions={
          <Button
            type="button"
            variant="filled"
            size="sm"
            onClick={() => setIsUploadingOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Upload Photo
          </Button>
        }
      />

      {/* Filter Chips */}
      <FilterChips
        options={[
          { id: "all", label: "All Photos", count: categoryCounts.all },
          { id: "clinic", label: "Clinic & Facility", count: categoryCounts.clinic },
          { id: "treatments", label: "Treatments", count: categoryCounts.treatments },
          { id: "events", label: "Events & Camps", count: categoryCounts.events },
          { id: "team", label: "Doctors & Team", count: categoryCounts.team },
        ]}
        selectedId={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Upload Dropzone Drawer / Panel */}
      {isUploadingOpen && (
        <div className="rounded-3xl border-2 border-primary/30 bg-surface p-6 sm:p-8 shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-primary" />
              <span>Upload New Gallery Image</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsUploadingOpen(false)}
              className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              value={newUrl}
              onChange={setNewUrl}
              label="Drop or Select Image"
              aspectRatio="aspect-4/3"
            />

            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Image Title
                  </label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Modern Consultation Chamber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GalleryCategory)}
                    className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="clinic">Clinic & Facility</option>
                    <option value="treatments">Treatments & Panchakarma</option>
                    <option value="events">Events & Medical Camps</option>
                    <option value="team">Doctors & Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Caption (Optional)
                  </label>
                  <Input
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Short description displayed on lightbox hover..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4">
                <Button
                  type="button"
                  variant="text"
                  size="sm"
                  onClick={() => setIsUploadingOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="filled"
                  size="sm"
                  onClick={() => createMutation.mutate()}
                  isLoading={createMutation.isPending}
                  disabled={!newUrl}
                >
                  Add to Gallery
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Masonry / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/3 rounded-2xl bg-surface border border-outline-variant/60 animate-pulse"
            />
          ))
        ) : filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-2xl border border-outline-variant/60 bg-surface overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 w-full bg-surface-container overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <span className="absolute top-2 left-2 rounded-full bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {img.category}
                </span>
              </div>

              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                    {img.title}
                  </h4>
                  {img.caption && (
                    <p className="text-[11px] text-on-surface-variant line-clamp-1">
                      {img.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setEditingImage(img)}
                    title="Edit Caption / Category"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(img)}
                    title="Delete Image"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="No Images In This Category"
              description="Upload pictures of your clinic facility, treatments, or staff."
              action={
                <Button
                  type="button"
                  variant="filled"
                  size="sm"
                  onClick={() => setIsUploadingOpen(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Upload Photo
                </Button>
              }
            />
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setEditingImage(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-surface border border-outline-variant p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-on-surface">Edit Image Details</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Title</label>
                <Input
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Category</label>
                <select
                  value={editingImage.category}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      category: e.target.value as GalleryCategory,
                    })
                  }
                  className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-2 text-xs text-on-surface"
                >
                  <option value="clinic">Clinic & Facility</option>
                  <option value="treatments">Treatments</option>
                  <option value="events">Events & Camps</option>
                  <option value="team">Doctors & Staff</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Caption</label>
                <Input
                  value={editingImage.caption || ""}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, caption: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="text"
                size="sm"
                onClick={() => setEditingImage(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                size="sm"
                onClick={() =>
                  updateMutation.mutate({
                    id: editingImage.id,
                    patch: {
                      title: editingImage.title,
                      category: editingImage.category,
                      caption: editingImage.caption,
                    },
                  })
                }
                isLoading={updateMutation.isPending}
              >
                Save
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
        title="Delete Photo?"
        description={`Are you sure you want to delete "${deleteCandidate?.title}" from the public gallery?`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
