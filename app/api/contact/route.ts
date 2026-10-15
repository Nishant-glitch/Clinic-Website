import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { contactMessageSchema } from "@/lib/validators/contact";
import * as service from "@/lib/server/services/messageService";

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

  const parsed = contactMessageSchema.parse(json);
  const result = await service.createContactMessage(parsed);

  return ok(
    {
      reference: result.reference,
      message: "Thank you for reaching out. We have received your inquiry and will contact you shortly.",
    },
    { status: 201 }
  );
});
