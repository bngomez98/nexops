import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getStripeClient } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const stripe = getStripeClient()
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not fully configured." },
      { status: 500 },
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { code, state } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 })
    }

    // Exchange the authorization code for an access token
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    })

    const connectedAccountId = response.stripe_user_id

    if (!connectedAccountId) {
      return NextResponse.json({ error: "Failed to get connected account ID" }, { status: 400 })
    }

    // Verify the account
    const account = await stripe.accounts.retrieve(connectedAccountId)

    // Determine status: fully enabled means charges_enabled + details_submitted
    let status: "active" | "pending" | "restricted" = "pending"
    if (account.charges_enabled && account.details_submitted) {
      status = "active"
    } else if (account.requirements?.disabled_reason) {
      status = "restricted"
    }

    // Update the user's profile with the connected account info
    await supabase
      .from("profiles")
      .update({
        stripe_connect_account_id: connectedAccountId,
        stripe_connect_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      accountId: connectedAccountId,
      status,
    })
  } catch (error) {
    console.error("OAuth callback error:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to complete OAuth authorization" },
      { status: 500 }
    )
  }
}

// Handle GET requests for direct OAuth redirects
export async function GET(req: Request) {
  const stripe = getStripeClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const url = new URL(req.url)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusoperations.org"

  if (!stripe) {
    return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?connect=error`)
  }

  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")
  const errorDescription = url.searchParams.get("error_description")

  // Handle error response from Stripe
  if (error) {
    const redirectUrl = new URL(`${siteUrl}/dashboard/contractor/settings`)
    redirectUrl.searchParams.set("connect", "error")
    redirectUrl.searchParams.set("error_message", errorDescription || error)
    return NextResponse.redirect(redirectUrl.toString())
  }

  if (!user) {
    return NextResponse.redirect(`${siteUrl}/auth/login`)
  }

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?connect=error`)
  }

  try {
    // Exchange the authorization code for an access token
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    })

    const connectedAccountId = response.stripe_user_id

    if (!connectedAccountId) {
      return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?connect=error`)
    }

    // Verify the account
    const account = await stripe.accounts.retrieve(connectedAccountId)

    // Determine status
    let status: "active" | "pending" | "restricted" = "pending"
    if (account.charges_enabled && account.details_submitted) {
      status = "active"
    } else if (account.requirements?.disabled_reason) {
      status = "restricted"
    }

    // Update the user's profile
    await supabase
      .from("profiles")
      .update({
        stripe_connect_account_id: connectedAccountId,
        stripe_connect_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    const param = status === "active" ? "connect=success" : "connect=pending"
    return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?${param}`)
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(`${siteUrl}/dashboard/contractor/settings?connect=error`)
  }
}
