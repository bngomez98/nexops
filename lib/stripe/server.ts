import Stripe from "stripe"

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY")
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover",
  })
}
