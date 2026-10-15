import "server-only";
import type { Role } from "@/lib/types";
import { AppError } from "./errors";

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Retrieves the authenticated user from the request session.
 * In development with ADMIN_DEV_BYPASS=true, returns a dev user.
 * In production or without bypass, checks for session cookie (verified cryptographically in Step 6).
 */
export async function getCurrentUser(request: Request): Promise<AuthUser | null> {
  // TODO(step-6): Replace temporary dev bypass with full Firebase Admin Auth session cookie verification

  if (
    process.env.NODE_ENV === "development" &&
    process.env.ADMIN_DEV_BYPASS === "true"
  ) {
    // Check if client passed an x-dev-role header for testing role permissions
    const devRole = request.headers.get("x-dev-role");
    const role: Role = devRole === "staff" ? "staff" : "admin";

    return {
      uid: "dev-admin-user",
      email: role === "staff" ? "staff@clinic.com" : "admin@clinic.com",
      name: role === "staff" ? "Clinic Receptionist" : "Dr. Rajiv Sharma",
      role,
    };
  }

  // Production check: inspect session / __session cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(?:__session|session)=([^;]+)/);
  if (!match) {
    return null;
  }

  // TODO(step-6): adminAuth.verifySessionCookie(sessionCookie, true)
  return null;
}

/**
 * Enforces authentication and authorization for API route handlers.
 * Throws 401 UNAUTHORIZED if not logged in.
 * Throws 403 FORBIDDEN if user role is not in allowedRoles.
 */
export async function requireRole(
  request: Request,
  allowedRoles: Role[]
): Promise<AuthUser> {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new AppError(
      "UNAUTHORIZED",
      "Authentication required to access this resource",
      401
    );
  }

  if (!allowedRoles.includes(user.role)) {
    throw new AppError(
      "FORBIDDEN",
      `Access denied. Requires one of [${allowedRoles.join(", ")}] roles.`,
      403
    );
  }

  return user;
}
