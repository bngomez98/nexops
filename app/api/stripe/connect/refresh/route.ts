import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripeClient } from "@/lib/stripe/server"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

// Stripe redirects contractors here when an account link has expired.
// We generate a fresh link and redirect the contractor back into the flow.
export async function GET() {
  const stripe = getStripeClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${siteUrl}/auth/login`)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_connect_account_id")
    .eq("id", user.id)
    .single()

  const accountId = profile?.stripe_connect_account_id
  if (!accountId) {
    return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?connect=error`)
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/api/stripe/connect/refresh`,
    return_url: `${siteUrl}/api/stripe/connect/return`,
    type: "account_onboarding",
  })

  return NextResponse.redirect(accountLink.url)
}
