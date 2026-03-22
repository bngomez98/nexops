import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { companyName, bio, licenseNumber, yearsInBusiness, serviceCategories } = body

    if (!companyName || !bio || !serviceCategories || serviceCategories.length === 0) {
      return NextResponse.json({ error: 'Company name, bio, and at least one service category are required' }, { status: 400 })
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        company_name: companyName,
        bio,
        license_number: licenseNumber ?? '',
        years_in_business: Number(yearsInBusiness) || 0,
        service_categories: serviceCategories,
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PUT /api/settings/contractor]', error)
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

    // Sign the user out. Full account deletion requires a service role operation
    // handled separately or by a Supabase database trigger/function.
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/settings/contractor]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
