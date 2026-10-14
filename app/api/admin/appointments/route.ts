import { ok } from "@/lib/api";

// TODO: In Step 4 (APIs & backend logic), authenticate staff/admin role, fetch appointments with pagination and status filters, and allow status updates.
export async function GET() {
  return ok({
    appointments: [],
    message: "Admin appointments endpoint placeholder",
  });
}

export async function PATCH() {
  return ok({
    message: "Admin appointment status update placeholder",
  });
}
