import "server-only";
import type { ContactMessageInput } from "@/lib/validators/contact";
import * as repo from "@/lib/server/repositories/messageRepository";
import { generateReference, normalizeName, normalizePhone } from "@/lib/server/utils";
import { sendContactNotificationEmail } from "@/lib/email";

export async function createContactMessage(
  input: ContactMessageInput
): Promise<{ reference: string }> {
  // 1. Honeypot check
  if (input.website && input.website.trim().length > 0) {
    console.warn("[Bot Honeypot] Caught bot contact submission with website field filled.");
    return { reference: "MSG-OK-200" };
  }

  const name = normalizeName(input.name);
  const phone = normalizePhone(input.phone);
  const reference = generateReference("MSG");
  const nowIso = new Date().toISOString();

  // 2. Persist to Firestore
  const messageDoc = await repo.createMessage({
    reference,
    name,
    phone,
    email: input.email || undefined,
    message: input.message,
    consent: true,
    consentAt: nowIso,
    privacyPolicyVersion: "1.0",
    read: false,
    archived: false,
    emailStatus: "sent",
  });

  // 3. Email dispatch (non-blocking)
  void (async () => {
    try {
      const emailRes = await sendContactNotificationEmail({
        reference,
        name,
        phone,
        email: input.email || undefined,
        message: input.message,
      });

      if (!emailRes.success) {
        await repo.updateMessage(messageDoc.id, { emailStatus: "failed" });
      }
    } catch (err) {
      console.error("[Email Notification Error - Contact]:", err);
      await repo.updateMessage(messageDoc.id, { emailStatus: "failed" });
    }
  })();

  return { reference };
}

export async function listMessages(filters: repo.MessageFilters) {
  return repo.listMessages(filters);
}

export async function getMessage(id: string) {
  return repo.getMessageById(id);
}

export async function setMessageReadStatus(id: string, read: boolean) {
  return repo.updateMessage(id, { read });
}

export async function deleteMessage(id: string) {
  return repo.deleteMessage(id);
}
