"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listServices, createService, updateService } from "@/lib/admin/data";
import type { ServiceFaq } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ArrowLeft, Save, Plus, Trash2, Eye, FileEdit } from "lucide-react";
import Link from "next/link";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface ServiceFormProps {
  initialService?: {
    id: string;
    title: string;
    slug: string;
    category?: string;
    shortDescription?: string;
    content?: string;
    fullDescription?: string;
    image?: string;
    faqs?: ServiceFaq[];
  };
  isNew: boolean;
  serviceId: string;
  totalServices: number;
}

function ServiceForm({ initialService, isNew, serviceId, totalServices }: ServiceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useAdminToast();

  const [title, setTitle] = React.useState(initialService?.title || "");
  const [slug, setSlug] = React.useState(initialService?.slug || "");
  const [slugTouched, setSlugTouched] = React.useState(!isNew);
  const [category, setCategory] = React.useState(initialService?.category || "General Consultation");
  const [shortDescription, setShortDescription] = React.useState(initialService?.shortDescription || "");
  const [content, setContent] = React.useState(
    initialService?.content || initialService?.fullDescription || ""
  );
  const [image, setImage] = React.useState(initialService?.image || "");
  const [faqs, setFaqs] = React.useState<ServiceFaq[]>(initialService?.faqs || []);
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched || isNew) {
      setSlug(slugify(val));
    }
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !slug.trim()) {
        throw new Error("Title and Slug are required.");
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        shortDescription: shortDescription.trim(),
        fullDescription: shortDescription.trim(),
        content: content.trim(),
        image: image || undefined,
        faqs: faqs.filter((f) => f.question.trim()),
        active: true,
        order: isNew ? totalServices + 1 : 1,
      };

      if (isNew) {
        return createService(payload);
      } else {
        return updateService(serviceId, payload);
      }
    },
    onSuccess: () => {
      showToast(isNew ? "Service created successfully!" : "Service updated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      router.push("/admin/services");
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to save service", "error");
    },
  });

  return (
    <div className="rounded-3xl border border-outline-variant/60 bg-surface p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title and Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Service Title *
          </label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Panchakarma Detox Therapy"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            URL Slug *
          </label>
          <Input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="panchakarma-detox-therapy"
            required
          />
          <p className="mt-1 text-[11px] text-on-surface-variant">
            Public link: /services/{slug || "slug"}
          </p>
        </div>
      </div>

      {/* Category & Short Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="General Consultation">General Consultation</option>
            <option value="Panchakarma Therapies">Panchakarma Therapies</option>
            <option value="Chronic Pain Care">Chronic Pain Care</option>
            <option value="Stress & Wellness">Stress & Wellness</option>
            <option value="Diet & Nutrition">Diet & Nutrition</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Short Description (Card Summary)
          </label>
          <Input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief summary for service cards and search previews..."
          />
        </div>
      </div>

      {/* Image Uploader */}
      <div>
        <ImageUploader
          value={image}
          onChange={setImage}
          label="Service Feature Image"
          aspectRatio="aspect-21/9"
        />
      </div>

      {/* Content (Rich text / Markdown editor with Preview tab) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Full Content & Clinical Overview
          </label>
          <div className="flex items-center rounded-xl bg-surface-container p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                activeTab === "edit"
                  ? "bg-surface text-primary shadow-2xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                activeTab === "preview"
                  ? "bg-surface text-primary shadow-2xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {activeTab === "edit" ? (
          <Textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detailed treatment overview, who it's for, procedural steps, and what patients can expect..."
            className="font-sans"
          />
        ) : (
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5 text-sm text-on-surface leading-relaxed whitespace-pre-wrap min-h-48">
            {content || (
              <span className="text-on-surface-variant/60 italic">
                Nothing to preview yet. Write content in the editor tab.
              </span>
            )}
          </div>
        )}
      </div>

      {/* FAQs Repeater */}
      <div className="space-y-3 pt-4 border-t border-outline-variant/40">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Service Frequently Asked Questions (FAQs)
            </h4>
            <p className="text-[11px] text-on-surface-variant">
              Questions displayed on the public service detail page.
            </p>
          </div>
          <Button
            type="button"
            variant="outlined"
            size="sm"
            onClick={addFaq}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Question
          </Button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 space-y-2 relative"
            >
              <button
                type="button"
                onClick={() => removeFaq(idx)}
                className="absolute top-3 right-3 p-1 rounded-full text-on-surface-variant hover:text-rose-700 hover:bg-rose-50"
                aria-label="Remove FAQ"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                  Question #{idx + 1}
                </label>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, "question", e.target.value)}
                  placeholder="e.g. How many sessions are required?"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                  Answer
                </label>
                <Textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                  placeholder="Provide a clear, reassuring answer..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-outline-variant/40 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="text"
          size="md"
          onClick={() => router.push("/admin/services")}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="filled"
          size="md"
          onClick={() => saveMutation.mutate()}
          isLoading={saveMutation.isPending}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {isNew ? "Create Service" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function ServiceEditorPageContent() {
  const params = useParams();
  const { isAdmin } = useAdminAuth();

  const id = params?.id as string;
  const isNew = id === "new";

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: listServices,
  });

  const existingService = !isNew ? services.find((s) => s.id === id) : undefined;

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Admin privileges required.
      </div>
    );
  }

  if (!isNew && isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-12 w-48 rounded-2xl bg-surface animate-pulse" />
        <div className="h-96 rounded-3xl bg-surface animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/services"
          className="p-2 rounded-full border border-outline-variant/60 hover:bg-surface-variant transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <PageHeader
          title={isNew ? "Create Clinical Service" : `Edit: ${existingService?.title || "Service"}`}
          description="Define service descriptions, overview, SEO slug, and patient FAQs."
          className="pb-0 border-0 flex-1"
        />
      </div>

      <ServiceForm
        key={existingService?.id || "new"}
        initialService={existingService}
        isNew={isNew}
        serviceId={id}
        totalServices={services.length}
      />
    </div>
  );
}

export default function ServiceEditorPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm">Loading service editor...</div>}>
      <ServiceEditorPageContent />
    </React.Suspense>
  );
}
