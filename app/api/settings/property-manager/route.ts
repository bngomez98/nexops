import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { homeownerSettingsSchema } from '@/lib/validators'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = homeownerSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PUT /api/settings/property-manager]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Sign out the user. Full account deletion requires a service role operation
    // handled separately or by a Supabase database trigger/function.
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/settings/property-manager]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
