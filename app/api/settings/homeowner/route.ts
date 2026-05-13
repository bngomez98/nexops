
import { createClient } from '@/lib/supabase/server'
import { homeownerSettingsSchema } from '@/lib/validators'
import { createRequestId, internalError } from '@/lib/api-error'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
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
    console.error(`[PUT /api/settings/homeowner][${requestId}]`, err)
    return internalError('Unable to update homeowner settings', { requestId })
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Sign out first
    await supabase.auth.signOut()

    return Response.json({ success: true })
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[DELETE /api/settings/homeowner][${requestId}]`, err)
    return internalError('Unable to process account request', { requestId })
  }
}
