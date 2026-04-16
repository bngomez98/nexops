/**
 * POST /api/match
 *
 * Distance-weighted, SLA-aware, compliance-checked contractor matching
 * for the Nexus Operations dispatch pipeline.
 *
 * Ranking (higher score wins):
 *   +40  primary trade match
 *   +25  within service radius (decays linearly by distance)
 *   +15/10/5  rating ≥ 4.5 / 4.0 / 3.5
 *   +10  verified + compliance docs current
 *   +10  has SLA headroom (< max_active_jobs)
 *
 * The DB-side match_contractors_by_distance() RPC does the heavy lift
 * (migration 017). We fall back to a TS scorer when the RPC is
 * unavailable (fresh Supabase that hasn't run 017 yet).
 */

import { createClient } from '@/lib/supabase/server'

import {
  sendJobMatchedContractorEmail,
  sendContractorAssignedClientEmail,
} from '@/lib/email'
import { milesBetween, scoreContractorMatch } from '@/lib/business-logic'

type Candidate = {
  contractor_id: string
  full_name?: string | null
  distance_miles?: number | null
  rating?: number | null
  active_projects?: number
  is_verified?: boolean
  score: number
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const jobId = body.job_id as string | undefined
    const requestId = body.request_id as string | undefined

    if (!jobId && !requestId) {
      return Response.json(
        { error: 'job_id or request_id is required' },
        { status: 400 }
      )
    }

    // ── Path A: service_requests (primary pipeline) ──────────────────
    if (requestId) {
      return await matchForServiceRequest(supabase, requestId)
    }

    // ── Path B: jobs (legacy pipeline) ───────────────────────────────
    return await matchForJob(supabase, jobId!)
  } catch (err) {
    console.error('[match] error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─────────────────────────────────────────────────────────────────────
// Service-request matching (primary flow)
// ─────────────────────────────────────────────────────────────────────

async function matchForServiceRequest(
  supabase: Awaited<ReturnType<typeof createClient>>,
  requestId: string,
) {
  const { data: req, error: reqErr } = await supabase
    .from('service_requests')
    .select('id, category, category_slug, urgency, lat, lng, zip_code, assigned_contractor_id, status')
    .eq('id', requestId)
    .single()

  if (reqErr || !req) {
    return Response.json({ error: 'Request not found' }, { status: 404 })
  }
  if (req.assigned_contractor_id) {
    return Response.json({ error: 'Request already assigned' }, { status: 400 })
  }

  // Try the DB RPC first (migration 017 present).
  const { data: rpcRows, error: rpcErr } = await supabase
    .rpc('match_contractors_by_distance', { p_request_id: requestId, p_max_results: 10 })

  let candidates: Candidate[] = []
  if (!rpcErr && Array.isArray(rpcRows) && rpcRows.length > 0) {
    candidates = rpcRows as Candidate[]
  } else {
    // Fallback: do the scoring in TS.
    candidates = await fallbackScoreContractors(supabase, req)
  }

  if (candidates.length === 0) {
    return Response.json({
      matched: false,
      reason: 'No eligible contractors within service radius',
    })
  }

  const winner = candidates[0]

  const { error: assignErr } = await supabase
    .from('service_requests')
    .update({
      assigned_contractor_id: winner.contractor_id,
      status: 'assigned',
    })
    .eq('id', requestId)
    .is('assigned_contractor_id', null)   // concurrency guard

  if (assignErr) {
    return Response.json({ error: 'Failed to assign contractor' }, { status: 500 })
  }

  // Consume a lead credit (best-effort — not fatal if table missing).
  await supabase.from('lead_credits').insert({
    contractor_id: winner.contractor_id,
    txn_type: 'consume_dispatch',
    amount: -1,
    request_id: requestId,
    note: 'Auto-dispatch via /api/match',
  }).then(() => {}, () => {})

  return Response.json({
    matched: true,
    request_id: requestId,
    contractor_id: winner.contractor_id,
    score: winner.score,
    distance_miles: winner.distance_miles ?? null,
    alternatives: candidates.slice(1, 5).map(c => ({
      contractor_id: c.contractor_id,
      score: c.score,
      distance_miles: c.distance_miles ?? null,
    })),
  })
}

async function fallbackScoreContractors(
  supabase: Awaited<ReturnType<typeof createClient>>,
  req: {
    id: string
    category: string | null
    category_slug: string | null
    urgency: string | null
    lat: number | null
    lng: number | null
  },
): Promise<Candidate[]> {
  const categoryKey = req.category_slug ?? req.category ?? ''

  const { data: contractors } = await supabase
    .from('contractor_profiles')
    .select('user_id, service_radius_miles, trade_categories, is_verified, is_available, primary_category, accepts_emergency, max_active_jobs, base_lat, base_lng')
    .eq('is_available', true)

  if (!contractors || contractors.length === 0) return []

  // Filter by category and (for emergencies) accepts_emergency.
  const eligible = contractors.filter((c: Record<string, unknown>) => {
    const tradeCategories = (c.trade_categories as string[] | null) ?? []
    const catMatch = tradeCategories.includes(categoryKey) || c.primary_category === categoryKey
    if (!catMatch) return false
    if (req.urgency === 'emergency' && !c.accepts_emergency) return false
    return true
  })
  if (eligible.length === 0) return []

  // Pull profile rating + compliance doc freshness.
  const ids = eligible.map((c: Record<string, unknown>) => c.user_id as string)
  const [{ data: profiles }, { data: expiredDocs }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, average_rating').in('id', ids),
    supabase.from('documents')
      .select('user_id')
      .in('user_id', ids)
      .in('type', ['license', 'insurance'])
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null),
  ])

  const profileById = new Map((profiles ?? []).map(p => [p.id as string, p]))
  const expiredIds = new Set((expiredDocs ?? []).map(d => d.user_id as string))

  // Active project counts per candidate.
  const { data: active } = await supabase
    .from('service_requests')
    .select('assigned_contractor_id')
    .in('assigned_contractor_id', ids)
    .in('status', ['assigned', 'consultation_scheduled', 'in_progress'])

  const activeCount: Record<string, number> = {}
  ;(active ?? []).forEach(r => {
    const id = r.assigned_contractor_id as string
    activeCount[id] = (activeCount[id] ?? 0) + 1
  })

  const candidates: Candidate[] = []
  for (const c of eligible) {
    const cid = c.user_id as string
    if (expiredIds.has(cid)) continue
    const profile = profileById.get(cid)
    const dist = milesBetween(
      { lat: req.lat, lng: req.lng },
      { lat: c.base_lat as number | null, lng: c.base_lng as number | null },
    )
    const radius = (c.service_radius_miles as number | null) ?? 25
    if (dist !== null && dist > radius) continue

    const score = scoreContractorMatch({
      isPrimaryCategory: c.primary_category === categoryKey,
      distanceMiles: dist,
      serviceRadiusMiles: radius,
      rating: (profile?.average_rating as number | null) ?? null,
      isVerified: Boolean(c.is_verified),
      activeProjects: activeCount[cid] ?? 0,
      maxActiveProjects: (c.max_active_jobs as number | null) ?? 10,
    })

    candidates.push({
      contractor_id: cid,
      full_name: profile?.full_name as string | null | undefined,
      distance_miles: dist,
      rating: (profile?.average_rating as number | null) ?? 0,
      active_projects: activeCount[cid] ?? 0,
      is_verified: Boolean(c.is_verified),
      score,
    })
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const da = a.distance_miles ?? Number.POSITIVE_INFINITY
    const db = b.distance_miles ?? Number.POSITIVE_INFINITY
    return da - db
  })

  return candidates
}

