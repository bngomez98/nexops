
import { createClient } from '@/lib/supabase/server'
import { isValidTransition, STATUS_TRANSITIONS } from '@/lib/business-logic'
import { isAutomationEnabled } from '@/lib/env'

export async function POST(request: Request) {
  if (!isAutomationEnabled()) {
    return Response.json(
      { error: 'Automation features are disabled', code: 'FEATURE_DISABLED' },
      { status: 403 },
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { projectId, newStatus, reason } = await request.json()

    if (!projectId || !newStatus) {
      return Response.json(
        { error: 'projectId and newStatus are required' },
        { status: 400 },
      )
    }

    const { data: project, error: projectError } = await supabase
      .from('service_requests')
      .select('id, owner_id, assigned_contractor_id, status, additional_notes, category')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    const isOwner = project.owner_id === user.id
    const isContractor = project.assigned_contractor_id === user.id
    if (!isOwner && !isContractor) {
      return Response.json({ error: 'Not authorized' }, { status: 403 })
    }

    const currentStatus = project.status
    if (!isValidTransition(currentStatus, newStatus)) {
      const validNextStates = STATUS_TRANSITIONS[currentStatus] ?? []
      return Response.json(
        {
          error: `Invalid transition: ${currentStatus} → ${newStatus}`,
          validTransitions: validNextStates,
        },
        { status: 400 },
      )
    }

    const { error: updateError } = await supabase
      .from('service_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        status_reason: typeof reason === 'string' && reason.trim() ? reason.trim() : null,
      })
      .eq('id', projectId)

    if (updateError) throw updateError

    const notificationRecipients = [project.owner_id]
    if (project.assigned_contractor_id) {
      notificationRecipients.push(project.assigned_contractor_id)
    }

    const statusLabels: Record<string, string> = {
      pending_review: 'Pending Review',
      in_queue: 'In Queue',
      assigned: 'Assigned',
      consultation_scheduled: 'Consultation Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      declined: 'Declined',
      cancelled: 'Cancelled',
    }

    const projectLabel =
      (typeof project.additional_notes === 'string' && project.additional_notes.split('\n')[0]) ||
      project.category ||
      'Project'

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert(
        notificationRecipients.map((recipientId) => ({
          user_id: recipientId,
          type: 'status_update',
          title: `Project status updated: ${statusLabels[newStatus]}`,
          body: `${projectLabel} has been updated to ${statusLabels[newStatus]}.`,
          link: `/dashboard/requests/${projectId}`,
          metadata: {
            projectId,
            newStatus,
            reason: typeof reason === 'string' ? reason : null,
          },
          read: false,
          created_at: new Date().toISOString(),
        })),
      )

    if (notificationError) {
      console.error('[POST /api/automation/update-status] notification insert error:', notificationError)
    }

    return Response.json({
      success: true,
      projectId,
      previousStatus: currentStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[POST /api/automation/update-status]', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
