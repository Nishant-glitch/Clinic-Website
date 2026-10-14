import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for protecting `/admin/*` routes.
 * Matches /admin/:path* except /admin/login.
 * For now: if no "session" cookie, redirects to /admin/login.
 * (Full cryptographic token verification and role custom claims check comes in Step 6.)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except /admin/login
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for "session" cookie (also accepts "__session" for Firebase hosting compatibility)
    const sessionCookie =
      request.cookies.get("session")?.value ||
      request.cookies.get("__session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
