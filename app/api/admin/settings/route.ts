import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { clinicSettingsSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/settingsService";

export const GET = withHandler(async (request: Request) => {
  await requireRole(request, ["admin"]);
  const settings = await service.getClinicSettings();
  return ok(settings);
});

export const PUT = withHandler(async (request: Request) => {
  await requireRole(request, ["admin"]);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = clinicSettingsSchema.parse(json);
  const updated = await service.updateClinicSettings(parsed);

  return ok(updated);
});
