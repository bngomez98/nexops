import { NextResponse } from "next/server"

const SECURITY_HEADERS = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Restrict browser features — only what the app actually needs
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
  // Enable DNS prefetching for performance
  "X-DNS-Prefetch-Control": "on",
  // Enforce HTTPS for 2 years, include subdomains, signal for preload list
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // Cross-Origin Opener Policy: prevent cross-origin window access
  "Cross-Origin-Opener-Policy": "same-origin",
  // Cross-Origin Resource Policy: only serve resources to same-origin by default
  "Cross-Origin-Resource-Policy": "same-origin",
  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
}

export function middleware(request) {
  const { pathname, hostname } = request.nextUrl

  // Redirect www → non-www (canonical domain enforcement)
  if (hostname.startsWith("www.")) {
    const url = request.nextUrl.clone()
    url.hostname = hostname.slice(4)
    return NextResponse.redirect(url, { status: 301 })
  }

  // Strip trailing slashes from all paths except root
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, { status: 301 })
  }

  const response = NextResponse.next()

  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
}
