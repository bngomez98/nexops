import { NextResponse } from 'next/server'
import { getDatabaseUrl, getDatabaseUrlUnpooled } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
  }

  // Check Supabase connectivity if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { error } = await supabase.from('profiles').select('id').limit(1)
      health.database = error ? 'error' : 'connected'

      const { data: schemaHealth, error: schemaError } = await supabase
        .rpc('schema_health_check')

      health.schema = schemaError
        ? { ok: false, error: schemaError.message }
        : schemaHealth
    } catch (err) {
      console.error(err)
      health.database = 'unavailable'
      health.schema = { ok: false, error: 'schema_health_check_unavailable' }
    }
  } else {
    health.database = 'not_configured'
    health.schema = { ok: false, error: 'supabase_not_configured' }
  }

  // Report Neon / Postgres connection availability (set by Vercel–Neon integration)
  health.neon = {
    pooled: getDatabaseUrl() ? 'configured' : 'not_configured',
    unpooled: getDatabaseUrlUnpooled() ? 'configured' : 'not_configured',
  }

  return NextResponse.json(health)
}
