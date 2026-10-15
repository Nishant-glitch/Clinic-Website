import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { appointmentPatchSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/appointmentService";

export const GET = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin", "staff"]);

  const params = await context.params;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Appointment ID is required", 400);

  const appointment = await service.getAppointment(id);
  if (!appointment) {
    throw new AppError("NOT_FOUND", `Appointment ${id} not found`, 404);
  }

  return ok(appointment);
});

export const PATCH = withHandler(async (request: Request, context) => {
  const user = await requireRole(request, ["admin", "staff"]);

  const params = await context.params;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Appointment ID is required", 400);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = appointmentPatchSchema.parse(json);

  const updated = await service.updateAppointment(id, parsed, {
    uid: user.uid,
    name: user.name,
    role: user.role,
  });

  return ok(updated);
});
