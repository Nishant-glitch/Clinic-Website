"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, MessageCircle, AlertCircle } from "lucide-react";
import { appointmentRequestSchema, type AppointmentRequestInput } from "@/lib/validators/appointment";
import { siteConfig } from "@/lib/config/site";
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Toast,
} from "@/components/ui";

export interface AppointmentFormProps {
  preselectedService?: string;
  compact?: boolean;
  onSuccess?: (referenceId: string) => void;
  onCancel?: () => void;
  className?: string;
}

const serviceOptions = [
  { value: "", label: "Select Service (Optional)" },
  { value: "General Medical Consultation", label: "General Medical Consultation" },
  { value: "Diabetes & BP Management", label: "Diabetes & BP Management" },
  { value: "Pediatric & Child Health", label: "Pediatric & Child Health" },
  { value: "Preventive Health Checkup", label: "Preventive Health Checkup" },
  { value: "Minor Surgical & Wound Care", label: "Minor Surgical & Wound Care" },
  { value: "On-site ECG & Diagnostic Tests", label: "On-site ECG & Diagnostic Tests" },
];

export function AppointmentForm({
  preselectedService,
  compact = false,
  onSuccess,
  onCancel,
  className = "",
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successData, setSuccessData] = React.useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Compute date limits (today and +60 days)
  const { todayStr, maxDateStr } = React.useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const max = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    return { todayStr: today, maxDateStr: max };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<AppointmentRequestInput>({
    resolver: zodResolver(appointmentRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      preferredDate: "",
      preferredTime: "any",
      service: preselectedService || "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const selectedTime = useWatch({ control, name: "preferredTime" }) || "any";
  const messageVal = useWatch({ control, name: "message" }) || "";

  // Update service when prop changes
  React.useEffect(() => {
    if (preselectedService) {
      setValue("service", preselectedService);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: AppointmentRequestInput) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Map server validation details if present
        if (result.error?.details && typeof result.error.details === "object") {
          const fieldErrors = result.error.details as Record<string, string[]>;
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (messages && messages[0]) {
              setError(field as keyof AppointmentRequestInput, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        setToastMessage(result.error?.message || "Failed to submit appointment request. Please check fields.");
        if (typeof document !== "undefined") {
          document.getElementById("appointment-error-summary")?.focus();
        }
        return;
      }

      const refId = result.data?.id || "REQ-CONFIRMED";
      setSuccessData({ id: refId, name: data.name });
      onSuccess?.(refId);
    } catch {
      setToastMessage("Network connection error. Please check your internet or call our clinic directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    reset({
      name: "",
      phone: "",
      preferredDate: "",
      preferredTime: "any",
      service: preselectedService || "",
      message: "",
      consent: false,
      website: "",
    });
  };

  // Render Success State
  if (successData) {
    const whatsappText = encodeURIComponent(
      `Hello Dr. Sharma's Clinic, I submitted an appointment request (Ref: ${successData.id}) for ${successData.name}. Please confirm my slot.`
    );
    const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${whatsappText}`;

    return (
      <div
        className={`bg-md-surface-container rounded-[24px] p-6 md:p-8 text-center space-y-6 border border-md-outline/10 ${className}`}
        aria-live="polite"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="headline-sm font-bold text-md-on-background">
            Request Received!
          </h2>
          <p className="body-md text-md-on-surface-variant max-w-md mx-auto">
            Thank you, <span className="font-semibold text-md-on-background">{successData.name}</span>. Our front desk will call your number shortly to confirm your consultation slot.
          </p>
        </div>

        <div className="inline-block bg-md-surface-container-low px-4 py-2.5 rounded-full border border-md-outline/15">
          <span className="text-xs text-md-on-surface-variant font-medium">Reference ID: </span>
          <span className="text-xs font-mono font-bold text-md-primary">{successData.id}</span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-whatsapp text-white text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <Button
            type="button"
            variant="tonal"
            size="md"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            Book Another Slot
          </Button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`space-y-4 md:space-y-5 ${className}`}
      aria-label="Appointment request form"
    >
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Accessible error summary for screen readers & quick focus */}
      {hasErrors && (
        <div
          id="appointment-error-summary"
          tabIndex={-1}
          role="alert"
          className="p-3.5 rounded-xl bg-md-error-container/30 border border-md-error/30 text-md-on-error-container flex items-start gap-2.5 text-xs outline-none"
        >
          <AlertCircle className="h-4 w-4 text-md-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-md-error">Please resolve the following errors:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-md-on-surface-variant">
              {Object.entries(errors).map(([key, err]) => (
                <li key={key}>{err?.message?.toString()}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Honeypot field (hidden from screen & tabs for bot deterrence) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-hp">Leave this empty</label>
        <input
          id="website-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {/* Full Name & Phone */}
      <div className={`grid grid-cols-1 ${compact ? "gap-3" : "md:grid-cols-2 gap-4"}`}>
        <Input
          label="Full Name"
          required
          placeholder="e.g. Rahul Sharma"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="w-full flex flex-col gap-1">
          <label
            htmlFor="phone-input"
            className="text-xs font-medium text-md-on-surface-variant flex items-center gap-1"
          >
            Mobile Number <span className="text-md-error">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 z-10 text-xs font-semibold text-md-on-surface-variant select-none">
              +91
            </span>
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              className="w-full h-14 pl-12 pr-4 pt-1 text-sm bg-md-surface-container-low rounded-t-[12px] rounded-b-none border-b-2 border-md-outline/60 transition-all duration-200 text-md-on-background placeholder:text-md-on-surface-variant/50 focus:outline-none focus:bg-md-surface-container focus:border-b-md-primary"
              {...register("phone")}
            />
          </div>
          {errors.phone?.message && (
            <span className="text-xs text-md-error mt-0.5" role="alert">
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>

      {/* Service Selection */}
      <Select
        label="Select Consultation Service"
        options={serviceOptions}
        error={errors.service?.message}
        {...register("service")}
      />

      {/* Preferred Date & Time */}
      <div className={`grid grid-cols-1 ${compact ? "gap-3" : "md:grid-cols-2 gap-4"}`}>
        <Input
          label="Preferred Consultation Date"
          type="date"
          min={todayStr}
          max={maxDateStr}
          error={errors.preferredDate?.message}
          helperText="Select today or up to 60 days ahead"
          {...register("preferredDate")}
        />

        <div className="w-full flex flex-col gap-1">
          <label className="text-xs font-medium text-md-on-surface-variant">
            Preferred Time Slot
          </label>
          <div className="h-14 flex items-center gap-2 px-1">
            {(["any", "morning", "evening"] as const).map((slot) => {
              const isSelected = selectedTime === slot;
              const labels = {
                any: "Any Time",
                morning: "Morning (9-1)",
                evening: "Evening (5-8:30)",
              };
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setValue("preferredTime", slot)}
                  className={`flex-1 py-2 px-2 text-xs font-medium rounded-full transition-all duration-200 text-center ${
                    isSelected
                      ? "bg-md-primary text-md-on-primary shadow-xs font-semibold"
                      : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container border border-md-outline/15"
                  }`}
                >
                  {labels[slot]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message (Optional) */}
      <div className="space-y-1">
        <Textarea
          label="Symptoms or Notes (Optional)"
          rows={compact ? 2 : 3}
          maxLength={500}
          placeholder="Describe any symptoms, fever duration, or questions for Dr. Sharma..."
          error={errors.message?.message}
          {...register("message")}
        />
        <div className="text-right text-[11px] text-md-on-surface-variant/70 pr-1">
          {messageVal.length}/500 characters
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="pt-1">
        <Checkbox
          label={
            <span>
              I agree to be contacted by Dr. Sharma&apos;s Family Care Clinic via phone or WhatsApp regarding this appointment, in accordance with the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-md-primary underline font-medium hover:opacity-80"
              >
                Privacy Policy (DPDP Act 2023)
              </Link>
              .
            </span>
          }
          error={errors.consent?.message}
          {...register("consent")}
        />
      </div>

      {/* Submit Button & Actions */}
      <div className="pt-2 flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="text"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="filled"
          size={compact ? "md" : "lg"}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Confirm Appointment Request
        </Button>
      </div>
    </form>
  );
}
