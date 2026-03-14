import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

export async function POST() {
  const stripe = getStripeClient()
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe Connect onboarding is temporarily unavailable. Stripe is not fully configured." },
      { status: 500 },
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Fetch current profile to check role and existing Connect account
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, stripe_connect_account_id, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "contractor") {
    return NextResponse.json({ error: "Only contractors can connect a Stripe account" }, { status: 403 })
  }

  let accountId = profile?.stripe_connect_account_id as string | undefined

  // Create an Express account if one does not exist yet
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: profile?.full_name ?? undefined,
        url: siteUrl,
      },
      metadata: { supabase_user_id: user.id },
    })

    accountId = account.id

    await supabase
      .from("profiles")
      .update({
        stripe_connect_account_id: accountId,
        stripe_connect_status: "pending",
      })
      .eq("id", user.id)
  }

  // Generate a one-time account link for the Stripe Express onboarding flow
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/api/stripe/connect/refresh`,
    return_url: `${siteUrl}/api/stripe/connect/return`,
    type: "account_onboarding",
  })

  return NextResponse.json({ url: accountLink.url })
}
