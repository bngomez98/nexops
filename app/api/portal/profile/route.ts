
import { createClient } from '@/lib/supabase/server'
import { loadCurrentProfile } from '../shared'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = (await request.json()) as {
      name?: string
      phone?: string
      bio?: string
      avatarUrl?: string
      serviceCategories?: string[]
    }

    const update: Record<string, unknown> = {}

    if (body.name !== undefined) update.full_name = body.name.trim()
    if (body.phone !== undefined) update.phone = body.phone.trim()
    if (body.bio !== undefined) update.bio = body.bio.trim()
    if (body.avatarUrl !== undefined) update.avatar_url = body.avatarUrl
    if (body.serviceCategories !== undefined) update.service_categories = body.serviceCategories

    if (Object.keys(update).length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Try update by id first, then by user_id
    const byId = await supabase.from('profiles').update(update).eq('id', user.id).select().maybeSingle()

    if (byId.error || !byId.data) {
      const byUserId = await supabase
        .from('profiles')
        .update(update)
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      if (byUserId.error) throw byUserId.error

      const profile = byUserId.data ?? {}
      return Response.json({ success: true, profile: normalizeProfile(profile as Record<string, unknown>) })
    }

    const profile = byId.data ?? {}
    return Response.json({ success: true, profile: normalizeProfile(profile as Record<string, unknown>) })
  } catch (error) {
    console.error('[PUT /api/portal/profile]', error)
    return Response.json({ error: 'Unable to update profile' }, { status: 500 })
  }
}

export async function GET() {
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
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    return Response.json({ profile: normalizeProfile(profile as Record<string, unknown>) })
  } catch (error) {
    console.error('[GET /api/portal/profile]', error)
    return Response.json({ error: 'Unable to load profile' }, { status: 500 })
  }
}

function normalizeProfile(profile: Record<string, unknown>) {
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    serviceCategories: Array.isArray(profile.service_categories) ? profile.service_categories : [],
    role: profile.role,
  }
}
