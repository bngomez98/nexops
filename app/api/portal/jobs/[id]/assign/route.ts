import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dbStatusToPortal, loadCurrentProfile, normalizeRole } from '../../../shared'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile = await loadCurrentProfile(supabase, user.id)
    const role = normalizeRole(profile?.role ?? user.user_metadata?.role)

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { contractorId } = await request.json()

    if (!contractorId || typeof contractorId !== 'string') {
      return NextResponse.json({ error: 'contractorId is required' }, { status: 400 })
    }

    const { data: contractor, error: contractorError } = await supabase
      .from('profiles')
      .select('id, user_id, role, is_active')
      .or(`id.eq.${contractorId},user_id.eq.${contractorId}`)
      .limit(1)
      .maybeSingle()

    if (contractorError || !contractor || normalizeRole(contractor.role) !== 'contractor') {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 })
    }

    if (contractor.is_active === false) {
      return NextResponse.json({ error: 'Contractor is inactive' }, { status: 400 })
    }

    const { id } = await params
    const contractorAuthId =
      (typeof contractor.id === 'string' ? contractor.id : null) ??
      (typeof contractor.user_id === 'string' ? contractor.user_id : null)

    const { data: updated, error: updateError } = await supabase
      .from('service_requests')
      .update({
        assigned_contractor_id: contractorAuthId,
        status: 'assigned',
      })
      .eq('id', id)
      .select('id, status, assigned_contractor_id')
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      projectId: updated.id,
      contractorId: updated.assigned_contractor_id,
      status: dbStatusToPortal(updated.status),
    })
  } catch (error) {
    console.error('[POST /api/portal/jobs/[id]/assign]', error)
    return NextResponse.json({ error: 'Unable to assign contractor' }, { status: 500 })
  }
}
