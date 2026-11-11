/**
 * GET /api/cron/document-expiry
 *
 * Scheduled daily at 09:00 UTC (see vercel.json / app.config.yaml).
 * Sends warning emails to contractors whose compliance documents
 * (license, insurance) expire within the next 30 days.
 *
 * Authentication: `Authorization: Bearer <CRON_SECRET>` header required.
 */

import { getAdminClient } from '@/lib/supabase/admin'
import { sendDocumentExpiryWarningEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const WARN_DAYS = 30

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
    const warnBefore = new Date(Date.now() + WARN_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const now = new Date().toISOString()

    // Documents that expire within the next 30 days and aren't already expired.
    const { data: expiringDocsRaw, error } = await supabase
      .from('documents')
      .select('user_id, type, expires_at')
      .in('type', ['license', 'insurance'])
      .not('expires_at', 'is', null)
      .gt('expires_at', now)
      .lte('expires_at', warnBefore)
      .eq('status', 'approved')

    const expiringDocs = expiringDocsRaw as Array<{ user_id: string; type: string; expires_at: string }> | null

    if (error) {
      console.error('[cron/document-expiry] query error:', error)
      return Response.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!expiringDocs || expiringDocs.length === 0) {
      return Response.json({ warned: 0 })
    }

    // Group by user so we send at most one email per contractor.
    const byUser = new Map<string, { type: string; expires_at: string }[]>()
    for (const doc of expiringDocs) {
      const uid = doc.user_id as string
      const list = byUser.get(uid) ?? []
      list.push({ type: doc.type as string, expires_at: doc.expires_at as string })
      byUser.set(uid, list)
    }

    let warned = 0
    for (const [userId, docs] of byUser) {
      try {
        // Look up contractor's auth email.
        const { data: authData } = await supabase.auth.admin.getUserById(userId)
        const email = authData.user?.email
        if (!email) continue

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .maybeSingle() as { data: { full_name?: string } | null }

        await sendDocumentExpiryWarningEmail({
          to: email,
          contractorName: profile?.full_name ?? 'Contractor',
          expiringDocuments: docs.map(d => ({
            type: d.type,
            expiresAt: d.expires_at,
          })),
        })
        warned++
      } catch (emailErr) {
        console.error('[cron/document-expiry] email error for user', userId, emailErr)
      }
    }

    return Response.json({ warned })
  } catch (err) {
    console.error('[GET /api/cron/document-expiry]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
