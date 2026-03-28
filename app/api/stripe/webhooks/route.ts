import type Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe/server'
import { getAdminClient } from '@/lib/supabase/admin'
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
    const supabase = getAdminClient()

    switch (event.type) {
      // ── Checkout completed (one-time invoice payment) ──────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const requestId = session.metadata?.request_id
        const paymentType = session.metadata?.payment_type
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId

        // Jobs/invoices table payment
        const invoiceId = session.metadata?.invoice_id
        if (invoiceId && paymentType === 'invoice') {
          await supabase.from('invoices')
            .update({ status: 'paid' })
            .eq('id', invoiceId)
          // Mark the associated job as completed
          const jobId = session.metadata?.job_id
          if (jobId) {
            await supabase.from('jobs').update({ status: 'completed' }).eq('id', jobId)
          }
        }

        // Service request invoice payment
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
            await supabase
              .from('service_requests')
              .update({
                status: 'completed',
                completion_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', requestId)
          }
        }

        // Subscription checkout
        if (userId && planId && session.mode === 'subscription') {
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
        }
        break
      }

      // ── Subscription updated / deleted ─────────────────────────────────────
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
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

        const requestId = stripeInvoice.metadata?.requestId
        if (requestId) {
          await supabase.from('service_requests')
            .update({ invoice_paid: true })
            .eq('id', requestId)
        }

        const stripeInvoiceId = stripeInvoice.id
        const { data: nexusInvoice } = await supabase
          .from('invoices')
          .select('id, job_id, contractor_id, client_id, subtotal, nexus_fee, total')
          .eq('stripe_invoice_id', stripeInvoiceId)
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
            subscription_status: status === 'past_due' ? 'past_due' : (isActive ? status : 'canceled'),
            subscription_tier: isActive ? (planId ?? 'free') : 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      // ── Invoice paid (subscription renewal or job invoice) ─────────────────
      case 'invoice.paid': {
        const stripeInvoice = event.data.object as Stripe.Invoice

        // Legacy: service_requests.invoice_paid flag
        const requestId = stripeInvoice.metadata?.requestId
        if (requestId) {
          await supabase.from('service_requests')
            .update({ invoice_paid: true })
            .eq('id', requestId)
        }

        // Jobs flow: look up internal invoice by stripe_invoice_id
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

      // ── Invoice payment failed ──────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        await supabase.from('profiles')
          .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', customerId)
        break
      }

      // ── Charge refunded ────────────────────────────────────────────────────
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string | null
        if (!paymentIntentId) break
        await supabase.from('payments')
          .update({ status: 'refunded', updated_at: new Date().toISOString() })
          .eq('stripe_payment_intent_id', paymentIntentId)
        break
      }

      // ── Stripe Connect account updated ────────────────────────────────────
      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        let status: 'active' | 'pending' | 'restricted' = 'pending'
        if (account.charges_enabled && account.details_submitted) {
          status = 'active'
        } else if (account.requirements?.disabled_reason) {
          status = 'restricted'
        }
        await supabase.from('profiles')
          .update({ stripe_connect_status: status, updated_at: new Date().toISOString() })
          .eq('stripe_connect_account_id', account.id)
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] processing error:', err)
  } catch (error) {
    console.error('Stripe webhook processing failed', {
      eventType: event.type,
      eventId: event.id,
      error,
    })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
