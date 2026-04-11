import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadCurrentProfile } from '../shared'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile = await loadCurrentProfile(supabase, user.id)

    return NextResponse.json({
      preferences: {
        notifyMessages: Boolean(profile?.notify_messages ?? true),
        notifyStatus: Boolean(profile?.notify_status_changes ?? true),
        notifyPayments: Boolean(profile?.notify_payments ?? false),
      },
    })
  } catch (error) {
    console.error('[GET /api/portal/preferences]', error)
    return NextResponse.json({ error: 'Unable to load preferences' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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

    return NextResponse.json({
      success: true,
      preferences: {
        notifyMessages,
        notifyStatus,
        notifyPayments,
      },
    })
  } catch (error) {
    console.error('[PUT /api/portal/preferences]', error)
    return NextResponse.json({ error: 'Unable to update preferences' }, { status: 500 })
  }
}
