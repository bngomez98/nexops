import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripeClient } from "@/lib/stripe/server"
import { getSiteUrl } from "@/lib/env"

const siteUrl = getSiteUrl()

// Stripe redirects contractors here when an account link has expired.
// We generate a fresh link and redirect the contractor back into the flow.
export async function GET() {
  try {
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
  } catch (err) {
    console.error('[GET /api/stripe/connect/refresh]', err)
    return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?connect=error`)
  }
}
