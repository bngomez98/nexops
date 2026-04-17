
import { createClient } from '@/lib/supabase/server'
import { brandingSchema } from '@/lib/validators'
import { createRequestId, internalError } from '@/lib/api-error'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('branding')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    return Response.json({ branding: (profile?.branding as Record<string, string> | null) ?? null })
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[GET /api/settings/branding][${requestId}]`, err)
    return internalError('Unable to load branding settings', { requestId })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = brandingSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    // Normalise: store empty strings as null/absent so the column stays clean
    const branding: Record<string, string> = {}
    if (parsed.data.brandName) branding.brandName = parsed.data.brandName
    if (parsed.data.primaryColor) branding.primaryColor = parsed.data.primaryColor
    if (parsed.data.accentColor) branding.accentColor = parsed.data.accentColor
    if (parsed.data.logoUrl) branding.logoUrl = parsed.data.logoUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ branding: Object.keys(branding).length ? branding : null })
      .eq('id', user.id)

    if (updateError) throw updateError

    return Response.json({ success: true, branding: Object.keys(branding).length ? branding : null })
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[PUT /api/settings/branding][${requestId}]`, err)
    return internalError('Unable to save branding settings', { requestId })
  }
}
