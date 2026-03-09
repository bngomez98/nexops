import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { priceId } = await req.json()
  if (!priceId) {
    return NextResponse.json({ error: "priceId required" }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

  // Create or retrieve a Stripe customer for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", user.id)
    .single()

  let customerId = profile?.stripe_customer_id as string | undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard/contractor/settings?billing=success`,
    cancel_url: `${siteUrl}/dashboard/contractor/settings`,
  })

  return NextResponse.json({ url: session.url })
}
