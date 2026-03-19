import type Stripe from "stripe"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripeClient } from "@/lib/stripe/server"


async function getSupabase() {
  return createClient()
}

export async function POST(req: Request) {
  const stripe = getStripeClient()
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await getSupabase()

  switch (event.type) {
    // ── Payment completed (dispatch fee or final invoice) ──────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const requestId = session.metadata?.request_id
      const paymentType = session.metadata?.payment_type

      if (!requestId || !paymentType) break

      // Mark payment record as paid
      const { data: payment } = await supabase
        .from("payments")
        .update({ status: "paid", stripe_payment_intent_id: session.payment_intent as string, updated_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id)
        .select("id, request_id")
        .maybeSingle()

      if (!payment) break

      // On final invoice payment, mark the service request as completed
      if (paymentType === "invoice") {
        await supabase
          .from("service_requests")
          .update({ status: "completed", completion_date: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", requestId)
      }

      break
    }

    // ── Refund issued ────────────────────────────────────────────────────
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string | null

      if (!paymentIntentId) break

      await supabase
        .from("payments")
        .update({ status: "refunded", updated_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", paymentIntentId)

      break
    }

    // ── Contractor Connect account updated ────────────────────────────────
    case "account.updated": {
      const account = event.data.object as Stripe.Account

      // Determine new status
      let status: "active" | "pending" | "restricted" = "pending"
      if (account.charges_enabled && account.details_submitted) {
        status = "active"
      } else if (account.requirements?.disabled_reason) {
        status = "restricted"
      }

      await supabase
        .from("profiles")
        .update({ stripe_connect_status: status, updated_at: new Date().toISOString() })
        .eq("stripe_connect_account_id", account.id)

      break
    }

    // ── Subscription status changes (contractor membership) ───────────────
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const status = subscription.status

      // Map Stripe subscription status to our simplified enum
      const mapped =
        status === "active" || status === "trialing"
          ? status
          : status === "past_due"
          ? "past_due"
          : "canceled"

      await supabase
        .from("profiles")
        .update({ subscription_status: mapped, updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId)

      break
    }

    // ── Invoice payment failed (contractor membership) ────────────────────
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await supabase
        .from("profiles")
        .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId)

      break
    }

    default:
      // Unhandled events — return 200 to prevent Stripe retrying
      break
  }

  return NextResponse.json({ received: true })
}
