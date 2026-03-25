/**
 * Supabase admin client — uses the service role key.
 * NEVER expose this on the client side.
 * Only import from server-side code (API routes, server actions).
 */
import 'server-only'
import { createClient } from '@supabase/supabase-js'

let _admin: ReturnType<typeof createClient> | null = null

export function getAdminClient() {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!url || !key) {
    throw new Error('Supabase admin credentials not configured (SUPABASE_SERVICE_ROLE_KEY missing)')
  }
  _admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return _admin
}

export function createAdminClient() {
  return getAdminClient()
}
