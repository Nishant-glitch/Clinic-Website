import { ok, fail } from "@/lib/api";
import { appointmentRequestSchema } from "@/lib/validators";

// TODO: In Step 4 (APIs & backend logic), persist to Firestore via collections helper, trigger Resend notification email, and enforce rate limits.
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = appointmentRequestSchema.safeParse(json);

    if (!result.success) {
      return fail(
        "VALIDATION_ERROR",
        "Invalid appointment request payload",
        400,
        result.error.flatten().fieldErrors
      );
    }

    return ok({
      message: "Appointment request received. Our clinic team will call you back shortly.",
      request: {
        name: result.data.name,
        phone: result.data.phone,
        preferredTime: result.data.preferredTime,
      },
    });
  } catch {
    return fail("INVALID_PAYLOAD", "Failed to parse JSON request body", 400);
  }
}
