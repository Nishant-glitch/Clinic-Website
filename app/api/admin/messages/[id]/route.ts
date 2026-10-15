import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { messagePatchSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/messageService";

export const GET = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin", "staff"]);

  const params = await context.params;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Message ID is required", 400);

  const message = await service.getMessage(id);
  if (!message) {
    throw new AppError("NOT_FOUND", `Message ${id} not found`, 404);
  }

  return ok(message);
});

export const PATCH = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin", "staff"]);

  const params = await context.params;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Message ID is required", 400);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = messagePatchSchema.parse(json);
  await service.setMessageReadStatus(id, parsed.read);

  return ok({ success: true, id, read: parsed.read });
});

export const DELETE = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin"]);

  const params = await context.params;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Message ID is required", 400);

  await service.deleteMessage(id);
  return ok({ success: true, id });
});
