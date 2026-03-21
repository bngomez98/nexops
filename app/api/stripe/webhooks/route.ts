import type Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const planId = session.metadata?.planId
      if (!userId || !planId || session.mode !== 'subscription') break

      const subId = session.subscription as string
      const sub = await stripe.subscriptions.retrieve(subId)

      await supabase.from('billing_subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subId,
        stripe_customer_id: session.customer as string,
        plan_id: planId,
        status: sub.status,
        current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
      }, { onConflict: 'stripe_subscription_id' })

      await supabase.from('profiles').update({
        subscription_tier: planId,
        subscription_status: sub.status,
        stripe_subscription_id: subId,
      }).eq('id', userId)
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const status = sub.status
      const planId = sub.metadata?.planId

      await supabase.from('billing_subscriptions')
        .update({
          status,
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', sub.id)

      // Update profile tier
      const isActive = status === 'active' || status === 'trialing'
      await supabase.from('profiles')
        .update({
          subscription_status: status,
          subscription_tier: isActive ? (planId ?? 'free') : 'free',
        })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase.from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer as string)
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const requestId = invoice.metadata?.requestId
      if (requestId) {
        await supabase.from('service_requests')
          .update({ invoice_paid: true })
          .eq('id', requestId)
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
