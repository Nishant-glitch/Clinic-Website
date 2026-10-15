import { ok } from "@/lib/api";
import { withHandler } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import * as service from "@/lib/server/services/messageService";

export const GET = withHandler(async (request: Request) => {
  await requireRole(request, ["admin", "staff"]);

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const q = searchParams.get("q") || undefined;
  const cursor = searchParams.get("cursor") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  const result = await service.listMessages({
    unreadOnly,
    q,
    cursor,
    limit,
  });

  return ok(result);
});
