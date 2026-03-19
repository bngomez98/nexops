import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripeClient } from "@/lib/stripe/server"

export async function POST() {
  const stripe = getStripeClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Look up the Stripe customer ID stored on the profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found. Contact admin@nexusoperations.org to set up your subscription." },
      { status: 400 }
    )
  }

  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"}/dashboard/contractor/settings`

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: returnUrl,
  })

  return NextResponse.json({ url: session.url })
}
