import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
  }

  // Check Supabase connectivity if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { error } = await supabase.from('profiles').select('id').limit(1)
      health.database = error ? 'error' : 'connected'
    } catch {
      health.database = 'unavailable'
    }
  } else {
    health.database = 'not_configured'
  }

  return NextResponse.json(health)
}
