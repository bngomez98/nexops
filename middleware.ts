import { type NextRequest, NextResponse } from 'next/server'
import { hasSupabaseServerConfig } from '@/lib/env'

export async function middleware(request: NextRequest) {
  // Only run Supabase session middleware when env vars are present
  if (hasSupabaseServerConfig()) {
    const { updateSession } = await import('@/lib/supabase/proxy')
    return await updateSession(request)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
