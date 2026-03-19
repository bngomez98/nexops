import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"
import { getBillingRole } from "@/lib/billing/config"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"
const staticPortalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL ?? null

const stripe = getStripeClient()

export async function POST() {
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing is temporarily unavailable. Stripe is not fully configured." },
      { status: 500 },
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const billingRole = getBillingRole(user.user_metadata?.role)
    const returnPath =
      billingRole === "contractor" ? "/dashboard/contractor/settings" : "/dashboard/settings"

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Unable to load your billing profile." }, { status: 500 })
    }

    if (!profile?.stripe_customer_id) {
      // No Stripe customer yet — fall back to the static Customer Portal login URL
      // so contractors can still access portal features (e.g. test mode).
      if (staticPortalUrl) {
        return NextResponse.json({ url: staticPortalUrl })
      }
      return NextResponse.json(
        { error: "No Stripe billing account was found for your profile. Contact support to complete setup." },
        { status: 400 },
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}${returnPath}`,
    })

    return NextResponse.json({ url: session.url })
  } catch {
    // If session creation fails, fall back to the static portal URL if available.
    if (staticPortalUrl) {
      return NextResponse.json({ url: staticPortalUrl })
    }
    return NextResponse.json({ error: "We could not open the Stripe billing portal. Please try again." }, { status: 500 })
  }
}
