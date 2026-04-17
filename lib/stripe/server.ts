import Stripe from 'stripe'

let _client: Stripe | undefined

export function getStripeClient(): Stripe {
  if (!_client) {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }
    const apiVersion = (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined) ?? '2024-12-18'
    _client = new Stripe(secretKey, {
      apiVersion,
    })
  }
  return _client
}
