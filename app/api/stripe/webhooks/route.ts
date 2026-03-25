import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

export async function POST(req: Request) {
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

  try {
    const supabase = createAdminClient()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const requestId = session.metadata?.request_id
        const paymentType = session.metadata?.payment_type

        if (!requestId || !paymentType) break

        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .update({
            status: "paid",
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id)
          .select("id, request_id")
          .maybeSingle()

        if (paymentError) throw paymentError
        if (!payment) break

        if (paymentType === "invoice") {
          const { error: requestError } = await supabase
            .from("service_requests")
            .update({
              status: "completed",
              completion_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", requestId)

          if (requestError) throw requestError
        }

        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string | null

        if (!paymentIntentId) break

        const { error } = await supabase
          .from("payments")
          .update({ status: "refunded", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", paymentIntentId)

        if (error) throw error
        break
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account

        let status: "active" | "pending" | "restricted" = "pending"
        if (account.charges_enabled && account.details_submitted) {
          status = "active"
        } else if (account.requirements?.disabled_reason) {
          status = "restricted"
        }

        const { error } = await supabase
          .from("profiles")
          .update({ stripe_connect_status: status, updated_at: new Date().toISOString() })
          .eq("stripe_connect_account_id", account.id)

        if (error) throw error
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const status = subscription.status

        const mapped =
          status === "active" || status === "trialing"
            ? status
            : status === "past_due"
              ? "past_due"
              : "canceled"

        const { error } = await supabase
          .from("profiles")
          .update({ subscription_status: mapped, updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId)

        if (error) throw error
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { error } = await supabase
          .from("profiles")
          .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId)

        if (error) throw error
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook processing failed", {
      eventType: event.type,
      eventId: event.id,
      error,
    })

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
