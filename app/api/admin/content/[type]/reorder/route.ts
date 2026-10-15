import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import { reorderSchema } from "@/lib/validators/admin";
import * as service from "@/lib/server/services/contentService";

export const POST = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin"]);

  const params = await context.params;
  const type = params?.type as string;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  const parsed = reorderSchema.parse(json);

  switch (type) {
    case "services":
      await service.reorderServices(parsed.ids);
      break;
    case "gallery":
      await service.reorderGalleryImages(parsed.ids);
      break;
    case "testimonials":
      await service.reorderTestimonials(parsed.ids);
      break;
    case "faqs":
      await service.reorderFaqs(parsed.ids);
      break;
    default:
      throw new AppError("INVALID_CONTENT_TYPE", `Unknown content type '${type}'`, 400);
  }

  return ok({ success: true, type, count: parsed.ids.length });
});
