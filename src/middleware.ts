import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Handle CORS for API requests
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return response;
  }

  // Specific logic for the API domain (tracktrack.pages.dev)
  if (hostname.includes("tracktrack.pages.dev")) {
    // If trying to access dashboard pages on the API domain, redirect to main domain
    if (
      pathname.startsWith("/dashboard") ||
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password")
    ) {
      return NextResponse.redirect(
        new URL(`https://quanlythoigian.io.vn${pathname}`, request.url),
      );
    }

    // Allow access to API endpoints and tracker.js
    if (pathname.startsWith("/api/") || pathname === "/tracker.js") {
      return NextResponse.next();
    }

    // For any other path on API domain, show the API info page
    if (pathname !== "/index.html" && !pathname.includes(".")) {
      return NextResponse.rewrite(new URL("/index.html", request.url));
    }
  }

  // Specific logic for the main domain (quanlythoigian.io.vn)
  if (hostname.includes("quanlythoigian.io.vn")) {
    // If trying to access API endpoints directly on main domain, redirect to API domain
    if (pathname.startsWith("/api/") && process.env.NODE_ENV === "production") {
      return NextResponse.redirect(
        new URL(`https://tracktrack.pages.dev${pathname}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
