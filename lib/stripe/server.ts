import Stripe from "stripe"

const STRIPE_API_VERSION: Stripe.StripeConfig["apiVersion"] = "2026-02-25.clover"

/** Returns "sandbox" when using test keys, "live" when using live keys. */
export function getStripeMode(): "sandbox" | "live" | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (key.startsWith("sk_test_")) return "sandbox"
  if (key.startsWith("sk_live_")) return "live"
  return null
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return null
  }

  return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION })
}
