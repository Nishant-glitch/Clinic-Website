import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/env.server";
import { siteConfig } from "@/lib/config/site";

function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  skipped?: boolean;
}

export interface AppointmentEmailPayload {
  reference: string;
  name: string;
  phone: string;
  preferredDate?: string;
  preferredTime: string;
  service?: string;
  message?: string;
}

export interface ContactEmailPayload {
  reference: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
}

/**
 * Renders HTML email template for new appointment requests.
 */
export function renderNewAppointmentEmail(data: AppointmentEmailPayload): {
  subject: string;
  html: string;
} {
  const safeName = escapeHtml(data.name);
  const safePhone = escapeHtml(data.phone);
  const safeDate = escapeHtml(data.preferredDate || "Flexible / Not specified");
  const safeTime = escapeHtml(data.preferredTime);
  const safeService = escapeHtml(data.service || "General Consultation");
  const safeMessage = escapeHtml(data.message || "None");
  const safeRef = escapeHtml(data.reference);
  const adminUrl = `${siteConfig.url}/admin/appointments?q=${encodeURIComponent(data.reference)}`;

  const subject = `New appointment request - ${data.name} (${data.reference})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f2fa; color: #1d1b20; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .header { border-bottom: 2px solid #ece6f0; padding-bottom: 16px; margin-bottom: 20px; }
    .badge { display: inline-block; background-color: #eaddff; color: #21005d; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 14px; }
    .title { font-size: 20px; font-weight: bold; margin: 12px 0 4px 0; color: #21005d; }
    .row { margin-bottom: 12px; }
    .label { font-size: 13px; color: #49454f; margin-bottom: 2px; }
    .value { font-size: 15px; font-weight: 500; }
    .btn { display: inline-block; background-color: #6750a4; color: #ffffff !important; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    .tel-link { color: #6750a4; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Reference: ${safeRef}</span>
      <h1 class="title">New Consultation Request</h1>
      <p style="margin: 0; color: #49454f; font-size: 14px;">A patient has submitted an appointment request on the clinic website.</p>
    </div>

    <div class="row">
      <div class="label">Patient Name</div>
      <div class="value">${safeName}</div>
    </div>

    <div class="row">
      <div class="label">Phone Number</div>
      <div class="value"><a href="tel:+91${safePhone}" class="tel-link">+91 ${safePhone}</a> (Tap to call)</div>
    </div>

    <div class="row">
      <div class="label">Requested Service</div>
      <div class="value">${safeService}</div>
    </div>

    <div class="row">
      <div class="label">Preferred Schedule</div>
      <div class="value">${safeDate} (${safeTime})</div>
    </div>

    <div class="row">
      <div class="label">Patient Notes / Symptoms</div>
      <div class="value">${safeMessage}</div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${adminUrl}" class="btn">Open in Admin Panel</a>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

/**
 * Renders HTML email template for new contact messages.
 */
export function renderNewContactEmail(data: ContactEmailPayload): {
  subject: string;
  html: string;
} {
  const safeName = escapeHtml(data.name);
  const safePhone = escapeHtml(data.phone);
  const safeEmail = escapeHtml(data.email || "Not provided");
  const safeMessage = escapeHtml(data.message);
  const safeRef = escapeHtml(data.reference);

  const subject = `New website inquiry - ${data.name} (${data.reference})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f2fa; color: #1d1b20; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .header { border-bottom: 2px solid #ece6f0; padding-bottom: 16px; margin-bottom: 20px; }
    .badge { display: inline-block; background-color: #eaddff; color: #21005d; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 14px; }
    .title { font-size: 20px; font-weight: bold; margin: 12px 0 4px 0; color: #21005d; }
    .row { margin-bottom: 12px; }
    .label { font-size: 13px; color: #49454f; margin-bottom: 2px; }
    .value { font-size: 15px; font-weight: 500; }
    .tel-link { color: #6750a4; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Reference: ${safeRef}</span>
      <h1 class="title">New Website Inquiry</h1>
    </div>

    <div class="row">
      <div class="label">From</div>
      <div class="value">${safeName}</div>
    </div>

    <div class="row">
      <div class="label">Phone</div>
      <div class="value"><a href="tel:+91${safePhone}" class="tel-link">+91 ${safePhone}</a></div>
    </div>

    <div class="row">
      <div class="label">Email</div>
      <div class="value">${safeEmail}</div>
    </div>

    <div class="row">
      <div class="label">Message</div>
      <div class="value" style="white-space: pre-line;">${safeMessage}</div>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

/**
 * Dispatches an email notification via Resend.
 * Non-blocking: failures are logged and returned safely without throwing.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const apiKey = serverEnv.RESEND_API_KEY;

  // In development without a real Resend API key, log email instead of failing
  if (!apiKey || apiKey.startsWith("re_placeholder") || apiKey.trim() === "") {
    console.info(`[Email Preview / Dev] Skipped live dispatch because RESEND_API_KEY is not configured.`);
    console.info(`[Email To]: ${to}`);
    console.info(`[Email Subject]: ${subject}`);
    return { success: true, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.EMAIL_FROM || "Clinic Website <onboarding@resend.dev>";

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error("[Email Error]: Failed to send email via Resend:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true, id: response.data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Email Exception]: Exception while dispatching email:", msg);
    return { success: false, error: msg };
  }
}

export async function sendAppointmentNotificationEmail(
  payload: AppointmentEmailPayload
): Promise<SendEmailResult> {
  const { subject, html } = renderNewAppointmentEmail(payload);
  return sendEmail({
    to: serverEnv.CLINIC_NOTIFY_EMAIL,
    subject,
    html,
  });
}

export async function sendContactNotificationEmail(
  payload: ContactEmailPayload
): Promise<SendEmailResult> {
  const { subject, html } = renderNewContactEmail(payload);
  return sendEmail({
    to: serverEnv.CLINIC_NOTIFY_EMAIL,
    subject,
    html,
  });
}
