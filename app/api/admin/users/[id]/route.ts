import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { userPatchSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/userService";

export const PATCH = withHandler(async (request: Request, context) => {
  const actor = await requireRole(request, ["admin"]);

  const params = await context.params;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "User ID is required", 400);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = userPatchSchema.parse(json);

  if (parsed.role) {
    await service.updateUserRole(id, parsed.role, actor.uid);
  }

  if (parsed.status !== undefined) {
    await service.disableUser(id, parsed.status === "disabled", actor.uid);
  }

  return ok({ success: true, id, ...parsed });
});
