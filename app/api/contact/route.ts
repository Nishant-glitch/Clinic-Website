import { ok, fail } from "@/lib/api";
import { contactMessageSchema } from "@/lib/validators";

// TODO: In Step 4 (APIs & backend logic), persist to Firestore via collections helper and dispatch Resend notification email.
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

    return ok({
      message: "Your message has been received. Thank you for contacting our clinic.",
      contact: {
        name: result.data.name,
        phone: result.data.phone,
      },
    });
  } catch {
    return fail("INVALID_PAYLOAD", "Failed to parse JSON request body", 400);
  }
}
