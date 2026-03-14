import Stripe from "stripe"

const STRIPE_API_VERSION: Stripe.StripeConfig["apiVersion"] = "2026-02-25.clover"

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return null
  }

  return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION })
}

