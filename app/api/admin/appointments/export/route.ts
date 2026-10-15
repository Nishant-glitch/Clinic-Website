import { withHandler } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import * as service from "@/lib/server/services/appointmentService";
import type { AppointmentStatus } from "@/lib/types";

export const GET = withHandler(async (request: Request) => {
  await requireRole(request, ["admin"]);

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") || "all") as AppointmentStatus | "all";
  const serviceFilter = searchParams.get("service") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const q = searchParams.get("q") || undefined;

  const csv = await service.exportAppointmentsCsv({
    status,
    service: serviceFilter,
    from,
    to,
    q,
  });

  const nowStr = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="appointments-export-${nowStr}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});
