import { ok, fail } from "@/lib/api";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Health check endpoint.
 * Validates that server environment is healthy and Admin SDK can connect to Firestore.
 * No sensitive secrets or credentials are ever exposed in the response.
 */
export async function GET() {
  try {
    // Ping Firestore by querying the settings collection with limit(1)
    await adminDb.collection("settings").limit(1).get();

    return ok({
      ok: true,
      firestore: "connected",
      time: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Database connection failed";
    console.error("Health check error:", errorMessage);

    return fail(
      "HEALTH_CHECK_FAILED",
      `Unable to reach Firestore: ${errorMessage}`,
      503
    );
  }
}
