import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

// Contractor lands here after completing (or abandoning) Stripe Express onboarding.
// We retrieve the account to check its current verification state and update the profile.
export async function GET() {
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

  const account = await stripe.accounts.retrieve(accountId)

  // Determine status: fully enabled means charges_enabled + details_submitted
  let status: "active" | "pending" | "restricted" = "pending"
  if (account.charges_enabled && account.details_submitted) {
    status = "active"
  } else if (account.requirements?.disabled_reason) {
    status = "restricted"
  }

  await supabase
    .from("profiles")
    .update({ stripe_connect_status: status })
    .eq("id", user.id)

  const param = status === "active" ? "connect=success" : "connect=pending"
  return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?${param}`)
}
