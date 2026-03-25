import { type NextRequest, NextResponse } from 'next/server'
import { hasSupabaseServerConfig } from '@/lib/env'

export async function middleware(request: NextRequest) {
  // Only run Supabase session middleware when env vars are present
  let response: NextResponse
  
  if (hasSupabaseServerConfig()) {
    const { updateSession } = await import('@/lib/supabase/proxy')
    response = await updateSession(request)
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
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.com cdn.jsdelivr.net unpkg.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net unpkg.com fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' *.supabase.co *.vercel.com; frame-ancestors 'none';"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
