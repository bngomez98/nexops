/**
 * POST /api/cron/document-expiry
 *
 * Checks for compliance documents expiring within 30 days and sends
 * warning emails to the affected contractors.
 *
 * Invoked by Vercel Cron (see vercel.json) once per day.
 * Secured by CRON_SECRET header check.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendDocumentExpiringEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron invocation
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const admin = getAdminClient()

    const now         = new Date()
    const in30Days    = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    type ExpiringDoc = { id: string; user_id: string; type: string; expires_at: string }

    // Fetch compliance documents expiring within the next 30 days
    const { data: expiringDocs, error } = await admin
      .from('documents')
      .select('id, user_id, type, expires_at')
      .in('type', ['license', 'insurance', 'eo_insurance'])
      .gte('expires_at', now.toISOString())
      .lte('expires_at', in30Days.toISOString()) as { data: ExpiringDoc[] | null; error: unknown }

    if (error) {
      console.error('[cron/document-expiry] db error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!expiringDocs || expiringDocs.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No documents expiring soon' })
    }

    // Group by user to avoid duplicate emails for the same user on the same run
    const byUser: Record<string, ExpiringDoc[]> = {}
    for (const doc of expiringDocs) {
      if (!byUser[doc.user_id]) byUser[doc.user_id] = []
      byUser[doc.user_id].push(doc)
    }

    let sentCount = 0

    await Promise.all(
      Object.entries(byUser).map(async ([userId, docs]) => {
        try {
          // Fetch user email via service role
          const { data: authUser } = await admin.auth.admin.getUserById(userId)
          const email = authUser.user?.email
          if (!email) return

          // Fetch user name from profiles
          const { data: profile } = await admin
            .from('profiles')
            .select('full_name')
            .eq('id', userId)
            .maybeSingle() as { data: { full_name: string | null } | null }

          const name = profile?.full_name ?? 'Contractor'

          // Send one email per expiring document (contractors may have both license + insurance)
          for (const doc of docs) {
            await sendDocumentExpiringEmail({
              to:        email,
              name,
              docType:   doc.type,
              expiresAt: doc.expires_at,
            })
            sentCount++
          }
        } catch (err) {
          console.error(`[cron/document-expiry] error for user ${userId}:`, err)
        }
      })
    )

    return NextResponse.json({
      sent: sentCount,
      users: Object.keys(byUser).length,
    })
  } catch (err) {
    console.error('[cron/document-expiry] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
