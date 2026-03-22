import { NextRequest, NextResponse } from 'next/server'
import { getPlanById } from '@/lib/plans'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/env'
import { getStripeClient } from '@/lib/stripe/server'

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient()
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { planId } = await req.json()
    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    if (plan.priceInCents === 0) {
      return NextResponse.json({ error: 'Free plans do not require checkout' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name, role')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id as string | undefined
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name ?? user.email,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const billingPath = profile?.role === 'contractor'
      ? '/dashboard/contractor/billing'
      : '/dashboard/homeowner/billing'

    const siteUrl = getSiteUrl()

    // Use pre-configured Stripe Price ID when available; fall back to price_data
    const lineItem = plan.stripePriceId
      ? { price: plan.stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: 'usd',
            product_data: { name: plan.name, description: plan.description },
            unit_amount: plan.priceInCents,
            recurring: { interval: plan.interval },
          },
          quantity: 1,
        }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      success_url: `${siteUrl}${billingPath}?checkout=success`,
      cancel_url: `${siteUrl}${billingPath}?checkout=cancelled`,
      line_items: [lineItem],
      metadata: { userId: user.id, planId },
      subscription_data: {
        metadata: { userId: user.id, planId },
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[POST /api/stripe/checkout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
