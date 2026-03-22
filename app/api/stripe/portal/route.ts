import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { ensureStripeCustomer } from '@/lib/stripe/customer'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, role, full_name, subscription_status')
      .eq('id', user.id)
      .single()

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

    const returnPath = profile.role === 'contractor'
      ? '/dashboard/contractor/settings'
      : '/dashboard/homeowner/settings'

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexusoperations.org'}${returnPath}`

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
