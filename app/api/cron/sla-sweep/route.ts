/**
 * GET /api/cron/sla-sweep
 *
 * Every 5 minutes:
 *   1. Flags unclaimed service_requests past their sla_respond_by deadline
 *      (sla_breached = true). Runs the DB RPC from migration 017.
 *   2. Surfaces breached requests to admin for manual dispatch.
 *
 * Invoked by Vercel Cron. Secured by CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Types for the custom RPC / new columns aren't in the generated
    // Database type until 017 has been regenerated — use a permissive cast.
    const admin = getAdminClient() as unknown as {
      rpc: (fn: string) => Promise<{ data: unknown; error: unknown }>
      from: (table: string) => {
        update: (v: Record<string, unknown>) => {
          eq: (c: string, v: unknown) => {
            is: (c: string, v: unknown) => {
              in: (c: string, v: unknown[]) => {
                lt: (c: string, v: unknown) => {
                  select: (c: string) => Promise<{ data: { id: string }[] | null }>
                }
              }
            }
          }
        }
      }
    }

    const { data: rpcCount, error: rpcErr } = await admin.rpc(
      'maintenance_flag_sla_breaches'
    )

    let flagged = 0
    if (!rpcErr && typeof rpcCount === 'number') {
      flagged = rpcCount
    } else {
      // Fallback — manual flip if RPC is missing.
      const nowIso = new Date().toISOString()
      const { data } = await admin
        .from('service_requests')
        .update({ sla_breached: true })
        .eq('sla_breached', false)
        .is('assigned_contractor_id', null)
        .in('status', ['pending_review', 'in_queue'])
        .lt('sla_respond_by', nowIso)
        .select('id')
      flagged = data?.length ?? 0
    }

    return NextResponse.json({ flagged_breaches: flagged })
  } catch (err) {
    console.error('[cron/sla-sweep]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
