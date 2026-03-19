import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

import { getStripeClient } from "@/lib/stripe/server"

const stripe = getStripeClient()

async function getSupabase() {
  return createClient()
}

// ── Thin-payload helpers ──────────────────────────────────────────────────────
// Stripe sends either a "snapshot" payload (full object embedded in data.object)
// or a "thin" payload (only id + object type). For thin payloads we must fetch
// the full object before reading any fields beyond id.

type StripeRef = { id: string; object?: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function hasStringId(value: unknown): value is StripeRef {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0
}

function isSnapshot(value: unknown, ...requiredFields: string[]): boolean {
  if (!isRecord(value)) return false
  return requiredFields.every((field) => field in value)
}

async function resolveEventObject<T extends StripeRef>(
  raw: unknown,
  requiredFields: string[],
  retrieve: (id: string) => Promise<T>,
): Promise<T> {
  if (isSnapshot(raw, ...requiredFields)) {
    return raw as T
  }

  if (!hasStringId(raw)) {
    throw new Error("Webhook event payload is missing an object id")
  }

  return retrieve(raw.id)
}

async function resolveCheckoutSession(raw: unknown): Promise<Stripe.Checkout.Session> {
  return resolveEventObject(raw, ["mode", "metadata"], (id) => stripe!.checkout.sessions.retrieve(id))
}

async function resolveCharge(raw: unknown): Promise<Stripe.Charge> {
  return resolveEventObject(raw, ["payment_intent", "amount"], (id) => stripe!.charges.retrieve(id))
}

async function resolveAccount(raw: unknown): Promise<Stripe.Account> {
  return resolveEventObject(raw, ["charges_enabled", "details_submitted"], (id) => stripe!.accounts.retrieve(id))
}

async function resolveSubscription(raw: unknown): Promise<Stripe.Subscription> {
  return resolveEventObject(raw, ["status", "customer"], (id) => stripe!.subscriptions.retrieve(id))
}

async function resolveInvoice(raw: unknown): Promise<Stripe.Invoice> {
  return resolveEventObject(raw, ["status", "customer"], (id) => stripe!.invoices.retrieve(id))
}

async function resolveSetupIntent(raw: unknown): Promise<Stripe.SetupIntent> {
  return resolveEventObject(raw, ["status", "usage"], (id) => stripe!.setupIntents.retrieve(id))
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe webhooks are not configured" }, { status: 500 })
  }

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
    // ── Payment completed (dispatch fee, final invoice, or subscription) ───
    case "checkout.session.completed": {
      const session = await resolveCheckoutSession(event.data.object as object)
      const requestId = session.metadata?.request_id
      const paymentType = session.metadata?.payment_type

      // Subscription checkout: immediately activate the contractor membership
      if (session.mode === "subscription" && session.subscription && session.customer) {
        const customerId = session.customer as string
        await supabase
          .from("profiles")
          .update({ subscription_status: "active", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId)
        break
      }

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
      const charge = await resolveCharge(event.data.object as object)
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
      const account = await resolveAccount(event.data.object as object)

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
      const subscription = await resolveSubscription(event.data.object as object)
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
      const invoice = await resolveInvoice(event.data.object as object)
      const customerId = invoice.customer as string

      await supabase
        .from("profiles")
        .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId)

      break
    }

    // ── SetupIntent created (contractor saving a payment method) ──────────
    // Fired when a contractor initiates payment method setup (e.g. during
    // subscription checkout). No DB write is needed at creation time —
    // the payment method is only actionable after setup_intent.succeeded.
    // We resolve any thin payload here so downstream handling is ready if
    // this case is extended in the future.
    case "setup_intent.created": {
      await resolveSetupIntent(event.data.object as object)
      // No DB action on creation — handled on setup_intent.succeeded
      break
    }

    default:
      // Unhandled events — return 200 to prevent Stripe retrying
      break
  }

  return NextResponse.json({ received: true })
}
