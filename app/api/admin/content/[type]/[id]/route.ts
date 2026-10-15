import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import { requireRole } from "@/lib/server/auth";
import {
  serviceAdminSchema,
  galleryAdminSchema,
  testimonialAdminSchema,
  faqAdminSchema,
} from "@/lib/validators/admin";
import * as service from "@/lib/server/services/contentService";

export const GET = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin"]);

  const params = await context.params;
  const type = params?.type as string;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Item ID is required", 400);

  let item: unknown = null;

  switch (type) {
    case "services":
      item = await service.getService(id);
      break;
    default:
      throw new AppError("INVALID_CONTENT_TYPE", `Unknown content type '${type}'`, 400);
  }

  if (!item) {
    throw new AppError("NOT_FOUND", `Item ${id} not found in ${type}`, 404);
  }

  return ok(item);
});

export const PATCH = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin"]);

  const params = await context.params;
  const type = params?.type as string;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Item ID is required", 400);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON payload", 400);
  }

  let updated: unknown;

  switch (type) {
    case "services": {
      const parsed = serviceAdminSchema.partial().parse(json);
      updated = await service.updateService(id, parsed);
      break;
    }
    case "gallery": {
      const parsed = galleryAdminSchema.partial().parse(json);
      updated = await service.updateGalleryImage(id, parsed);
      break;
    }
    case "testimonials": {
      const parsed = testimonialAdminSchema.partial().parse(json);
      updated = await service.updateTestimonial(id, parsed);
      break;
    }
    case "faqs": {
      const parsed = faqAdminSchema.partial().parse(json);
      updated = await service.updateFaq(id, parsed);
      break;
    }
    default:
      throw new AppError("INVALID_CONTENT_TYPE", `Unknown content type '${type}'`, 400);
  }

  return ok(updated);
});

export const DELETE = withHandler(async (request: Request, context) => {
  await requireRole(request, ["admin"]);

  const params = await context.params;
  const type = params?.type as string;
  const id = params?.id as string;
  if (!id) throw new AppError("INVALID_ID", "Item ID is required", 400);

  switch (type) {
    case "services":
      await service.deleteService(id);
      break;
    case "gallery":
      await service.deleteGalleryImage(id);
      break;
    case "testimonials":
      await service.deleteTestimonial(id);
      break;
    case "faqs":
      await service.deleteFaq(id);
      break;
    default:
      throw new AppError("INVALID_CONTENT_TYPE", `Unknown content type '${type}'`, 400);
  }

  return ok({ success: true, id, type });
});
