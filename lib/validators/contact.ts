import { z } from "zod";
import { indianPhoneSchema } from "./appointment";

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must not exceed 60 characters"),
  phone: indianPhoneSchema,
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Consent is required to submit inquiry",
  }),
  // Hidden honeypot field for bot protection. If filled, handler returns fake success without saving.
  website: z.string().optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
