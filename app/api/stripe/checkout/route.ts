import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"
import { getBillingRole, getSubscriptionPriceCents } from "@/lib/billing/config"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

const stripe = getStripeClient()

export async function POST() {
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Stripe is not fully configured." },
      { status: 500 },
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const billingRole = getBillingRole(user.user_metadata?.role)

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, full_name, subscription_price_cents")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id, billing_role: billingRole },
      })
      customerId = customer.id

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const priceCents = getSubscriptionPriceCents({
      billingRole,
      configuredPriceCents: profile?.subscription_price_cents ?? null,
    })

    const successPath =
      billingRole === "contractor"
        ? "/dashboard/contractor/billing?billing=success"
        : "/dashboard/billing?billing=success"
    const cancelPath =
      billingRole === "contractor"
        ? "/dashboard/contractor/billing?billing=canceled"
        : "/dashboard/billing?billing=canceled"

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            recurring: { interval: "month" },
            product_data: {
              name:
                billingRole === "contractor"
                  ? "Nexus Contractor Membership"
                  : "Nexus Property Owner Membership",
              description:
                billingRole === "contractor"
                  ? "Monthly membership with full request-feed access or pay-per-claim fallback."
                  : "Monthly owner subscription with accepted-request fee waived.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}${successPath}`,
      cancel_url: `${siteUrl}${cancelPath}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        subscription_role: billingRole,
        subscription_price_cents: String(priceCents),
      },
      subscription_data: {
        metadata: {
          subscription_role: billingRole,
          subscription_price_cents: String(priceCents),
          supabase_user_id: user.id,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: "Unable to start Stripe checkout. Please try again." }, { status: 500 })
  }
}
