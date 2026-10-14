import "server-only";
import { Resend } from "resend";
import type { AppointmentRequestInput, ContactMessageInput } from "@/lib/validators";
import { serverEnv } from "@/lib/env.server";

// TODO: In Step 4, finalize Resend API integration and HTML email templates.
export function getResendClient(): Resend {
  return new Resend(serverEnv.RESEND_API_KEY);
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Generates email content for internal clinic notification when a new appointment request arrives.
 */
export function generateAppointmentNotificationEmail(data: AppointmentRequestInput) {
  const subject = `[New Appointment Request] ${data.name} - ${data.phone}`;
  const html = `
    <h2>New Patient Appointment Request</h2>
    <p><strong>Patient Name:</strong> ${data.name}</p>
    <p><strong>Contact Phone:</strong> ${data.phone}</p>
    <p><strong>Preferred Date:</strong> ${data.preferredDate || "Not specified"}</p>
    <p><strong>Preferred Time Window:</strong> ${data.preferredTime}</p>
    <p><strong>Selected Service:</strong> ${data.service || "General Consultation"}</p>
    <p><strong>Patient Message / Note:</strong> ${data.message || "None"}</p>
    <hr/>
    <p><small>Please call the patient back to confirm scheduling.</small></p>
  `;
  return { subject, html };
}

/**
 * Generates email content for clinic notification when a new contact inquiry is received.
 */
export function generateContactInquiryEmail(data: ContactMessageInput) {
  const subject = `[Website Inquiry] from ${data.name} - ${data.phone}`;
  const html = `
    <h2>New Website Inquiry</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email || "Not provided"}</p>
    <p><strong>Message:</strong></p>
    <blockquote>${data.message}</blockquote>
  `;
  return { subject, html };
}
