import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "nexops_session";

const PROTECTED_HOMEOWNER = /^\/dashboard\/homeowner/;
const PROTECTED_CONTRACTOR = /^\/dashboard\/contractor/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  const isProtectedHomeowner = PROTECTED_HOMEOWNER.test(pathname);
  const isProtectedContractor = PROTECTED_CONTRACTOR.test(pathname);

  if (!isProtectedHomeowner && !isProtectedContractor) {
    return response;
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For role validation we rely on the API layer since middleware
  // cannot import Node.js-only modules (like the in-memory store).
  // A dedicated /api/auth/me call happens client-side after hydration.
  // Basic protection: token present → allow through.
  // Granular role enforcement happens in the dashboard pages themselves.
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};
