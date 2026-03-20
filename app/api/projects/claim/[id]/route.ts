import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
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
    if (role !== 'contractor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id: projectId } = await params

    // Verify project is still claimable
    const { data: sr } = await supabase
      .from('service_requests')
      .select('id, status, assigned_contractor_id')
      .eq('id', projectId)
      .single()

    if (!sr) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (!['pending_review', 'in_queue'].includes(sr.status) || sr.assigned_contractor_id) {
      return NextResponse.json({ error: 'Project is no longer available' }, { status: 400 })
    }

    // Claim it
    const { data: updated, error: updateError } = await supabase
      .from('service_requests')
      .update({ assigned_contractor_id: user.id, status: 'assigned' })
      .eq('id', projectId)
      .select('id, status')
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ project: { id: updated.id, status: updated.status } })
  } catch (err) {
    console.error('[POST /api/projects/claim]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
