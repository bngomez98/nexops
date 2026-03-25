import type Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendInvoicePaidContractorEmail,
  sendInvoicePaidClientEmail,
} from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  const stripe = getStripeClient()

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
      const stripeInvoice = event.data.object as Stripe.Invoice

      // Legacy flow: service_requests.invoice_paid flag
      const requestId = stripeInvoice.metadata?.requestId
      if (requestId) {
        await supabase.from('service_requests')
          .update({ invoice_paid: true })
          .eq('id', requestId)
      }

      // Jobs flow: look up internal invoice by stripe_invoice_id, mark complete, send receipts
      const stripeInvoiceId = stripeInvoice.id
      const { data: nexusInvoice } = await supabase
        .from('invoices')
        .select('id, job_id, contractor_id, client_id, subtotal, nexus_fee, total')
        .eq('stripe_invoice_id', stripeInvoiceId)
        .maybeSingle()

      if (nexusInvoice) {
        // Mark invoice paid
        await supabase.from('invoices')
          .update({ status: 'paid' })
          .eq('id', nexusInvoice.id)

        // Mark job complete
        await supabase.from('jobs')
          .update({ status: 'completed' })
          .eq('id', nexusInvoice.job_id)

        // Log status history
        await supabase.from('job_status_history').insert({
          job_id:     nexusInvoice.job_id,
          status:     'completed',
          changed_at: new Date().toISOString(),
          changed_by: 'system',
        })

        // Fetch job details for email context
        const { data: job } = await supabase
          .from('jobs')
          .select('service_type')
          .eq('id', nexusInvoice.job_id)
          .single()

        // Send receipt emails (fire-and-forget)
        ;(async () => {
          try {
            const { getAdminClient } = await import('@/lib/supabase/admin')
            const admin = getAdminClient()

            const [{ data: contractorAuth }, { data: clientAuth }] = await Promise.all([
              admin.auth.admin.getUserById(nexusInvoice.contractor_id),
              admin.auth.admin.getUserById(nexusInvoice.client_id),
            ])

            const [{ data: contractorProfile }, { data: clientProfile }] = await Promise.all([
              supabase.from('profiles').select('full_name').eq('user_id', nexusInvoice.contractor_id).maybeSingle(),
              supabase.from('profiles').select('full_name').eq('user_id', nexusInvoice.client_id).maybeSingle(),
            ])

            const serviceType = job?.service_type ?? 'service'

            await Promise.all([
              contractorAuth.user?.email
                ? sendInvoicePaidContractorEmail({
                    to:             contractorAuth.user.email,
                    contractorName: contractorProfile?.full_name ?? 'Contractor',
                    serviceType,
                    subtotal:       nexusInvoice.subtotal,
                    nexusFee:       nexusInvoice.nexus_fee,
                    jobId:          nexusInvoice.job_id,
                  })
                : Promise.resolve(),
              clientAuth.user?.email
                ? sendInvoicePaidClientEmail({
                    to:             clientAuth.user.email,
                    clientName:     clientProfile?.full_name ?? 'Client',
                    contractorName: contractorProfile?.full_name ?? 'Your contractor',
                    serviceType,
                    total:          nexusInvoice.total,
                    jobId:          nexusInvoice.job_id,
                  })
                : Promise.resolve(),
            ])
          } catch (err) {
            console.error('[webhook] invoice.paid email error:', err)
          }
        })()
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
