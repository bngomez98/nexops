
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, body, type, read, link, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      // Table may not exist yet; fail gracefully with empty list.
      return Response.json({ notifications: [] })
    }

    return Response.json({ notifications: data ?? [] })
  } catch (err) {
    console.error('[GET /api/notifications]', err)
    return Response.json({ notifications: [] })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { id, markAllRead } = body as { id?: string; markAllRead?: boolean }

    if (markAllRead) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)
      return Response.json({ success: true })
    }

    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 })
    }

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', user.id)

    return Response.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/notifications]', err)
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 })
    }

    await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    return Response.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/notifications]', err)
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
