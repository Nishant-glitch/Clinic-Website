import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getClinicSettingsDocument } from "@/lib/firebase/collections";
import { siteConfig } from "@/lib/config/site";
import type { ServerClinicSettings } from "@/lib/types";

export function getDefaultClinicSettings(): ServerClinicSettings {
  return {
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.phone,
    phoneDisplay: siteConfig.phoneDisplay,
    whatsapp: siteConfig.whatsapp,
    whatsappDisplay: siteConfig.whatsappDisplay,
    email: siteConfig.email,
    doctor: {
      name: siteConfig.doctor.name,
      qualification: siteConfig.doctor.qualification,
      experience: siteConfig.doctor.experience,
      specialization: siteConfig.doctor.specialization,
      registrationNumber: siteConfig.doctor.registrationNumber,
      bio: siteConfig.doctor.bio,
    },
    address: {
      street: siteConfig.address.street,
      area: siteConfig.address.area,
      city: siteConfig.address.city,
      state: siteConfig.address.state,
      pincode: siteConfig.address.pincode,
      fullAddress: siteConfig.address.fullAddress,
    },
    timings: {
      days: siteConfig.timings.days,
      morning: siteConfig.timings.morning,
      evening: siteConfig.timings.evening,
      sunday: siteConfig.timings.sunday,
      emergencyNote: siteConfig.timings.emergencyNote,
    },
    mapEmbedUrl: siteConfig.mapEmbedUrl,
    socialLinks: {
      facebook: siteConfig.socialLinks.facebook,
      instagram: siteConfig.socialLinks.instagram,
      youtube: siteConfig.socialLinks.youtube,
      twitter: siteConfig.socialLinks.twitter,
    },
    updatedAt: Timestamp.now(),
  };
}

export async function getClinicSettings(): Promise<ServerClinicSettings> {
  const docRef = getClinicSettingsDocument();
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return getDefaultClinicSettings();
  }

  return snapshot.data() || getDefaultClinicSettings();
}

export async function updateClinicSettings(
  patch: Partial<ServerClinicSettings>
): Promise<ServerClinicSettings> {
  const docRef = getClinicSettingsDocument();
  const updatePayload = {
    ...patch,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(updatePayload as unknown as ServerClinicSettings, { merge: true });
  return getClinicSettings();
}
