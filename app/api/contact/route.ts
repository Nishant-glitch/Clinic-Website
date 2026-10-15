import { ok, fail } from "@/lib/api";
import { contactMessageSchema } from "@/lib/validators";

// TODO(step-4): save to Firestore + send email
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = contactMessageSchema.safeParse(json);

    if (!result.success) {
      return fail(
        "VALIDATION_ERROR",
        "Invalid contact message payload",
        400,
        result.error.flatten().fieldErrors
      );
    }

    const tempId = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return ok({
      id: tempId,
      message: "Your message has been received. Thank you for contacting our clinic.",
      contact: {
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
      },
    });
  } catch {
    return fail("INVALID_PAYLOAD", "Failed to parse JSON request body", 400);
  }
}
