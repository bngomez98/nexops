/**
 * GET /api/cron/invoice-maintenance
 *
 * Scheduled daily at 09:15 UTC (see vercel.json / app.config.yaml).
 * Calls the `maintenance_mark_overdue_invoices` DB function, which flips
 * invoices with status 'sent' that are past their due_date + 3-day grace
 * period to status 'overdue'.
 *
 * Authentication: `Authorization: Bearer <CRON_SECRET>` header required.
 */

import { getAdminClient } from '@/lib/supabase/admin'
import { INVOICE_OVERDUE_GRACE_DAYS } from '@/lib/business-logic'

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

    const { data, error } = await supabase
      .rpc('maintenance_mark_overdue_invoices', { p_grace_days: INVOICE_OVERDUE_GRACE_DAYS } as never)

    if (error) {
      console.error('[cron/invoice-maintenance] rpc error:', error)
      return Response.json({ error: 'Database maintenance failed' }, { status: 500 })
    }

    return Response.json({ markedOverdue: data ?? 0 })
  } catch (err) {
    console.error('[GET /api/cron/invoice-maintenance]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
