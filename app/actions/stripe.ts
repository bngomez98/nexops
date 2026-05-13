'use server'

import { createClient } from '@/lib/supabase/server'
import { getStripeClient } from '@/lib/stripe/server'
import { ensureStripeCustomer } from '@/lib/stripe/customer'
import { getPlanById } from '@/lib/plans'
import { getSiteUrl } from '@/lib/env'

export async function fetchClientSecret(planId: string): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  const plan = getPlanById(planId)
  if (!plan) throw new Error('Invalid plan')
  if (plan.priceInCents === 0) throw new Error('Free plans do not require checkout')

  const stripe = getStripeClient()

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
    ui_mode: 'embedded_page',
    redirect_on_completion: 'always',
    return_url: `${getSiteUrl()}/dashboard/billing/confirm?session_id={CHECKOUT_SESSION_ID}`,
    line_items: [lineItem],
    metadata: { userId: user.id, planId },
    subscription_data: {
      metadata: { userId: user.id, planId },
    },
  })

  if (!session.client_secret) throw new Error('Stripe did not return a client secret')
  return session.client_secret
}
