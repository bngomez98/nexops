import { createServerClient } from '@supabase/ssr'
import { getSupabaseServerConfig } from '@/lib/env'

function parseCookies(cookieHeader: string): Array<{ name: string; value: string }> {
  return cookieHeader
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const eqIdx = pair.indexOf('=')
      if (eqIdx === -1) return { name: pair, value: '' }
      return { name: pair.slice(0, eqIdx).trim(), value: pair.slice(eqIdx + 1) }
    })
}

/**
 * Creates a Supabase server client scoped to the given HTTP request.
 *
 * Pass the incoming `Request` object so cookies can be read directly from its
 * headers without relying on any framework-specific cookie store.
 *
 * Cookie writes are best-effort (they surface through the Supabase session
 * proxy in middleware.ts).  If you need guaranteed cookie propagation use
 * the proxy-based flow from lib/supabase/proxy.ts.
 */
export function createClient(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookiePairs = parseCookies(cookieHeader)
  const supabaseConfig = getSupabaseServerConfig()

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookiePairs
      },
      setAll() {
        // Cookie writes are handled by the session proxy in middleware.
        // Route handlers that need to mutate session cookies should redirect
        // through the proxy or set Set-Cookie headers on their Response directly.
      },
    },
  })
}
