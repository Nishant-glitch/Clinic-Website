import "server-only";
import { revalidateTag, revalidatePath } from "next/cache";
import * as repo from "@/lib/server/repositories/settingsRepository";
import type { ServerClinicSettings } from "@/lib/types";

export async function getClinicSettings(): Promise<ServerClinicSettings> {
  return repo.getClinicSettings();
}

export async function updateClinicSettings(
  patch: Partial<ServerClinicSettings>
): Promise<ServerClinicSettings> {
  const updated = await repo.updateClinicSettings(patch);

  try {
    revalidateTag("settings", "max");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/appointment");
  } catch (err) {
    console.warn("[Settings Cache Revalidate] Warning:", err);
  }

  return updated;
}
