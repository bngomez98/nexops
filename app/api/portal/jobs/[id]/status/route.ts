
import { createClient } from '@/lib/supabase/server'
import { STATUS_TRANSITIONS, isValidTransition } from '@/lib/business-logic'
import {
  dbStatusToPortal,
  loadCurrentProfile,
  normalizeRole,
  parseTitle,
  portalStatusToDb,
} from '../../../shared'

type RouteContext = { params: Promise<{ id: string }> }

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  in_queue: 'In Queue',
  assigned: 'Assigned',
  consultation_scheduled: 'Consultation Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  declined: 'Declined',
  cancelled: 'Cancelled',
}

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

    const profile = await loadCurrentProfile(supabase, user.id)
    const role = normalizeRole(profile?.role ?? user.user_metadata?.role)
    const { id } = await params

    const { data: project, error: projectError } = await supabase
      .from('service_requests')
      .select('id, owner_id, assigned_contractor_id, status, additional_notes, category')
      .eq('id', id)
      .single()

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    const isOwner = project.owner_id === user.id
    const isAssignedContractor = project.assigned_contractor_id === user.id
    const isAdmin = role === 'admin'

    if (!isOwner && !isAssignedContractor && !isAdmin) {
      return Response.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { newStatus, reason } = await request.json()
    const targetStatus = portalStatusToDb(newStatus)

    if (!isValidTransition(project.status, targetStatus)) {
      return Response.json(
        {
          error: `Invalid transition: ${project.status} → ${targetStatus}`,
          validTransitions: STATUS_TRANSITIONS[project.status] ?? [],
        },
        { status: 400 },
      )
    }

    const { error: updateError } = await supabase
      .from('service_requests')
      .update({
        status: targetStatus,
        status_reason: typeof reason === 'string' && reason.trim() ? reason.trim() : null,
      })
      .eq('id', id)

    if (updateError) throw updateError

    const recipients = [project.owner_id, project.assigned_contractor_id].filter(
      (recipient): recipient is string => Boolean(recipient),
    )

    if (recipients.length > 0) {
      await supabase.from('notifications').insert(
        recipients.map((recipient) => ({
          user_id: recipient,
          type: 'status_update',
          title: `Project status updated: ${STATUS_LABELS[targetStatus]}`,
          body: `${parseTitle(project.additional_notes, project.category)} is now ${STATUS_LABELS[targetStatus]}.`,
          link: `/portal`,
          metadata: {
            projectId: id,
            status: targetStatus,
          },
          read: false,
        })),
      )
    }

    return Response.json({
      success: true,
      projectId: id,
      previousStatus: project.status,
      newStatus: targetStatus,
      portalStatus: dbStatusToPortal(targetStatus),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[POST /api/portal/jobs/[id]/status]', error)
    return Response.json({ error: 'Unable to update status' }, { status: 500 })
  }
}
