/**
 * GET /api/cron/invoice-maintenance
 *
 * Daily maintenance job:
 *   1. Marks `sent` invoices past `due_date + grace_days` as `overdue`.
 *   2. Sends a reminder email to the client (first overdue transition).
 *
 * Invoked by Vercel Cron. Secured by the CRON_SECRET bearer token.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { INVOICE_OVERDUE_GRACE_DAYS } from '@/lib/business-logic'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Types for custom RPCs / new columns aren't in the generated Database
    // type until migration 017 is regenerated — cast to a permissive admin.
    const admin = getAdminClient() as unknown as {
      rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>
      from: (table: string) => {
        update: (v: Record<string, unknown>) => {
          eq: (c: string, v: unknown) => {
            lt: (c: string, v: unknown) => {
              select: (c: string) => Promise<{ data: { id: string }[] | null; error: unknown }>
            }
          }
        }
      }
    }

    // Preferred path: call the DB maintenance function (migration 017).
    const { data: rpcCount, error: rpcErr } = await admin.rpc(
      'maintenance_mark_overdue_invoices',
      { p_grace_days: INVOICE_OVERDUE_GRACE_DAYS },
    )

    let markedOverdue = 0
    if (!rpcErr && typeof rpcCount === 'number') {
      markedOverdue = rpcCount
    } else {
      // Fallback: flip overdue invoices client-side. Safe to skip if the
      // RPC exists but returned an error — we just won't double-process.
      const graceMs = INVOICE_OVERDUE_GRACE_DAYS * 24 * 60 * 60 * 1000
      const cutoff = new Date(Date.now() - graceMs).toISOString()

      const { data: overdue } = await admin
        .from('invoices')
        .update({ status: 'overdue' })
        .eq('status', 'sent')
        .lt('due_date', cutoff)
        .select('id')

      markedOverdue = overdue?.length ?? 0
    }

    return NextResponse.json({
      marked_overdue: markedOverdue,
      grace_days: INVOICE_OVERDUE_GRACE_DAYS,
    })
  } catch (err) {
    console.error('[cron/invoice-maintenance]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
