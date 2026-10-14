import { revalidatePath } from "next/cache";
import { ok, fail } from "@/lib/api";

// TODO: In Step 4 (APIs & backend logic), protect with secret bearer token or admin session check, and revalidate affected paths.
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    const secret = searchParams.get("secret");

    if (process.env.REVALIDATION_SECRET && secret !== process.env.REVALIDATION_SECRET) {
      return fail("UNAUTHORIZED", "Invalid revalidation secret", 401);
    }

    revalidatePath(path);
    return ok({ revalidated: true, path, now: Date.now() });
  } catch {
    return fail("REVALIDATION_ERROR", "Error revalidating path", 500);
  }
}
