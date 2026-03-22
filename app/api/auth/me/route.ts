import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch profile from public.profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? user.user_metadata?.role ?? 'homeowner'

    let contractorProfile = null
    if (role === 'contractor') {
      // Count active projects for this contractor
      const { count: activeCount } = await supabase
        .from('service_requests')
        .select('id', { count: 'exact', head: true })
        .eq('assigned_contractor_id', user.id)
        .in('status', ['assigned', 'consultation_scheduled', 'in_progress'])

      contractorProfile = {
        companyName: profile?.company ?? user.user_metadata?.company_name ?? user.email?.split('@')[0],
        membershipTier: 'free',
        currentActiveProjects: activeCount ?? 0,
        maxActiveProjects: 3,
        averageRating: 0,
        totalReviews: 0,
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email ?? '',
        name: profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
        role,
        phone: profile?.phone ?? '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        avatarUrl: profile?.avatar_url ?? null,
        stripeCustomerId: profile?.stripe_customer_id ?? null,
        stripeSubscriptionId: profile?.stripe_subscription_id ?? null,
        subscriptionTier: profile?.subscription_tier ?? (role === 'contractor' ? 'contractor_free' : 'homeowner_basic'),
        subscriptionStatus: profile?.subscription_status ?? 'inactive',
      },
      contractorProfile,
    })
  } catch (err) {
    console.error('[GET /api/auth/me]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
