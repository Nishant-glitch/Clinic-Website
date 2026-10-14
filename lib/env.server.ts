import "server-only";
import { z } from "zod";

export const serverEnvSchema = z.object({
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1, "FIREBASE_ADMIN_PROJECT_ID is required"),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email("FIREBASE_ADMIN_CLIENT_EMAIL must be a valid email"),
  FIREBASE_ADMIN_PRIVATE_KEY: z
    .string()
    .min(1, "FIREBASE_ADMIN_PRIVATE_KEY is required")
    .transform((key) => key.replace(/\\n/g, "\n")),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CLINIC_NOTIFY_EMAIL: z.string().email("CLINIC_NOTIFY_EMAIL must be a valid email"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  const rawValues = {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CLINIC_NOTIFY_EMAIL: process.env.CLINIC_NOTIFY_EMAIL,
  };

  const parsed = serverEnvSchema.safeParse(rawValues);

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `\n❌ Missing or invalid server environment variables:\n${errorDetails}\n\nPlease check your .env.local file.\n`
    );
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

/**
 * Validated server environment variables.
 * Protected by "server-only" - cannot be imported in client components.
 */
export const serverEnv = new Proxy({} as ServerEnv, {
  get(_target, prop: string | symbol) {
    return getServerEnv()[prop as keyof ServerEnv];
  },
});
