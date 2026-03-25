import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
