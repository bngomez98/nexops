import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe/server"


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

// Nexus platform fee: 15% of the invoice total
const PLATFORM_FEE_RATE = 0.15

export async function POST(req: Request) {
  const stripe = getStripe()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { requestId } = await req.json()
  if (!requestId) {
    return NextResponse.json({ error: "requestId required" }, { status: 400 })
  }

  // Fetch the service request; must be owned by the authed user and have a final cost set
  const { data: request } = await supabase
    .from("service_requests")
    .select("id, owner_id, assigned_contractor_id, final_cost, category, status")
    .eq("id", requestId)
    .single()

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }
  if (request.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (!request.final_cost || request.final_cost <= 0) {
    return NextResponse.json({ error: "No final cost set on this request" }, { status: 400 })
  }
  if (!request.assigned_contractor_id) {
    return NextResponse.json({ error: "No contractor assigned to this request" }, { status: 400 })
  }

  // Check for an existing pending/paid invoice payment
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, status")
    .eq("request_id", requestId)
    .eq("type", "invoice")
    .in("status", ["pending", "paid"])
    .maybeSingle()

  if (existingPayment) {
    return NextResponse.json(
      { error: "An invoice payment has already been initiated for this request" },
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

  // Convert dollars to cents
  const amountCents = Math.round(request.final_cost * 100)
  const feeCents = Math.round(amountCents * PLATFORM_FEE_RATE)

  // Ensure homeowner has a Stripe customer record
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
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

  // Retrieve any paid dispatch fee for this request to show it as a credit line item
  const { data: dispatchPayment } = await supabase
    .from("payments")
    .select("amount_cents")
    .eq("request_id", requestId)
    .eq("type", "dispatch")
    .eq("status", "paid")
    .maybeSingle()

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        unit_amount: amountCents,
        product_data: {
          name: `Final Invoice — ${request.category} Service`,
          description: `Full project cost for service request #${requestId.slice(0, 8)}`,
        },
      },
      quantity: 1,
    },
  ]

  // If a dispatch fee was already paid, credit it back on the invoice
  if (dispatchPayment?.amount_cents) {
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: -dispatchPayment.amount_cents,
        product_data: {
          name: "Dispatch Fee Credit",
          description: "Previously paid dispatch fee applied toward final invoice",
        },
      },
      quantity: 1,
    })
  }

  // Create a Checkout Session with a destination charge
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: lineItems,
    payment_intent_data: {
      transfer_data: {
        destination: contractor.stripe_connect_account_id,
      },
      application_fee_amount: feeCents,
      metadata: {
        request_id: requestId,
        payment_type: "invoice",
        contractor_id: request.assigned_contractor_id,
        payer_id: user.id,
      },
    },
    success_url: `${siteUrl}/dashboard/requests/${requestId}?payment=success`,
    cancel_url: `${siteUrl}/dashboard/requests/${requestId}?payment=cancelled`,
    metadata: {
      request_id: requestId,
      payment_type: "invoice",
    },
  })

  // Record the pending payment
  await supabase.from("payments").insert({
    request_id: requestId,
    payer_id: user.id,
    contractor_id: request.assigned_contractor_id,
    type: "invoice",
    amount_cents: amountCents,
    application_fee_cents: feeCents,
    stripe_session_id: session.id,
    status: "pending",
  })

  return NextResponse.json({ url: session.url })
}
