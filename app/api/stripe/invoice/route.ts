import type Stripe from 'stripe'

import { createClient } from '@/lib/supabase/server'
import { getStripeClient } from '@/lib/stripe/server'
import { getSiteUrl } from '@/lib/env'

const siteUrl = getSiteUrl()
const PLATFORM_FEE_RATE = 0.15

export async function POST(req: Request) {
  const stripe = getStripeClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()

  // ── Flow A: invoices table (jobs workflow) ────────────────────────────────
  if (body.invoiceId) {
    const { invoiceId } = body

    const { data: invoice } = await supabase
      .from('invoices')
      .select('id, job_id, contractor_id, client_id, total, nexus_fee, status, stripe_payment_url')
      .eq('id', invoiceId)
      .single()

    if (!invoice) {
      return Response.json({ error: 'Invoice not found' }, { status: 404 })
    }
    if (invoice.client_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (invoice.status === 'paid') {
      return Response.json({ error: 'Invoice is already paid' }, { status: 400 })
    }

    // If we already have a Stripe payment URL, return it
    if (invoice.stripe_payment_url) {
      return Response.json({ url: invoice.stripe_payment_url })
    }

    // Get contractor's Stripe Connect account
    const { data: contractor } = await supabase
      .from('profiles')
      .select('stripe_connect_account_id, stripe_connect_status')
      .eq('id', invoice.contractor_id)
      .single()

    // Get job details
    const { data: job } = await supabase
      .from('jobs')
      .select('service_type')
      .eq('id', invoice.job_id)
      .single()

    // Get or create Stripe customer
    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .single()

    let customerId = ownerProfile?.stripe_customer_id as string | undefined
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: ownerProfile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const amountCents = Math.round(invoice.total * 100)
    const feeCents = Math.round(invoice.nexus_fee * 100)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: `Invoice — ${job?.service_type ? job.service_type.replace(/-|_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Service'}`,
              description: `Invoice #${invoiceId.slice(0, 8).toUpperCase()} · ${new Date().toLocaleDateString()}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/dashboard/homeowner/payments?payment=success`,
      cancel_url: `${siteUrl}/dashboard/homeowner/payments?payment=cancelled`,
      metadata: {
        invoice_id: invoiceId,
        job_id: invoice.job_id,
        payment_type: 'invoice',
      },
    }

    // Add connect transfer if contractor has an account
    if (contractor?.stripe_connect_account_id && contractor.stripe_connect_status === 'active') {
      sessionParams.payment_intent_data = {
        transfer_data: { destination: contractor.stripe_connect_account_id },
        application_fee_amount: feeCents,
        metadata: {
          invoice_id: invoiceId,
          payment_type: 'invoice',
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Store session id on invoice for webhook reconciliation
    await supabase.from('invoices').update({
      stripe_payment_url: session.url,
    }).eq('id', invoiceId)

    return Response.json({ url: session.url })
  }

  // ── Flow B: service_requests table (legacy workflow) ──────────────────────
  const { requestId } = body
  if (!requestId) {
    return Response.json({ error: 'requestId or invoiceId required' }, { status: 400 })
  }

  const { data: serviceRequest } = await supabase
    .from('service_requests')
    .select('id, owner_id, assigned_contractor_id, final_cost, category, status')
    .eq('id', requestId)
    .single()

  if (!serviceRequest) {
    return Response.json({ error: 'Request not found' }, { status: 404 })
  }
  if (serviceRequest.owner_id !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (!serviceRequest.final_cost || serviceRequest.final_cost <= 0) {
    return Response.json({ error: 'No final cost set on this request' }, { status: 400 })
  }
  if (!serviceRequest.assigned_contractor_id) {
    return Response.json({ error: 'No contractor assigned to this request' }, { status: 400 })
  }

  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id, status')
    .eq('request_id', requestId)
    .eq('type', 'invoice')
    .in('status', ['pending', 'paid'])
    .maybeSingle()

  if (existingPayment) {
    return Response.json(
      { error: 'An invoice payment has already been initiated for this request' },
      { status: 409 }
    )
  }

  const { data: contractor } = await supabase
    .from('profiles')
    .select('stripe_connect_account_id, stripe_connect_status, full_name')
    .eq('id', serviceRequest.assigned_contractor_id)
    .single()

  if (!contractor?.stripe_connect_account_id || contractor.stripe_connect_status !== 'active') {
    return Response.json(
      { error: 'Contractor has not completed Stripe onboarding' },
      { status: 400 }
    )
  }

  const amountCents = Math.round(serviceRequest.final_cost * 100)
  const feeCents = Math.round(amountCents * PLATFORM_FEE_RATE)

  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, full_name')
    .eq('id', user.id)
    .single()

  let customerId = ownerProfile?.stripe_customer_id as string | undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: ownerProfile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const { data: dispatchPayment } = await supabase
    .from('payments')
    .select('amount_cents')
    .eq('request_id', requestId)
    .eq('type', 'dispatch')
    .eq('status', 'paid')
    .maybeSingle()

  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        unit_amount: amountCents,
        product_data: {
          name: `Final Invoice — ${serviceRequest.category} Service`,
          description: `Full project cost for service request #${requestId.slice(0, 8)}`,
        },
        recurring: undefined,
      },
      quantity: 1,
    },
  ]

  if (dispatchPayment?.amount_cents) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        unit_amount: -dispatchPayment.amount_cents,
        product_data: {
          name: 'Dispatch Fee Credit',
          description: 'Previously paid dispatch fee applied toward final invoice',
        },
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: lineItems,
    payment_intent_data: {
      transfer_data: { destination: contractor.stripe_connect_account_id },
      application_fee_amount: feeCents,
      metadata: {
        request_id: requestId,
        payment_type: 'invoice',
        contractor_id: serviceRequest.assigned_contractor_id,
        payer_id: user.id,
      },
    },
    success_url: `${siteUrl}/dashboard/requests/${requestId}?payment=success`,
    cancel_url: `${siteUrl}/dashboard/requests/${requestId}?payment=cancelled`,
    metadata: {
      request_id: requestId,
      payment_type: 'invoice',
    },
  })

  await supabase.from('payments').insert({
    request_id: requestId,
    payer_id: user.id,
    contractor_id: serviceRequest.assigned_contractor_id,
    type: 'invoice',
    amount_cents: amountCents,
    application_fee_cents: feeCents,
    stripe_session_id: session.id,
    status: 'pending',
  })

  return Response.json({ url: session.url })
}
