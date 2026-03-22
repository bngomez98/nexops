import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPlanById } from '@/lib/plans'
import { createClient } from '@/lib/supabase/server'
import { ensureStripeCustomer } from '@/lib/stripe/customer'

export async function POST(req: NextRequest) {
  try {
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
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .single()

    const customerId = await ensureStripeCustomer({
      supabase,
      userId: user.id,
      email: user.email,
      fullName: profile?.full_name,
      stripeCustomerId: profile?.stripe_customer_id,
    })

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: plan.name, description: plan.description },
            unit_amount: plan.priceInCents,
            recurring: { interval: plan.interval },
          },
          quantity: 1,
        },
      ],
      metadata: { userId: user.id, planId },
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    console.error('[POST /api/stripe/checkout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
