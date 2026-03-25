import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const role = profile?.role ?? user.user_metadata?.role ?? 'homeowner'
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? 'my-projects'

    if (role === 'homeowner' && type === 'my-projects') {
      const { data: rows, error } = await supabase
        .from('service_requests')
        .select('id, category, description, additional_notes, address, budget_max, status, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const projects = (rows ?? []).map(r => ({
        id: r.id,
        title: r.additional_notes || r.category,
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: mapStatus(r.status),
        createdAt: r.created_at,
      }))

      return NextResponse.json({ projects })
    }

    if (role === 'contractor' && type === 'available') {
      // Build query for unclaimed projects
      let query = supabase
        .from('service_requests')
        .select('id, category, description, additional_notes, address, budget_max, status, created_at')
        .in('status', ['pending_review', 'in_queue'])
        .is('assigned_contractor_id', null)
        .order('created_at', { ascending: false })

      // Filter by contractor's service categories if they have them set
      const serviceCategories = profile?.service_categories
      if (serviceCategories && Array.isArray(serviceCategories) && serviceCategories.length > 0) {
        query = query.in('category', serviceCategories)
      }

      const { data: rows, error } = await query

      if (error) throw error

      const projects = (rows ?? []).map(r => ({
        id: r.id,
        title: r.additional_notes || r.category,
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: 'open',
        createdAt: r.created_at,
      }))

      return NextResponse.json({ projects })
    }

    if (role === 'contractor' && type === 'my-projects') {
      const { data: rows, error } = await supabase
        .from('service_requests')
        .select('id, category, description, additional_notes, address, budget_max, status, created_at')
        .eq('assigned_contractor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const projects = (rows ?? []).map(r => ({
        id: r.id,
        title: r.additional_notes || r.category,
        description: r.description,
        category: r.category,
        location: r.address,
        budget: r.budget_max ?? null,
        status: mapStatus(r.status),
        createdAt: r.created_at,
      }))

      return NextResponse.json({ projects })
    }

    return NextResponse.json({ projects: [] })
  } catch (err) {
    console.error('[GET /api/projects/list]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
