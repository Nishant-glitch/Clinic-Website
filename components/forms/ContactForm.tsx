"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validators/contact";
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Toast,
} from "@/components/ui";

export interface ContactFormProps {
  className?: string;
  onSuccess?: (id: string) => void;
}

export function ContactForm({ className = "", onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successData, setSuccessData] = React.useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const messageVal = useWatch({ control, name: "message" }) || "";

  const onSubmit = async (data: ContactMessageInput) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.error?.details && typeof result.error.details === "object") {
          const fieldErrors = result.error.details as Record<string, string[]>;
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (messages && messages[0]) {
              setError(field as keyof ContactMessageInput, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        setToastMessage(result.error?.message || "Failed to submit message. Please check the fields.");
        if (typeof document !== "undefined") {
          document.getElementById("contact-error-summary")?.focus();
        }
        return;
      }

      const refId = result.data?.id || "MSG-CONFIRMED";
      setSuccessData({ id: refId, name: data.name });
      onSuccess?.(refId);
    } catch {
      setToastMessage("Network connection error. Please try again or call our clinic directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    reset({
      name: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
      website: "",
    });
  };

  if (successData) {
    return (
      <div
        className={`bg-md-surface-container rounded-[24px] p-6 md:p-8 text-center space-y-5 border border-md-outline/10 ${className}`}
        aria-live="polite"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h3 className="headline-sm font-bold text-md-on-background">
            Message Sent Successfully!
          </h3>
          <p className="body-md text-md-on-surface-variant max-w-md mx-auto">
            Thank you, <span className="font-semibold text-md-on-background">{successData.name}</span>. Our clinic administrative team has received your inquiry and will respond within 24 hours.
          </p>
        </div>

        <div className="inline-block bg-md-surface-container-low px-4 py-2 rounded-full border border-md-outline/15">
          <span className="text-xs text-md-on-surface-variant font-medium">Tracking Reference: </span>
          <span className="text-xs font-mono font-bold text-md-primary">{successData.id}</span>
        </div>

        <div className="pt-2">
          <Button type="button" variant="tonal" size="md" onClick={handleReset}>
            Send Another Message
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
      aria-label="Contact inquiry form"
    >
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}

      {hasErrors && (
        <div
          id="contact-error-summary"
          tabIndex={-1}
          role="alert"
          className="p-3.5 rounded-xl bg-md-error-container/30 border border-md-error/30 text-md-on-error-container flex items-start gap-2.5 text-xs outline-none"
        >
          <AlertCircle className="h-4 w-4 text-md-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-md-error">Please check the required fields:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-md-on-surface-variant">
              {Object.entries(errors).map(([key, err]) => (
                <li key={key}>{err?.message?.toString()}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-hp">Do not fill this</label>
        <input
          id="contact-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          required
          placeholder="e.g. Priya Shah"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="w-full flex flex-col gap-1">
          <label
            htmlFor="contact-phone"
            className="text-xs font-medium text-md-on-surface-variant flex items-center gap-1"
          >
            Mobile Number <span className="text-md-error">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 z-10 text-xs font-semibold text-md-on-surface-variant select-none">
              +91
            </span>
            <input
              id="contact-phone"
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

      <Input
        label="Email Address (Optional)"
        type="email"
        placeholder="e.g. priya@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="space-y-1">
        <Textarea
          label="Your Message or Inquiry"
          required
          rows={4}
          maxLength={1000}
          placeholder="How can our clinic help you? Ask about services, reports, or general queries..."
          error={errors.message?.message}
          {...register("message")}
        />
        <div className="text-right text-[11px] text-md-on-surface-variant/70 pr-1">
          {messageVal.length}/1000 characters
        </div>
      </div>

      <div className="pt-1">
        <Checkbox
          label={
            <span>
              I consent to the clinic processing my details to reply to this message per the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-md-primary underline font-medium hover:opacity-80"
              >
                Privacy Policy
              </Link>
              .
            </span>
          }
          error={errors.consent?.message}
          {...register("consent")}
        />
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          variant="filled"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<MessageSquare className="h-4 w-4" />}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Send Inquiry
        </Button>
      </div>
    </form>
  );
}
