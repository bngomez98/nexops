import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function mapStatus(dbStatus: string): string {
  const map: Record<string, string> = {
    pending_review: 'open',
    in_queue: 'open',
    assigned: 'claimed',
    consultation_scheduled: 'in-progress',
    in_progress: 'in-progress',
    completed: 'completed',
    declined: 'cancelled',
    cancelled: 'cancelled',
  }
  return map[dbStatus] ?? dbStatus
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? user.user_metadata?.role ?? 'homeowner'
    const { id } = await params

    const { data: sr, error } = await supabase
      .from('service_requests')
      .select('id, owner_id, assigned_contractor_id, category, title, description, additional_notes, address, budget_max, urgency, status, created_at, consultation_date, final_cost, completion_date, photo_urls, invoice_amount, invoice_paid')
      .eq('id', id)
      .single()

    if (error || !sr) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Access control: homeowners only see their own, contractors only see assigned
    if (role === 'homeowner' && sr.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (role === 'contractor' && sr.assigned_contractor_id && sr.assigned_contractor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Optionally fetch contractor profile name if assigned
    let contractorName = null
    let contractorPhone = null
    if (sr.assigned_contractor_id) {
      const { data: cProfile } = await supabase
        .from('profiles')
        .select('full_name, company, phone')
        .eq('id', sr.assigned_contractor_id)
        .single()
      contractorName = cProfile?.company || cProfile?.full_name || null
      contractorPhone = cProfile?.phone ?? null
    }

    let ownerName = null
    let ownerPhone = null
    if (sr.owner_id) {
      const { data: oProfile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', sr.owner_id)
        .single()
      ownerName = oProfile?.full_name ?? null
      ownerPhone = oProfile?.phone ?? null
    }

    const title = sr.title || sr.additional_notes?.split('\n')[0] || sr.category

    return NextResponse.json({
      project: {
        id: sr.id,
        title,
        description: sr.description,
        category: sr.category,
        location: sr.address,
        budget: sr.budget_max ?? null,
        urgency: sr.urgency ?? null,
        status: mapStatus(sr.status),
        rawStatus: sr.status,
        createdAt: sr.created_at,
        consultationDate: sr.consultation_date ?? null,
        finalCost: sr.final_cost ?? null,
        completionDate: sr.completion_date ?? null,
        assignedContractorId: sr.assigned_contractor_id ?? null,
        ownerId: sr.owner_id,
        contractorName,
        contractorPhone,
        ownerId: sr.owner_id ?? null,
        ownerName,
        ownerPhone,
        photoUrls: sr.photo_urls ?? [],
        invoiceAmount: sr.invoice_amount ?? null,
        invoicePaid: sr.invoice_paid ?? false,
      }
    })
  } catch (err) {
    console.error('[GET /api/projects/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? user.user_metadata?.role
    const { id } = await params
    const body = await request.json()

    const { data: sr } = await supabase
      .from('service_requests')
      .select('owner_id, assigned_contractor_id, status')
      .eq('id', id)
      .single()

    if (!sr) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Only owner, assigned contractor, or admin can update
    if (role !== 'admin' && role === 'homeowner' && sr.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (role !== 'admin' && role === 'contractor' && sr.assigned_contractor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates: Record<string, unknown> = {}
    if (body.status) updates.status = body.status
    if (body.final_cost !== undefined) updates.final_cost = body.final_cost
    if (body.consultation_date !== undefined) updates.consultation_date = body.consultation_date
    if (role === 'admin' && body.assigned_contractor_id !== undefined) {
      updates.assigned_contractor_id = body.assigned_contractor_id
    }

    const { data: updated, error: updateError } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select('id, status')
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ project: { id: updated.id, status: updated.status } })
  } catch (err) {
    console.error('[POST /api/projects/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
