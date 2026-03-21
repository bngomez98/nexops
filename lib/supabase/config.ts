type SupabaseConfig = {
  url: string
  anonKey: string
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      // During static generation / build, return placeholder values.
      // Supabase calls will fail at runtime without real env vars,
      // but this prevents the build from crashing on prerendered pages.
      return { url: 'https://placeholder.supabase.co', anonKey: 'placeholder' }
    }
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }

  return { url, anonKey }
}
