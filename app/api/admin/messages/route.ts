import { ok } from "@/lib/api";

// TODO: In Step 4 (APIs & backend logic), authenticate staff/admin role, fetch contact messages from Firestore, and allow marking as read/archived.
export async function GET() {
  return ok({
    messages: [],
    message: "Admin messages endpoint placeholder",
  });
}
