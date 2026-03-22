type SupabaseConfig = {
  url: string
  anonKey: string
}

const FALLBACK_SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://placeholder.supabase.co',
  anonKey: 'placeholder-anon-key',
}

export function getSupabaseBrowserConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (typeof window === 'undefined') {
      return FALLBACK_SUPABASE_CONFIG
    }

    throw new Error(
      'Missing Supabase browser environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }

  return { url, anonKey }
}
