import { NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/env'
import { getStripeClient } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { ensureStripeCustomer } from '@/lib/stripe/customer'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, role, full_name, subscription_status')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('[POST /api/stripe/portal] profile lookup failed', profileError)
      return NextResponse.json({ error: 'Unable to load profile' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'Billing profile not found' }, { status: 404 })
    }

    const customerId = await ensureStripeCustomer({
      supabase,
      userId: user.id,
      email: user.email,
      fullName: profile.full_name,
      stripeCustomerId: profile.stripe_customer_id,
    })

    const stripe = getStripeClient()
    const returnPath = profile.role === 'contractor'
      ? '/dashboard/contractor/billing'
      : '/dashboard/homeowner/billing'

    const returnUrl = `${getSiteUrl()}${returnPath}`

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      flow_data: profile.subscription_status === 'past_due' || profile.stripe_subscription_id
        ? {
            type: 'payment_method_update',
          }
        : undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[POST /api/stripe/portal]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
