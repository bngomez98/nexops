import { type NextRequest, NextResponse } from "next/server"

const SECURITY_HEADERS: Record<string, string> = {
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
    // Next.js requires unsafe-inline for style and script injection; eval for RSC
    // Google Tag Manager, Google Analytics, and iubenda CMP scripts are also permitted
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://cs.iubenda.com https://cdn.iubenda.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Allow images from self, data URIs, blobs, and any HTTPS source (for OG/meta images)
    "img-src 'self' data: blob: https:",
    // Vercel Analytics, Google Analytics (GA4 + Ads), and iubenda endpoints
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://region1.analytics.google.com https://www.googleadservices.com https://cs.iubenda.com https://cdn.iubenda.com",
    // Google Ads conversion measurement uses DoubleClick iframes
    "frame-src https://bid.g.doubleclick.net https://td.doubleclick.net",
    // No embedding of this page in any frame
    "frame-ancestors 'none'",
    // No plugin objects
    "object-src 'none'",
    // Restrict form submissions to same origin
    "form-action 'self'",
    // Only load resources over HTTPS
    "upgrade-insecure-requests",
  ].join("; "),
}

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Redirect www → non-www (canonical domain enforcement)
  if (hostname.startsWith("www.")) {
    const url = request.nextUrl.clone()
    url.hostname = hostname.slice(4)
    return NextResponse.redirect(url, { status: 301 })
  }

  // Strip trailing slashes from all paths except root (canonical URL normalization)
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, { status: 301 })
  }

  const response = NextResponse.next()

  // Apply security headers to every response
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all paths except:
     * - _next/static  (static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt (crawlers/metadata)
     * - Public folder static assets (images, icons, fonts)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
}
