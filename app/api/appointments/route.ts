import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { appointmentRequestSchema } from "@/lib/validators/appointment";
import * as service from "@/lib/server/services/appointmentService";

const MAX_BODY_BYTES = 10 * 1024; // 10KB

export const POST = withHandler(async (request: Request) => {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new AppError("UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json", 415);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    throw new AppError("PAYLOAD_TOO_LARGE", "Request body exceeds maximum size of 10KB", 413);
  }

  const rawText = await request.text();
  if (rawText.length > MAX_BODY_BYTES) {
    throw new AppError("PAYLOAD_TOO_LARGE", "Request body exceeds maximum size of 10KB", 413);
  }

  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new AppError("INVALID_JSON", "Malformed JSON payload", 400);
  }

  const parsed = appointmentRequestSchema.parse(json);
  const idempotencyKey = request.headers.get("idempotency-key");

  const result = await service.createAppointmentRequest(parsed, { idempotencyKey });

  return ok(
    {
      reference: result.reference,
      message: "Appointment request received. Our clinic team will call you back shortly.",
      isDuplicate: result.isDuplicate,
    },
    { status: 201 }
  );
});
