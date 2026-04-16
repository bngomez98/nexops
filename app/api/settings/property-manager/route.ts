
import { createClient } from '@/lib/supabase/server'
import { homeownerSettingsSchema } from '@/lib/validators'
import { createRequestId, internalError } from '@/lib/api-error'

export async function PUT(request: Request) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = homeownerSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, phone } = parsed.data

    // Update profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ phone: phone ?? null })
      .eq('id', user.id)

    if (profileError) throw profileError

    // Update Supabase Auth email if changed
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email })
      if (emailError) throw emailError
    }

    return Response.json({ success: true })
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[PUT /api/settings/property-manager][${requestId}]`, err)
    return internalError('Unable to update property manager settings', { requestId })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Sign out the user. Full account deletion requires a service role operation
    // handled separately or by a Supabase database trigger/function.
    await supabase.auth.signOut()

    return Response.json({ success: true })
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[DELETE /api/settings/property-manager][${requestId}]`, err)
    return internalError('Unable to process account request', { requestId })
  }
}
