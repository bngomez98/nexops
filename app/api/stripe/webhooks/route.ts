import type Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

  try {
    const supabase = createAdminClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Dispatch / invoice payment flow
        const requestId = session.metadata?.request_id
        const paymentType = session.metadata?.payment_type
        if (requestId && paymentType) {
          const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .update({
              status: 'paid',
              stripe_payment_intent_id: session.payment_intent as string,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_session_id', session.id)
            .select('id, request_id')
            .maybeSingle()

          if (paymentError) throw paymentError

          if (payment && paymentType === 'invoice') {
            const { error: requestError } = await supabase
              .from('service_requests')
              .update({
                status: 'completed',
                completion_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', requestId)

            if (requestError) throw requestError
          }
        }

        // Subscription checkout flow
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId
        if (userId && planId && session.mode === 'subscription') {
          const subId = session.subscription as string
          const sub = await stripe.subscriptions.retrieve(subId)

          await supabase.from('billing_subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subId,
            stripe_customer_id: session.customer as string,
            plan_id: planId,
            status: sub.status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          }, { onConflict: 'stripe_subscription_id' })

          await supabase.from('profiles').update({
            subscription_tier: planId,
            subscription_status: sub.status,
            stripe_subscription_id: subId,
          }).eq('id', userId)
        }

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string | null

        if (!paymentIntentId) break

        const { error } = await supabase
          .from('payments')
          .update({ status: 'refunded', updated_at: new Date().toISOString() })
          .eq('stripe_payment_intent_id', paymentIntentId)

        if (error) throw error
        break
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account

        let status: 'active' | 'pending' | 'restricted' = 'pending'
        if (account.charges_enabled && account.details_submitted) {
          status = 'active'
        } else if (account.requirements?.disabled_reason) {
          status = 'restricted'
        }

        const { error } = await supabase
          .from('profiles')
          .update({ stripe_connect_status: status, updated_at: new Date().toISOString() })
          .eq('stripe_connect_account_id', account.id)

        if (error) throw error
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const status = sub.status
        const planId = sub.metadata?.planId

        const mapped =
          status === 'active' || status === 'trialing'
            ? status
            : status === 'past_due'
              ? 'past_due'
              : 'canceled'

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ subscription_status: mapped, updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', customerId)

        if (profileError) throw profileError

        // Sync billing_subscriptions table
        const isActive = status === 'active' || status === 'trialing'
        await supabase.from('billing_subscriptions')
          .update({
            status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', sub.id)

        if (planId) {
          await supabase.from('profiles')
            .update({ subscription_tier: isActive ? planId : 'free' })
            .eq('stripe_customer_id', customerId)
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { error } = await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', customerId)

        if (error) throw error
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
        const { data: nexusInvoice } = await supabase
          .from('invoices')
          .select('id, job_id, contractor_id, client_id, subtotal, nexus_fee, total')
          .eq('stripe_invoice_id', stripeInvoice.id)
          .maybeSingle()

        if (nexusInvoice) {
          await supabase.from('invoices')
            .update({ status: 'paid' })
            .eq('id', nexusInvoice.id)

          await supabase.from('jobs')
            .update({ status: 'completed' })
            .eq('id', nexusInvoice.job_id)

          await supabase.from('job_status_history').insert({
            job_id:     nexusInvoice.job_id,
            status:     'completed',
            changed_at: new Date().toISOString(),
            changed_by: 'system',
          })

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
  } catch (err) {
    console.error('[webhook] processing failed', { eventType: event.type, eventId: event.id, err })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
