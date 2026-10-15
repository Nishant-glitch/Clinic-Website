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

  switch (type) {
    case "services": {
      const items = await service.listServices(false);
      return ok(items);
    }
    case "gallery": {
      const items = await service.listGalleryImages();
      return ok(items);
    }
    case "testimonials": {
      const items = await service.listTestimonials(false);
      return ok(items);
    }
    case "faqs": {
      const items = await service.listFaqs(false);
      return ok(items);
    }
    default:
      throw new AppError("INVALID_CONTENT_TYPE", `Unknown content type '${type}'`, 400);
  }
});

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

  switch (type) {
    case "services": {
      const parsed = serviceAdminSchema.parse(json);
      const created = await service.createService(parsed);
      return ok(created, { status: 201 });
    }
    case "gallery": {
      const parsed = galleryAdminSchema.parse(json);
      const created = await service.createGalleryImage(parsed);
      return ok(created, { status: 201 });
    }
    case "testimonials": {
      const parsed = testimonialAdminSchema.parse(json);
      const created = await service.createTestimonial(parsed);
      return ok(created, { status: 201 });
    }
    case "faqs": {
      const parsed = faqAdminSchema.parse(json);
      const created = await service.createFaq(parsed);
      return ok(created, { status: 201 });
    }
    default:
      throw new AppError("INVALID_CONTENT_TYPE", `Unknown content type '${type}'`, 400);
  }
});
