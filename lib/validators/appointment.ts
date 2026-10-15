import { z } from "zod";

export const indianMobileRegex = /^[6-9]\d{9}$/;

/**
 * Sanitizes and validates a 10-digit Indian mobile number.
 * Accepts formats: 9876543210, +91 98765 43210, +919876543210, 09876543210
 */
export const indianPhoneSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/^(?:\+91|91|0)/, "").replace(/[\s-]/g, ""))
  .refine((val) => indianMobileRegex.test(val), {
    message: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
  });

/**
 * Validates optional preferred date: today or future, maximum 60 days ahead.
 */
function isValidPreferredDate(dateStr?: string): boolean {
  if (!dateStr || dateStr.trim() === "") return true;

  // Format check YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const now = new Date();
  const todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  const maxDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const maxDateIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(maxDate);

  return dateStr >= todayIST && dateStr <= maxDateIST;
}

export const appointmentRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must not exceed 60 characters"),
  phone: indianPhoneSchema,
  preferredDate: z
    .string()
    .trim()
    .optional()
    .refine((val) => isValidPreferredDate(val), {
      message: "Preferred date must be today or within the next 60 days (YYYY-MM-DD)",
    }),
  preferredTime: z.enum(["morning", "evening", "any"]).default("any"),
  service: z.string().trim().max(100, "Service name is too long").optional(),
  message: z.string().trim().max(500, "Message cannot exceed 500 characters").optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to being contacted by our clinic (DPDP Act 2023)",
  }),
  source: z.enum(["website", "popup"]).default("website"),
  // Hidden honeypot field for bot protection. If filled, handler returns fake success without saving.
  website: z.string().optional(),
});

export type AppointmentRequestInput = z.input<typeof appointmentRequestSchema>;
export type AppointmentRequestOutput = z.output<typeof appointmentRequestSchema>;
