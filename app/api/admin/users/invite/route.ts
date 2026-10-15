import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { userInviteSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/userService";

export const POST = withHandler(async (request: Request) => {
  await requireRole(request, ["admin"]);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = userInviteSchema.parse(json);
  const invitedUser = await service.inviteUser(parsed);

  return ok(invitedUser, { status: 201 });
});
