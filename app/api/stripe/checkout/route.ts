
import { getPlanById } from '@/lib/plans'
import { createClient } from '@/lib/supabase/server'
import { ensureStripeCustomer } from '@/lib/stripe/customer'
import { getSiteUrl } from '@/lib/env'
import { getStripeClient } from '@/lib/stripe/server'

export async function POST(req: Request) {
  try {
    const stripe = getStripeClient()
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { planId, embedded } = body

    const plan = getPlanById(planId)
    if (!plan) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }
    if (plan.priceInCents === 0) {
      return Response.json({ error: 'Free plans do not require checkout' }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name, role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('[POST /api/stripe/checkout] profile lookup failed', profileError)
      return Response.json({ error: 'Unable to load profile' }, { status: 500 })
    }

    const customerId = await ensureStripeCustomer({
      supabase,
      userId: user.id,
      email: user.email,
      fullName: profile?.full_name,
      stripeCustomerId: profile?.stripe_customer_id,
    })

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

    if (embedded) {
      // Embedded checkout: redirect to confirm page on completion
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        ui_mode: 'embedded_page',
        redirect_on_completion: 'always',
        return_url: `${siteUrl}/dashboard/billing/confirm?session_id={CHECKOUT_SESSION_ID}`,
        line_items: [lineItem],
        metadata: { userId: user.id, planId },
        subscription_data: {
          metadata: { userId: user.id, planId },
        },
      })

      if (!session.client_secret) {
        return Response.json({ error: 'Stripe did not return a client secret' }, { status: 500 })
      }

      return Response.json({ clientSecret: session.client_secret })
    }

    // Standard redirect checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      success_url: `${siteUrl}/dashboard/billing/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${billingPath}?checkout=cancelled`,
      line_items: [lineItem],
      metadata: { userId: user.id, planId },
      subscription_data: {
        metadata: { userId: user.id, planId },
      },
    })

    if (!session.url) {
      return Response.json({ error: 'Stripe did not return a checkout URL' }, { status: 500 })
    }

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('[POST /api/stripe/checkout]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
