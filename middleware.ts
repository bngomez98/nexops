import { type NextRequest, NextResponse } from 'next/server'
import { hasSupabaseServerConfig } from '@/lib/env'

export async function middleware(request: NextRequest) {
  // Only run Supabase session middleware when env vars are present
  let response: NextResponse
  
  if (hasSupabaseServerConfig()) {
    try {
      const { updateSession } = await import('@/lib/supabase/proxy')
      response = await updateSession(request)
    } catch (error) {
      console.error('Middleware session update failed', error)
      response = NextResponse.next()
    }
  } else {
    response = NextResponse.next()
  }

  // Add security headers to every response
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  )
  // 'unsafe-eval' is retained because bundled Supabase and some Radix
  // primitives rely on Function constructors at runtime. Remove once
  // those upstream dependencies drop that requirement.
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // same-origin assets + Vercel CDN + Zendesk widget + Google badge
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.com cdn.jsdelivr.net unpkg.com static.zdassets.com ekr.zdassets.com apis.google.com",
      "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net unpkg.com fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' fonts.gstatic.com",
      // same-origin + Supabase (auth + real-time) + Vercel + Zendesk API
      "connect-src 'self' *.supabase.co *.vercel.com *.zendesk.com *.zopim.com wss://*.zendesk.com wss://*.zopim.com",
      // Zendesk widget iframe
      "frame-src *.zendesk.com https://www.google.com",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
