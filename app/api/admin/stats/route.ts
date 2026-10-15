import { ok } from "@/lib/api";
import { withHandler } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import * as service from "@/lib/server/services/statsService";

export const GET = withHandler(async (request: Request) => {
  await requireRole(request, ["admin", "staff"]);
  const stats = await service.getDashboardStats();
  return ok(stats);
});
