import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2026-02-25.clover" })
  : null

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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Unable to load your billing profile." }, { status: 500 })
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe billing account was found for your profile. Contact support to complete setup." },
        { status: 400 },
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/dashboard/contractor/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: "We could not open the Stripe billing portal. Please try again." }, { status: 500 })
  }
}
