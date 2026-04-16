import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseServerConfig } from '@/lib/env'

/**
 * Creates a Supabase server client for Next.js App Router contexts.
 *
 * Works in server components, server actions, and route handlers. Cookie
 * writes from auth refresh are best-effort; they only propagate when the
 * caller is a route handler or server action (cookies() is read-only in
 * server components). The middleware in lib/supabase/proxy.ts handles
 * session refresh on every request, so cookies stay in sync regardless.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseServerConfig()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // setAll was called from a server component; ignore.
        }
      },
    },
  })
}
