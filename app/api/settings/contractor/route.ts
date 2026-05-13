
import { createClient } from '@/lib/supabase/server'
import { contractorSettingsSchema } from '@/lib/validators'
import { createRequestId, internalError } from '@/lib/api-error'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = contractorSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { companyName, bio, licenseNumber, yearsInBusiness, serviceCategories } = parsed.data

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        company: companyName,
        bio,
        license_number: licenseNumber ?? '',
        years_in_business: Number(yearsInBusiness) || 0,
        service_categories: serviceCategories,
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    return Response.json({ success: true })
  } catch (error) {
    const requestId = createRequestId()
    console.error(`[PUT /api/settings/contractor][${requestId}]`, error)
    return internalError('Unable to update contractor settings', { requestId })
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Sign the user out. Full account deletion requires a service role operation
    // handled separately or by a Supabase database trigger/function.
    await supabase.auth.signOut()

    return Response.json({ success: true })
  } catch (error) {
    const requestId = createRequestId()
    console.error(`[DELETE /api/settings/contractor][${requestId}]`, error)
    return internalError('Unable to process account request', { requestId })
  }
}
