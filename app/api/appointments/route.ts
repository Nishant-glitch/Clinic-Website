import { ok, fail } from "@/lib/api";
import { appointmentRequestSchema } from "@/lib/validators";

// TODO(step-4): save to Firestore + send email
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

    const tempId = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return ok({
      id: tempId,
      message: "Appointment request received. Our clinic team will call you back shortly.",
      request: {
        name: result.data.name,
        phone: result.data.phone,
        preferredDate: result.data.preferredDate,
        preferredTime: result.data.preferredTime,
        service: result.data.service,
      },
    });
  } catch {
    return fail("INVALID_PAYLOAD", "Failed to parse JSON request body", 400);
  }
}
