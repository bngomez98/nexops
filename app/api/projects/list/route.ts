import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRequestId, internalError } from '@/lib/api-error'

type ServiceRequestRow = {
  id: string
  owner_id: string
  assigned_contractor_id: string | null
  category: string
  description: string | null
  additional_notes: string | null
  address: string
  budget_max: number | null
  status: string
  created_at: string
  consultation_date: string | null
}

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

function deriveTitle(row: { title?: string | null; additional_notes?: string | null; category?: string | null }) {
  const primary = row.title?.trim()
  if (primary) return primary
  const notes = row.additional_notes?.split('\n')[0]?.trim()
  if (notes) return notes
  return row.category ?? 'Service request'
async function getContractorNameMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: ServiceRequestRow[],
) {
  const contractorIds = Array.from(
    new Set(rows.map((row) => row.assigned_contractor_id).filter(Boolean)),
  ) as string[]

  if (contractorIds.length === 0) {
    return new Map<string, string>()
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, company')
    .in('id', contractorIds)

  return new Map(
    (profiles ?? []).map((profile) => [
      profile.id as string,
      ((profile.company as string | null) ?? (profile.full_name as string | null) ?? 'Contractor'),
    ]),
  )
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, service_categories')
      .eq('id', user.id)
      .single()

    const rawRole = profile?.role ?? user.user_metadata?.role ?? 'homeowner'
    const role = rawRole === 'property_manager' ? 'property-manager' : rawRole
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? 'my-projects'
    const pipeline = searchParams.get('pipeline') === 'true'

    if (role === 'homeowner' && pipeline) {
      const { data: rows, error } = await supabase
        .from('service_requests')
        .select('id, category, title, additional_notes, status, created_at, consultation_date, urgency')
        .select('id, owner_id, assigned_contractor_id, category, additional_notes, status, created_at, consultation_date')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const contractorNames = await getContractorNameMap(supabase, (rows ?? []) as ServiceRequestRow[])
      const pipelineProjects = ((rows ?? []) as ServiceRequestRow[]).map((r) => ({
        id: r.id,
        title: deriveTitle(r),
        category: r.category,
        status: mapStatus(r.status),
        rawStatus: r.status,
        createdAt: r.created_at,
        preferredDate: r.consultation_date ?? null,
        urgency: r.urgency ?? null,
        ownerId: r.owner_id,
        assignedContractorId: r.assigned_contractor_id ?? null,
        contractorName: r.assigned_contractor_id ? contractorNames.get(r.assigned_contractor_id) ?? null : null,
      }))

      return NextResponse.json({ projects: pipelineProjects })
    }

    if (role === 'homeowner' && type === 'my-projects') {
      const { data: rows, error } = await supabase
        .from('service_requests')
        .select('id, category, title, description, additional_notes, address, budget_max, status, created_at, consultation_date, urgency, photo_urls, invoice_amount, invoice_paid, owner_id, assigned_contractor_id')
        .select('id, owner_id, assigned_contractor_id, category, description, additional_notes, address, budget_max, status, created_at, consultation_date')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const contractorNames = await getContractorNameMap(supabase, (rows ?? []) as ServiceRequestRow[])
      const projects = ((rows ?? []) as ServiceRequestRow[]).map((r) => ({
        id: r.id,
        title: deriveTitle(r),
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: mapStatus(r.status),
        rawStatus: r.status,
        createdAt: r.created_at,
        preferredDate: r.consultation_date ?? null,
        urgency: r.urgency ?? null,
        photoUrls: r.photo_urls ?? [],
        invoiceAmount: r.invoice_amount ?? null,
        invoicePaid: r.invoice_paid ?? false,
        ownerId: r.owner_id ?? null,
        assignedContractorId: r.assigned_contractor_id ?? null,
        ownerId: r.owner_id,
        assignedContractorId: r.assigned_contractor_id ?? null,
        contractorName: r.assigned_contractor_id ? contractorNames.get(r.assigned_contractor_id) ?? null : null,
      }))

      return NextResponse.json({ projects })
    }

    if (role === 'contractor' && type === 'available') {
      // Build query for unclaimed projects
      const query = supabase
        .from('service_requests')
        .select('id, category, title, description, additional_notes, address, budget_max, status, created_at, consultation_date, urgency, photo_urls, invoice_amount, invoice_paid, owner_id, assigned_contractor_id')
        .select('id, owner_id, assigned_contractor_id, category, description, additional_notes, address, budget_max, status, created_at, consultation_date')
        .in('status', ['pending_review', 'in_queue'])
        .is('assigned_contractor_id', null)
        .order('created_at', { ascending: false })

      const { data: rows, error } = await query

      if (error) throw error

      const projects = ((rows ?? []) as ServiceRequestRow[]).map((r) => ({
        id: r.id,
        title: deriveTitle(r),
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: 'open',
        rawStatus: r.status,
        createdAt: r.created_at,
        preferredDate: r.consultation_date ?? null,
        urgency: r.urgency ?? null,
        photoUrls: r.photo_urls ?? [],
        invoiceAmount: r.invoice_amount ?? null,
        invoicePaid: r.invoice_paid ?? false,
        ownerId: r.owner_id ?? null,
        assignedContractorId: r.assigned_contractor_id ?? null,
        ownerId: r.owner_id,
        assignedContractorId: r.assigned_contractor_id ?? null,
        contractorName: null,
      }))

      return NextResponse.json({ projects })
    }

    if (role === 'contractor' && type === 'my-projects') {
      const { data: rows, error } = await supabase
        .from('service_requests')
        .select('id, category, title, description, additional_notes, address, budget_max, status, created_at, consultation_date, urgency, photo_urls, invoice_amount, invoice_paid, owner_id, assigned_contractor_id')
        .select('id, owner_id, assigned_contractor_id, category, description, additional_notes, address, budget_max, status, created_at, consultation_date')
        .eq('assigned_contractor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const contractorNames = await getContractorNameMap(supabase, (rows ?? []) as ServiceRequestRow[])
      const projects = ((rows ?? []) as ServiceRequestRow[]).map((r) => ({
        id: r.id,
        title: deriveTitle(r),
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: mapStatus(r.status),
        createdAt: r.created_at,
        preferredDate: r.consultation_date ?? null,
        urgency: r.urgency ?? null,
        photoUrls: r.photo_urls ?? [],
        invoiceAmount: r.invoice_amount ?? null,
        invoicePaid: r.invoice_paid ?? false,
        ownerId: r.owner_id ?? null,
        assignedContractorId: r.assigned_contractor_id ?? null,
      }))

      return NextResponse.json({ projects })
    }

    if ((role === 'admin' || role === 'property-manager' || role === 'manager') && type === 'all') {
      const { data: rows, error } = await supabase
        .from('service_requests')
        .select('id, category, title, description, additional_notes, address, budget_max, status, created_at, consultation_date, urgency, photo_urls, invoice_amount, invoice_paid, owner_id, assigned_contractor_id')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      const projects = (rows ?? []).map(r => ({
        id: r.id,
        title: deriveTitle(r),
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: mapStatus(r.status),
        rawStatus: r.status,
        createdAt: r.created_at,
        preferredDate: r.consultation_date ?? null,
        urgency: r.urgency ?? null,
        photoUrls: r.photo_urls ?? [],
        invoiceAmount: r.invoice_amount ?? null,
        invoicePaid: r.invoice_paid ?? false,
        ownerId: r.owner_id ?? null,
        assignedContractorId: r.assigned_contractor_id ?? null,
        ownerId: r.owner_id,
        assignedContractorId: r.assigned_contractor_id ?? null,
        contractorName: r.assigned_contractor_id ? contractorNames.get(r.assigned_contractor_id) ?? null : null,
      }))

      return NextResponse.json({ projects })
    }

    return NextResponse.json({ projects: [] })
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[GET /api/projects/list][${requestId}]`, err)
    return internalError('Unable to load projects', { requestId })
  }
}
