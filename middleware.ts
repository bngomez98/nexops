import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export async function middleware(request: NextRequest) {
  // Handle /welcome route via Edge Config
  if (request.nextUrl.pathname === '/welcome') {
    const greeting = await get('greeting')
    return NextResponse.json(greeting)
  }

  // Only run Supabase session middleware when env vars are present
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { updateSession } = await import('@/lib/supabase/proxy')
    return await updateSession(request)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/welcome',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
