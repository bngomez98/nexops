
import { createClient } from '@/lib/supabase/server'
import { loadCurrentProfile } from '../shared'

export async function GET(request: Request) {
  try {
    const supabase = createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile: any = await loadCurrentProfile(supabase, user.id)

    return Response.json({
      preferences: {
        notifyMessages: Boolean(profile?.notify_messages ?? true),
        notifyStatus: Boolean(profile?.notify_status_changes ?? true),
        notifyPayments: Boolean(profile?.notify_payments ?? false),
      },
    })
  } catch (error) {
    console.error('[GET /api/portal/preferences]', error)
    return Response.json({ error: 'Unable to load preferences' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient(request)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const notifyMessages = Boolean(body.notifyMessages)
    const notifyStatus = Boolean(body.notifyStatus)
    const notifyPayments = Boolean(body.notifyPayments)

    const update = {
      notify_messages: notifyMessages,
      notify_status_changes: notifyStatus,
      notify_payments: notifyPayments,
    }

    const byId = await supabase.from('profiles').update(update).eq('id', user.id)

    if (byId.error) {
      const byUserId = await supabase.from('profiles').update(update).eq('user_id', user.id)
      if (byUserId.error) throw byUserId.error
    }

    return Response.json({
      success: true,
      preferences: {
        notifyMessages,
        notifyStatus,
        notifyPayments,
      },
    })
  } catch (error) {
    console.error('[PUT /api/portal/preferences]', error)
    return Response.json({ error: 'Unable to update preferences' }, { status: 500 })
  }
}
