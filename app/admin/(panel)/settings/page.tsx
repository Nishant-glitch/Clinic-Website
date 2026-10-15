"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/lib/admin/data";
import type { ClientClinicSettings } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { SaveBar } from "@/components/admin/SaveBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Building2, Stethoscope, MapPin, Clock, Share2 } from "lucide-react";

export default function ClinicSettingsAdminPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: getSettings,
  });

  // Working state draft
  const [draft, setDraft] = React.useState<ClientClinicSettings | null>(null);
  const [hasChanges, setHasChanges] = React.useState(false);

  const formState = draft ?? initialSettings ?? null;

  const updateField = (path: string, val: unknown) => {
    if (!formState) return;
    const copy = JSON.parse(JSON.stringify(formState));
    const parts = path.split(".");
    let curr = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = val;
    setDraft(copy);
    setHasChanges(true);
  };

  const handleDiscard = () => {
    setDraft(null);
    setHasChanges(false);
    showToast("Changes discarded", "info");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!formState) return;
      return updateSettings(formState);
    },
    onSuccess: () => {
      showToast("Clinic settings saved successfully!");
      setHasChanges(false);
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: () => {
      showToast("Failed to save settings", "error");
    },
  });

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin Access Required"
        description="Only clinic administrators can modify global clinic settings and doctor profile."
      />
    );
  }

  if (isLoading || !formState) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-44 rounded-3xl bg-surface animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <PageHeader
        title="Clinic Configuration"
        description="Update address, doctor credentials, OPD consultation timings, and social contact details."
      />

      {/* 1. General Clinic Profile */}
      <div className="rounded-3xl border border-outline-variant/60 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/40 pb-3">
          <Building2 className="h-5 w-5 text-primary" />
          <span>General Clinic Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Clinic Name *
            </label>
            <Input
              value={formState.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Tagline / Subheading
            </label>
            <Input
              value={formState.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Contact Phone (Tel format)
            </label>
            <Input
              value={formState.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              WhatsApp Number
            </label>
            <Input
              value={formState.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Clinic Email
            </label>
            <Input
              type="email"
              value={formState.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Doctor Information */}
      <div className="rounded-3xl border border-outline-variant/60 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/40 pb-3">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>Principal Doctor Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Doctor Full Name
            </label>
            <Input
              value={formState.doctor.name}
              onChange={(e) => updateField("doctor.name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Qualifications & Degrees
            </label>
            <Input
              value={formState.doctor.qualification}
              onChange={(e) => updateField("doctor.qualification", e.target.value)}
              placeholder="e.g. BAMS, MD (Ayurveda)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Clinical Experience
            </label>
            <Input
              value={formState.doctor.experience}
              onChange={(e) => updateField("doctor.experience", e.target.value)}
              placeholder="e.g. 15+ Years"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Registration Number (MCI / State Board)
            </label>
            <Input
              value={formState.doctor.registrationNumber}
              onChange={(e) => updateField("doctor.registrationNumber", e.target.value)}
              placeholder="e.g. AYU-REG-84729-UP"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Specialization Areas
            </label>
            <Input
              value={formState.doctor.specialization}
              onChange={(e) => updateField("doctor.specialization", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Doctor Biography (About Page)
            </label>
            <Textarea
              rows={4}
              value={formState.doctor.bio}
              onChange={(e) => updateField("doctor.bio", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 3. OPD & Consultation Timings */}
      <div className="rounded-3xl border border-outline-variant/60 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/40 pb-3">
          <Clock className="h-5 w-5 text-primary" />
          <span>OPD Hours & Schedule</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Operating Days
            </label>
            <Input
              value={formState.timings.days}
              onChange={(e) => updateField("timings.days", e.target.value)}
              placeholder="Monday – Saturday"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Morning Shift
            </label>
            <Input
              value={formState.timings.morning}
              onChange={(e) => updateField("timings.morning", e.target.value)}
              placeholder="9:00 AM – 1:00 PM"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Evening Shift
            </label>
            <Input
              value={formState.timings.evening}
              onChange={(e) => updateField("timings.evening", e.target.value)}
              placeholder="4:00 PM – 8:00 PM"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Sunday Schedule
            </label>
            <Input
              value={formState.timings.sunday}
              onChange={(e) => updateField("timings.sunday", e.target.value)}
              placeholder="10:00 AM – 1:00 PM (Emergency only)"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Emergency Guidance Note
            </label>
            <Input
              value={formState.timings.emergencyNote}
              onChange={(e) => updateField("timings.emergencyNote", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 4. Physical Address & Location */}
      <div className="rounded-3xl border border-outline-variant/60 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/40 pb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Location & Maps</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Full Physical Address
            </label>
            <Input
              value={formState.address.fullAddress}
              onChange={(e) => updateField("address.fullAddress", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Area</label>
              <Input
                value={formState.address.area}
                onChange={(e) => updateField("address.area", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">City</label>
              <Input
                value={formState.address.city}
                onChange={(e) => updateField("address.city", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">State</label>
              <Input
                value={formState.address.state}
                onChange={(e) => updateField("address.state", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pincode</label>
              <Input
                value={formState.address.pincode}
                onChange={(e) => updateField("address.pincode", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Google Maps Embed URL
            </label>
            <Input
              value={formState.mapEmbedUrl}
              onChange={(e) => updateField("mapEmbedUrl", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5. Social Links */}
      <div className="rounded-3xl border border-outline-variant/60 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/40 pb-3">
          <Share2 className="h-5 w-5 text-primary" />
          <span>Social Media Links</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Facebook</label>
            <Input
              value={formState.socialLinks.facebook || ""}
              onChange={(e) => updateField("socialLinks.facebook", e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Instagram</label>
            <Input
              value={formState.socialLinks.instagram || ""}
              onChange={(e) => updateField("socialLinks.instagram", e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">YouTube</label>
            <Input
              value={formState.socialLinks.youtube || ""}
              onChange={(e) => updateField("socialLinks.youtube", e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Twitter / X</label>
            <Input
              value={formState.socialLinks.twitter || ""}
              onChange={(e) => updateField("socialLinks.twitter", e.target.value)}
              placeholder="https://x.com/..."
            />
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <SaveBar
        hasChanges={hasChanges}
        onSave={() => saveMutation.mutate()}
        onDiscard={handleDiscard}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}
