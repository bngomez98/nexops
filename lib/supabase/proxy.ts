import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig } from '@/lib/supabase/config'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseConfig = getSupabaseConfig()

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  const authOnlyPaths = ['/auth/login', '/auth/sign-up', '/auth/forgot-password']
  if (user && authOnlyPaths.some((p) => pathname === p || pathname.startsWith(`${p}?`))) {
    const url = request.nextUrl.clone()
    const role = user.user_metadata?.role
    url.pathname = role === 'contractor' ? '/dashboard/contractor' : '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
