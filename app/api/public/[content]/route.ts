import { ok } from "@/lib/api";
import { withHandler, AppError } from "@/lib/server/errors";
import * as contentService from "@/lib/server/services/contentService";
import * as settingsService from "@/lib/server/services/settingsService";

export const GET = withHandler(async (_request: Request, context) => {
  const params = await context.params;
  const content = (params?.content as string) || "";

  let data: unknown;

  switch (content) {
    case "services":
      data = await contentService.listServices(true);
      break;
    case "testimonials":
      data = await contentService.listTestimonials();
      break;
    case "faqs":
      data = await contentService.listFaqs(true);
      break;
    case "gallery":
      data = await contentService.listGalleryImages();
      break;
    case "settings":
      data = await settingsService.getClinicSettings();
      break;
    default:
      throw new AppError("NOT_FOUND", `Resource '${content}' not found`, 404);
  }

  const response = ok(data);
  response.headers.set(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );
  return response;
});
