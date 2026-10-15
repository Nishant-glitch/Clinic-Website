import { ok } from "@/lib/api";
import { withHandler } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import * as service from "@/lib/server/services/userService";

export const GET = withHandler(async (request: Request) => {
  await requireRole(request, ["admin"]);
  const users = await service.listUsers();
  return ok(users);
});
