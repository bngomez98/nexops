
import { createClient } from '@/lib/supabase/server'
import { messageSchema } from '@/lib/validators'

type RouteContext = { params: Promise<{ jobId: string }> }
export const dynamic = 'force-dynamic'

// GET /api/messages/[jobId] — all messages for a job, marks unread as read
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
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

    const senderIds = Array.from(new Set((messages ?? []).map((message) => message.sender_id)))
    const { data: profiles } = senderIds.length
      ? await supabase.from('profiles').select('id, full_name').in('id', senderIds)
      : { data: [] }

    const namesById = new Map(
      (profiles ?? []).map((profile) => [profile.id, (profile.full_name as string | null) ?? 'User']),
    )

    const portalMessages = (messages ?? []).map((message) => ({
      ...message,
      authorId: message.sender_id,
      authorName: namesById.get(message.sender_id) ?? 'User',
      body: message.content,
      timestamp: message.created_at,
    }))

    return Response.json({ messages: portalMessages, jobTitle })
  } catch (err) {
    console.error('[GET /api/messages/[jobId]]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages/[jobId] — send a message for a specific job
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await params
    const rawBody = await request.json()

    // Accept either `content` or `body` as the message text (portal sends `body`)
    const content: string = rawBody.content ?? rawBody.body ?? ''
    if (!content.trim()) {
      return Response.json({ error: 'Message content is required' }, { status: 400 })
    }
    if (content.length > 5000) {
      return Response.json({ error: 'Message is too long' }, { status: 400 })
    }

    // Verify the sender is a party to this job and infer recipient if not supplied
    const { data: job } = await supabase
      .from('service_requests')
      .select('owner_id, assigned_contractor_id')
      .eq('id', jobId)
      .single()

    if (!job || (job.owner_id !== user.id && job.assigned_contractor_id !== user.id)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Infer recipient: the other party in the job
    const providedRecipient: string | undefined = rawBody.recipient_id
    const inferredRecipient = user.id === job.owner_id
      ? job.assigned_contractor_id
      : job.owner_id
    const recipient_id = providedRecipient ?? inferredRecipient

    const parsed = messageSchema.safeParse({ content, recipient_id: recipient_id ?? '' })
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        job_id: jobId,
        sender_id: user.id,
        recipient_id: parsed.data.recipient_id,
        content: parsed.data.content,
      })
      .select('id, job_id, sender_id, recipient_id, content, created_at, read_at')
      .single()

    if (error) throw error

    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    return Response.json({
      message: {
        ...message,
        authorId: message.sender_id,
        authorName: (senderProfile?.full_name as string | null) ?? 'User',
        body: message.content,
        timestamp: message.created_at,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/messages/[jobId]]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
