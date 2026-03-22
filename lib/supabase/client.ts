import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseBrowserConfig } from '@/lib/supabase/config'

export function createClient() {
  const supabaseConfig = getSupabaseBrowserConfig()
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey)
}
