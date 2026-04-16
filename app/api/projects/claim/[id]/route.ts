
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? user.user_metadata?.role
    if (role !== 'contractor') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id: projectId } = await params

    // Check contractor qualifications
    try {
      const now = new Date().toISOString()
      const { data: validDocs } = await supabase
        .from('documents')
        .select('type')
        .eq('user_id', user.id)
        .in('type', ['license', 'insurance'])
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .eq('status', 'approved')

      const hasLicense = validDocs?.some(d => d.type === 'license') ?? false
      const hasInsurance = validDocs?.some(d => d.type === 'insurance') ?? false

      if (!hasLicense || !hasInsurance) {
        return Response.json({
          error: 'Valid license and insurance documents required to claim projects.',
          missingDocs: true,
        }, { status: 403 })
      }
    } catch (docErr) {
      console.error('[POST /api/projects/claim] doc check failed (allowing):', docErr)
    }

    // Verify project is still claimable
    const { data: sr } = await supabase
      .from('service_requests')
      .select('id, status, assigned_contractor_id')
      .eq('id', projectId)
      .single()

    if (!sr) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }
    if (!['pending_review', 'in_queue'].includes(sr.status) || sr.assigned_contractor_id) {
      return Response.json({ error: 'Project is no longer available' }, { status: 400 })
    }

    // Claim it
    const { data: updated, error: updateError } = await supabase
      .from('service_requests')
      .update({ assigned_contractor_id: user.id, status: 'assigned' })
      .eq('id', projectId)
      .select('id, status')
      .single()

    if (updateError) throw updateError

    return Response.json({ project: { id: updated.id, status: updated.status } })
  } catch (err) {
    console.error('[POST /api/projects/claim]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
