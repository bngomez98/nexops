import Stripe from 'stripe'

let _client: Stripe | undefined

export function getStripeClient(): Stripe {
  if (!_client) {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }
    _client = new Stripe(secretKey, {
      apiVersion: '2026-03-25.dahlia',
    })
  }
  return _client
}
