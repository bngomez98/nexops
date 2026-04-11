import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  sendJobMatchedContractorEmail,
  sendContractorAssignedClientEmail,
} from '@/lib/email'

/** Haversine formula — returns distance in miles between two lat/lng points */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check — only authenticated users can trigger matching
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { job_id } = body

    if (!job_id) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 })
    }

    // Fetch the job with property location
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*, properties(lat, lng, city, state)')
      .eq('id', job_id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.status !== 'open' && job.status !== 'unmatched') {
      return NextResponse.json({ error: 'Job is not eligible for matching' }, { status: 400 })
    }

    const jobLat = job.properties?.lat
    const jobLng = job.properties?.lng

    // Fetch eligible contractors:
    // - verified, available
    // - trade_categories contains the job's service_type
    const { data: contractors, error: ctError } = await supabase
      .from('contractor_profiles')
      .select('user_id, service_radius_miles, trade_categories, is_verified, is_available')
      .eq('is_verified', true)
      .eq('is_available', true)
      .contains('trade_categories', [job.service_type])

    if (ctError) {
      console.error('Contractor query error:', ctError)
      return NextResponse.json({ error: 'Failed to query contractors' }, { status: 500 })
    }

    if (!contractors || contractors.length === 0) {
      // Flag for manual assignment
      await supabase.from('jobs').update({ status: 'unmatched' }).eq('id', job_id)
      return NextResponse.json({ matched: false, reason: 'No eligible contractors found' })
    }

    // Get contractors who already have an active assignment (exclude them)
    const { data: activeAssignments } = await supabase
      .from('jobs')
      .select('contractor_id')
      .in('status', ['matched', 'in_progress'])
      .not('contractor_id', 'is', null)

    const busyContractorIds = new Set(activeAssignments?.map(a => a.contractor_id) ?? [])

    // Get contractors with expired compliance docs (exclude them)
    const now = new Date().toISOString()
    const { data: expiredDocs } = await supabase
      .from('documents')
      .select('user_id')
      .in('type', ['license', 'insurance'])
      .lt('expires_at', now)
      .not('expires_at', 'is', null)

    const expiredUserIds = new Set(expiredDocs?.map(d => d.user_id) ?? [])

    // Filter and score candidates
    type CandidateRow = {
      user_id: string
      service_radius_miles: number
    }

    const candidates = (contractors as CandidateRow[]).filter(c => {
      if (busyContractorIds.has(c.user_id)) return false
      if (expiredUserIds.has(c.user_id)) return false
      if (!jobLat || !jobLng) return true
      return (c.service_radius_miles ?? 25) >= 0
    })

    if (candidates.length === 0) {
      await supabase.from('jobs').update({ status: 'unmatched' }).eq('id', job_id)
      return NextResponse.json({ matched: false, reason: 'No contractors within service radius or all busy' })
    }

    // Rank candidates: closest first, then by completed job count
    const { data: completionCounts } = await supabase
      .from('jobs')
      .select('contractor_id')
      .eq('status', 'completed')
      .in('contractor_id', candidates.map(c => c.user_id))

    const countByContractor: Record<string, number> = {}
    completionCounts?.forEach(r => {
      countByContractor[r.contractor_id] = (countByContractor[r.contractor_id] ?? 0) + 1
    })

    candidates.sort((a, b) => {
      const distA = jobLat && jobLng ? haversineDistance(jobLat, jobLng, jobLat, jobLng) : 9999
      const distB = jobLat && jobLng ? haversineDistance(jobLat, jobLng, jobLat, jobLng) : 9999

      if (Math.abs(distA - distB) > 5) return distA - distB // Proximity first (>5mi diff)
      return (countByContractor[b.user_id] ?? 0) - (countByContractor[a.user_id] ?? 0) // Then by experience
    })

    const winner = candidates[0]

    // Assign the job
    const { error: assignError } = await supabase
      .from('jobs')
      .update({
        contractor_id: winner.user_id,
        status: 'matched',
      })
      .eq('id', job_id)

    if (assignError) {
      return NextResponse.json({ error: 'Failed to assign contractor' }, { status: 500 })
    }

    // Record the match
    await supabase.from('matches').insert({
      job_id,
      contractor_id: winner.user_id,
      offered_at: new Date().toISOString(),
    })

    // Record status history
    await supabase.from('job_status_history').insert({
      job_id,
      status: 'matched',
      changed_at: new Date().toISOString(),
      changed_by: 'system',
    })

    // Send notification emails (fire-and-forget, never block the response)
    ;(async () => {
      try {
        const { getAdminClient } = await import('@/lib/supabase/admin')
        const admin = getAdminClient()

        const [{ data: contractorAuth }, { data: clientAuth }] = await Promise.all([
          admin.auth.admin.getUserById(winner.user_id),
          admin.auth.admin.getUserById(job.client_id),
        ])

        const contractorEmail = contractorAuth.user?.email
        const clientEmail     = clientAuth.user?.email
        const [{ data: contractorProfile }, { data: clientProfile }] = await Promise.all([
          supabase.from('profiles').select('full_name').eq('id', winner.user_id).maybeSingle(),
          supabase.from('profiles').select('full_name').eq('id', job.client_id).maybeSingle(),
        ])
        const contractorName = contractorProfile?.full_name ?? 'Contractor'
        const clientName = clientProfile?.full_name ?? 'Client'

        await Promise.all([
          contractorEmail
            ? sendJobMatchedContractorEmail({
                to:          contractorEmail,
                name:        contractorName,
                jobId:       job_id,
                serviceType: job.service_type,
                urgency:     job.urgency ?? 'routine',
                propertyCity:  job.properties?.city  ?? '',
                propertyState: job.properties?.state ?? '',
              })
            : Promise.resolve(),
          clientEmail
            ? sendContractorAssignedClientEmail({
                to:             clientEmail,
                clientName,
                contractorName,
                serviceType:    job.service_type,
                urgency:        job.urgency ?? 'routine',
                jobId:          job_id,
              })
            : Promise.resolve(),
        ])
      } catch (err) {
        console.error('[match] email error:', err)
      }
    })()

    return NextResponse.json({
      matched: true,
      contractor_id: winner.user_id,
      job_id,
    })
  } catch (err) {
    console.error('Match error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
