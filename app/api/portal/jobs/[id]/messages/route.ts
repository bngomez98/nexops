
import { createClient } from '@/lib/supabase/server'
import { loadCurrentProfile, normalizeRole } from '../../../shared'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    const { data: project, error: projectError } = await supabase
      .from('service_requests')
      .select('id, owner_id, assigned_contractor_id')
      .eq('id', id)
      .single()

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    const profile: Record<string, unknown> | null = await loadCurrentProfile(supabase, user.id)
    const role = normalizeRole(profile?.role ?? user.user_metadata?.role)

    const isOwner = project.owner_id === user.id
    const isAssignedContractor = project.assigned_contractor_id === user.id
    if (!isOwner && !isAssignedContractor && role !== 'admin') {
      return Response.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { content } = await request.json()
    const body = typeof content === 'string' ? content.trim() : ''

    if (!body) {
      return Response.json({ error: 'content is required' }, { status: 400 })
    }

    const { data: inserted, error: insertError } = await supabase
      .from('messages')
      .insert({
        request_id: id,
        sender_id: user.id,
        body,
      })
      .select('id, sender_id, body, created_at')
      .single()

    if (insertError) throw insertError

    const authorName =
      (typeof profile?.full_name === 'string' && profile.full_name) ||
      (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
      user.email?.split('@')[0] ||
      'User'

    return Response.json({
      message: {
        id: String(inserted.id),
        authorId: String(inserted.sender_id),
        authorName,
        body: String(inserted.body),
        timestamp: String(inserted.created_at),
      },
    })
  } catch (error) {
    console.error('[POST /api/portal/jobs/[id]/messages]', error)
    return Response.json({ error: 'Unable to send message' }, { status: 500 })
  }
}
