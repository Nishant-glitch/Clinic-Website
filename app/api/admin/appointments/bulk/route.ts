import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { appointmentBulkSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/appointmentService";

export const POST = withHandler(async (request: Request) => {
  const user = await requireRole(request, ["admin"]);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = appointmentBulkSchema.parse(json);

  await service.bulkUpdateAppointments(parsed.ids, parsed.status, {
    name: user.name,
  });

  return ok({
    success: true,
    count: parsed.ids.length,
    status: parsed.status,
  });
});
