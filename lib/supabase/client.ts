import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from '@/lib/supabase/config'

export function createClient() {
  const supabaseConfig = getSupabaseConfig()
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey)
}