// ─────────────────────────────────────────────────────────────────────
// Legacy jobs-pipeline matching
// ─────────────────────────────────────────────────────────────────────

async function matchForJob(
  supabase: Awaited<ReturnType<typeof createClient>>,
  jobId: string,
) {
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*, properties(lat, lng, city, state)')
    .eq('id', jobId)
    .single()

  if (jobError || !job) {
    return Response.json({ error: 'Job not found' }, { status: 404 })
  }

  if (job.status !== 'open' && job.status !== 'unmatched') {
    return Response.json({ error: 'Job is not eligible for matching' }, { status: 400 })
  }

  const { data: contractors, error: ctError } = await supabase
    .from('contractor_profiles')
    .select('user_id, service_radius_miles, trade_categories, is_verified, is_available, base_lat, base_lng, primary_category, max_active_jobs')
    .eq('is_verified', true)
    .eq('is_available', true)
    .contains('trade_categories', [job.service_type])

  if (ctError) {
    console.error('Contractor query error:', ctError)
    return Response.json({ error: 'Failed to query contractors' }, { status: 500 })
  }

  if (!contractors || contractors.length === 0) {
    await supabase.from('jobs').update({ status: 'unmatched' }).eq('id', jobId)
    return Response.json({ matched: false, reason: 'No eligible contractors found' })
  }

  const { data: busy } = await supabase
    .from('jobs')
    .select('contractor_id')
    .in('status', ['matched', 'in_progress'])
    .not('contractor_id', 'is', null)

  const busyIds = new Set((busy ?? []).map(a => a.contractor_id as string))

  const { data: expiredDocs } = await supabase
    .from('documents')
    .select('user_id')
    .in('type', ['license', 'insurance'])
    .lt('expires_at', new Date().toISOString())
    .not('expires_at', 'is', null)

  const expiredIds = new Set((expiredDocs ?? []).map(d => d.user_id as string))

  const candidates: Candidate[] = []
  for (const c of contractors) {
    const cid = c.user_id as string
    if (busyIds.has(cid) || expiredIds.has(cid)) continue
    const dist = milesBetween(
      { lat: job.properties?.lat ?? null, lng: job.properties?.lng ?? null },
      { lat: c.base_lat as number | null, lng: c.base_lng as number | null },
    )
    const radius = (c.service_radius_miles as number | null) ?? 25
    if (dist !== null && dist > radius) continue

    const score = scoreContractorMatch({
      isPrimaryCategory: c.primary_category === job.service_type,
      distanceMiles: dist,
      serviceRadiusMiles: radius,
      rating: null,
      isVerified: Boolean(c.is_verified),
      activeProjects: 0,
      maxActiveProjects: (c.max_active_jobs as number | null) ?? 10,
    })
    candidates.push({ contractor_id: cid, distance_miles: dist, score })
  }

  if (candidates.length === 0) {
    await supabase.from('jobs').update({ status: 'unmatched' }).eq('id', jobId)
    return Response.json({ matched: false, reason: 'No contractors within service radius or all busy' })
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const da = a.distance_miles ?? Number.POSITIVE_INFINITY
    const db = b.distance_miles ?? Number.POSITIVE_INFINITY
    return da - db
  })

  const winner = candidates[0]

  const { error: assignError } = await supabase
    .from('jobs')
    .update({ contractor_id: winner.contractor_id, status: 'matched' })
    .eq('id', jobId)

  if (assignError) {
    return Response.json({ error: 'Failed to assign contractor' }, { status: 500 })
  }

  await supabase.from('matches').insert({
    job_id: jobId,
    contractor_id: winner.contractor_id,
    offered_at: new Date().toISOString(),
  })

  await supabase.from('job_status_history').insert({
    job_id: jobId,
    status: 'matched',
    changed_at: new Date().toISOString(),
    changed_by: 'system',
  })

  // Fire-and-forget notification emails.
  ;(async () => {
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const admin = getAdminClient()

      const [{ data: contractorAuth }, { data: clientAuth }] = await Promise.all([
        admin.auth.admin.getUserById(winner.contractor_id),
        admin.auth.admin.getUserById(job.client_id),
      ])
      const contractorEmail = contractorAuth.user?.email
      const clientEmail     = clientAuth.user?.email
      const [{ data: contractorProfile }, { data: clientProfile }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', winner.contractor_id).maybeSingle(),
        supabase.from('profiles').select('full_name').eq('id', job.client_id).maybeSingle(),
      ])
      const contractorName = contractorProfile?.full_name ?? 'Contractor'
      const clientName     = clientProfile?.full_name ?? 'Client'

      await Promise.all([
        contractorEmail
          ? sendJobMatchedContractorEmail({
              to: contractorEmail,
              name: contractorName,
              jobId,
              serviceType:   job.service_type,
              urgency:       job.urgency ?? 'routine',
              propertyCity:  job.properties?.city  ?? '',
              propertyState: job.properties?.state ?? '',
            })
          : Promise.resolve(),
        clientEmail
          ? sendContractorAssignedClientEmail({
              to: clientEmail,
              clientName,
              contractorName,
              serviceType: job.service_type,
              urgency:     job.urgency ?? 'routine',
              jobId,
            })
          : Promise.resolve(),
      ])
    } catch (err) {
      console.error('[match] email error:', err)
    }
  })()

  return Response.json({
    matched: true,
    job_id: jobId,
    contractor_id: winner.contractor_id,
    score: winner.score,
    distance_miles: winner.distance_miles ?? null,
    alternatives: candidates.slice(1, 5).map(c => ({
      contractor_id: c.contractor_id,
      score: c.score,
      distance_miles: c.distance_miles ?? null,
    })),
  })
}
