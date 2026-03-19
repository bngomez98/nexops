import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe/server"
import { hasActiveSubscription, SERVICE_REQUEST_FEE_CENTS } from "@/lib/billing/config"

const stripe = getStripeClient()
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = user.user_metadata?.role || "homeowner"
  if (role !== "contractor") {
    return NextResponse.json({ error: "Only contractors can claim requests" }, { status: 403 })
  }

  const { data: request } = await supabase
    .from("service_requests")
    .select("id, category, assigned_contractor_id, status")
    .eq("id", id)
    .single()

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  if (request.assigned_contractor_id || !["pending_review", "in_queue"].includes(request.status)) {
    return NextResponse.json({ error: "Request is no longer available" }, { status: 409 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name, subscription_status")
    .eq("id", user.id)
    .single()

  if (hasActiveSubscription(profile?.subscription_status ?? null)) {
    const { data, error } = await supabase
      .from("service_requests")
      .update({
        assigned_contractor_id: user.id,
        status: "assigned",
        contractor_fee_paid: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .is("assigned_contractor_id", null)
      .in("status", ["pending_review", "in_queue"])
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Request is no longer available" }, { status: 409 })
    }

    return NextResponse.json({ claimed: true, request: data })
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Claim checkout is temporarily unavailable. Stripe is not fully configured." },
      { status: 500 },
    )
  }

  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, stripe_session_id, status")
    .eq("request_id", id)
    .eq("contractor_id", user.id)
    .eq("type", "claim_fee")
    .in("status", ["pending", "paid"])
    .maybeSingle()

  if (existingPayment?.status === "paid") {
    return NextResponse.json({ error: "This request has already been claimed from your account." }, { status: 409 })
  }

  let customerId = profile?.stripe_customer_id as string | undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id, billing_role: "contractor" },
    })
    customerId = customer.id

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: SERVICE_REQUEST_FEE_CENTS,
          product_data: {
            name: "Contractor Claim Fee",
            description: `Unsubscribed claim fee to accept this ${request.category} request`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard/contractor/requests/${id}?claim=success`,
    cancel_url: `${siteUrl}/dashboard/contractor/requests/${id}?claim=canceled`,
    metadata: {
      request_id: id,
      payment_type: "claim_fee",
      contractor_id: user.id,
      payer_id: user.id,
    },
  })

  if (existingPayment?.id) {
    await supabase
      .from("payments")
      .update({
        amount_cents: SERVICE_REQUEST_FEE_CENTS,
        application_fee_cents: SERVICE_REQUEST_FEE_CENTS,
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingPayment.id)
  } else {
    await supabase.from("payments").insert({
      request_id: id,
      payer_id: user.id,
      contractor_id: user.id,
      type: "claim_fee",
      amount_cents: SERVICE_REQUEST_FEE_CENTS,
      application_fee_cents: SERVICE_REQUEST_FEE_CENTS,
      stripe_session_id: session.id,
      status: "pending",
    })
  }

  return NextResponse.json({
    claimed: false,
    requiresPayment: true,
    url: session.url,
    message: "Complete the $99 claim fee to accept this request without a subscription.",
  })
}
