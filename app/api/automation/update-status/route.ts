import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidTransition, STATUS_TRANSITIONS } from '@/lib/business-logic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { projectId, newStatus, reason } = await request.json()

    if (!projectId || !newStatus) {
      return NextResponse.json(
        { error: 'projectId and newStatus are required' },
        { status: 400 }
      )
    }

    // Get the project
    const { data: project, error: projError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify user is owner or assigned contractor
    const isOwner = project.owner_id === user.id
    const isContractor = project.assigned_contractor_id === user.id
    if (!isOwner && !isContractor) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Validate state transition
    const currentStatus = project.status
    if (!isValidTransition(currentStatus, newStatus)) {
      const validNextStates = STATUS_TRANSITIONS[currentStatus] ?? []
      return NextResponse.json(
        {
          error: `Invalid transition: ${currentStatus} → ${newStatus}`,
          validTransitions: validNextStates,
        },
        { status: 400 }
      )
    }

    // Update the project status
    const { error: updateError } = await supabase
      .from('service_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        status_reason: reason || null,
      })
      .eq('id', projectId)

    if (updateError) throw updateError

    // Create notification for stakeholders
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

    const { error: notifError } = await supabase
      .from('notifications')
      .insert(
        notificationRecipients.map(recipientId => ({
          user_id: recipientId,
          type: 'status_update',
          title: `Project status updated: ${statusLabels[newStatus]}`,
          message: `Your project has been updated to ${statusLabels[newStatus]}.`,
          project_id: projectId,
          read: false,
          created_at: new Date().toISOString(),
        }))
      )

    if (notifError) {
      console.error('[POST /api/automation/update-project-status] notification insert error:', notifError)
    }

    return NextResponse.json({
      success: true,
      projectId,
      previousStatus: currentStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[POST /api/automation/update-project-status]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
