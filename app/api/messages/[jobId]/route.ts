import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { messageSchema } from '@/lib/validators'

type RouteContext = { params: Promise<{ jobId: string }> }

// GET /api/messages/[jobId] — all messages for a job, marks unread as read
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await params

    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, job_id, sender_id, recipient_id, content, created_at, read_at')
      .eq('job_id', jobId)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Mark unread messages (where current user is recipient) as read
    const unreadIds = (messages ?? [])
      .filter(m => m.recipient_id === user.id && !m.read_at)
      .map(m => m.id)

    if (unreadIds.length > 0) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds)
    }

    // Fetch job title
    const { data: job } = await supabase
      .from('service_requests')
      .select('id, additional_notes, category')
      .eq('id', jobId)
      .single()

    const jobTitle = (job?.additional_notes as string | null) || job?.category || 'Project'

    return NextResponse.json({ messages: messages ?? [], jobTitle })
  } catch (err) {
    console.error('[GET /api/messages/[jobId]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages/[jobId] — send a message for a specific job
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await params
    const body = await request.json()
    const parsed = messageSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { content, recipient_id } = parsed.data

    // Verify the sender is a party to this job (owner or assigned contractor)
    const { data: job } = await supabase
      .from('service_requests')
      .select('owner_id, contractor_id')
      .eq('id', jobId)
      .single()

    if (!job || (job.owner_id !== user.id && job.contractor_id !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        job_id: jobId,
        sender_id: user.id,
        recipient_id,
        content,
      })
      .select('id, job_id, sender_id, recipient_id, content, created_at, read_at')
      .single()

    if (error) throw error

    return NextResponse.json({ message }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/messages/[jobId]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
