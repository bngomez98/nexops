import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { messageWithJobSchema } from '@/lib/validators'

// GET /api/messages — list all conversations for the current user
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all messages where user is sender or recipient
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, job_id, sender_id, recipient_id, content, created_at, read_at')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!messages || messages.length === 0) {
      return NextResponse.json({ conversations: [] })
    }

    // Group by job_id and pick the latest message per conversation
    const jobMap = new Map<string, {
      job_id: string
      last_message: string
      last_message_at: string
      unread_count: number
      other_user_id: string
    }>()

    for (const msg of messages) {
      const existing = jobMap.get(msg.job_id)
      const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
      const isUnread = msg.recipient_id === user.id && !msg.read_at

      if (!existing) {
        jobMap.set(msg.job_id, {
          job_id: msg.job_id,
          last_message: msg.content,
          last_message_at: msg.created_at,
          unread_count: isUnread ? 1 : 0,
          other_user_id: otherUserId,
        })
      } else {
        if (isUnread) existing.unread_count += 1
      }
    }

    const uniqueJobIds = Array.from(jobMap.keys())

    // Fetch job titles
    const { data: jobs } = await supabase
      .from('service_requests')
      .select('id, additional_notes, category')
      .in('id', uniqueJobIds)

    const jobTitles = new Map(
      (jobs ?? []).map(j => [j.id, (j.additional_notes as string | null) || j.category])
    )

    // Fetch other user names
    const otherUserIds = Array.from(new Set(Array.from(jobMap.values()).map(c => c.other_user_id)))
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', otherUserIds)

    const profileNames = new Map((profiles ?? []).map(p => [p.id, p.full_name as string]))

    const conversations = Array.from(jobMap.values()).map(c => ({
      job_id: c.job_id,
      job_title: jobTitles.get(c.job_id) ?? 'Project',
      other_user_name: profileNames.get(c.other_user_id) ?? 'Unknown',
      last_message: c.last_message,
      last_message_at: c.last_message_at,
      unread_count: c.unread_count,
    }))

    return NextResponse.json({ conversations })
  } catch (err) {
    console.error('[GET /api/messages]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages — send a new message
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = messageWithJobSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { job_id, content, recipient_id } = parsed.data

    // Verify the sender is a party to this job
    const { data: job } = await supabase
      .from('service_requests')
      .select('owner_id, contractor_id')
      .eq('id', job_id)
      .single()

    if (!job || (job.owner_id !== user.id && job.contractor_id !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        job_id,
        sender_id: user.id,
        recipient_id,
        content,
      })
      .select('id, job_id, sender_id, recipient_id, content, created_at, read_at')
      .single()

    if (error) throw error

    return NextResponse.json({ message }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/messages]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
