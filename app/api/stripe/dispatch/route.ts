import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hasActiveSubscription, SERVICE_REQUEST_FEE_CENTS } from "@/lib/billing/config"

import { getStripeClient } from "@/lib/stripe/server"

const stripe = getStripeClient()

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

// Nexus platform fee: 15% of the dispatch charge
const PLATFORM_FEE_RATE = 0.15

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Dispatch checkout is temporarily unavailable. Stripe is not fully configured." },
      { status: 500 },
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { requestId } = await req.json()
  if (!requestId) {
    return NextResponse.json({ error: "requestId required" }, { status: 400 })
  }

  // Fetch the service request to confirm this user is the owner and get the contractor
  const { data: request } = await supabase
    .from("service_requests")
    .select("id, owner_id, assigned_contractor_id, status, category")
    .eq("id", requestId)
    .single()

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }
  if (request.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (!request.assigned_contractor_id) {
    return NextResponse.json({ error: "No contractor assigned to this request" }, { status: 400 })
  }

  // Check for an existing pending/paid dispatch payment to avoid double-charging
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, status")
    .eq("request_id", requestId)
    .eq("type", "dispatch")
    .in("status", ["pending", "paid"])
    .maybeSingle()

  if (existingPayment) {
    return NextResponse.json(
      { error: "A dispatch fee has already been initiated for this request" },
      { status: 409 }
    )
  }

  // Look up contractor's Stripe Connect account
  const { data: contractor } = await supabase
    .from("profiles")
    .select("stripe_connect_account_id, stripe_connect_status, full_name")
    .eq("id", request.assigned_contractor_id)
    .single()

  if (!contractor?.stripe_connect_account_id || contractor.stripe_connect_status !== "active") {
    return NextResponse.json(
      { error: "Contractor has not completed Stripe onboarding" },
      { status: 400 }
    )
  }

  // Ensure homeowner has a Stripe customer record
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name, subscription_status")
    .eq("id", user.id)
    .single()

  let customerId = ownerProfile?.stripe_customer_id as string | undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: ownerProfile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  const dispatchAmountCents = hasActiveSubscription(ownerProfile?.subscription_status ?? null)
    ? 0
    : SERVICE_REQUEST_FEE_CENTS
  const platformFeeCents = Math.round(dispatchAmountCents * PLATFORM_FEE_RATE)

  if (dispatchAmountCents === 0) {
    await supabase.from("payments").insert({
      request_id: requestId,
      payer_id: user.id,
      contractor_id: request.assigned_contractor_id,
      type: "dispatch",
      amount_cents: 0,
      application_fee_cents: 0,
      status: "paid",
      updated_at: new Date().toISOString(),
    })

    await supabase
      .from("service_requests")
      .update({ owner_fee_paid: true, updated_at: new Date().toISOString() })
      .eq("id", requestId)

    return NextResponse.json({
      paid: true,
      checkoutSkipped: true,
      message: "Your active owner subscription waived the accepted-request fee.",
    })
  }

  // Create a Checkout Session with a destination charge:
  // - The full amount is charged to the homeowner
  // - platformFeeCents stays with Nexus
  // - The remainder is transferred to the contractor
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: dispatchAmountCents,
          product_data: {
            name: "Accepted Request Fee",
            description: `Accepted-request access fee for your ${request.category} service request`,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: contractor.stripe_connect_account_id,
      },
      application_fee_amount: platformFeeCents,
      metadata: {
        request_id: requestId,
        payment_type: "dispatch",
        contractor_id: request.assigned_contractor_id,
        payer_id: user.id,
      },
    },
    success_url: `${siteUrl}/dashboard/requests/${requestId}?payment=success`,
    cancel_url: `${siteUrl}/dashboard/requests/${requestId}?payment=cancelled`,
    metadata: {
      request_id: requestId,
      payment_type: "dispatch",
    },
  })

  // Record the pending payment
  await supabase.from("payments").insert({
    request_id: requestId,
    payer_id: user.id,
    contractor_id: request.assigned_contractor_id,
    type: "dispatch",
    amount_cents: dispatchAmountCents,
    application_fee_cents: platformFeeCents,
    stripe_session_id: session.id,
    status: "pending",
  })

  return NextResponse.json({ url: session.url })
}
