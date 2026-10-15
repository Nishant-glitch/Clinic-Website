import { ok } from "@/lib/api";
import { withHandler } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import * as service from "@/lib/server/services/appointmentService";
import type { AppointmentStatus } from "@/lib/types";

export const GET = withHandler(async (request: Request) => {
  await requireRole(request, ["admin", "staff"]);

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") || "all") as AppointmentStatus | "all";
  const serviceFilter = searchParams.get("service") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const q = searchParams.get("q") || undefined;
  const cursor = searchParams.get("cursor") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  const result = await service.listAppointments({
    status,
    service: serviceFilter,
    from,
    to,
    q,
    cursor,
    limit,
  });

  return ok(result);
});
