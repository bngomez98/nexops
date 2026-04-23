/**
 * GET /api/cron/sla-sweep
 *
 * Scheduled every 5 minutes (see vercel.json / app.config.yaml).
 * Calls the `maintenance_flag_sla_breaches` DB function, which sets
 * `sla_breached = true` on service_requests that are past their
 * `sla_respond_by` deadline and still unclaimed.
 *
 * Authentication: `Authorization: Bearer <CRON_SECRET>` header required.
 */

import { getAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase.rpc('maintenance_flag_sla_breaches' as never)

    if (error) {
      console.error('[cron/sla-sweep] rpc error:', error)
      return Response.json({ error: 'Database maintenance failed' }, { status: 500 })
    }

    return Response.json({ flagged: data ?? 0 })
  } catch (err) {
    console.error('[GET /api/cron/sla-sweep]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
