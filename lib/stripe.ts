import 'server-only'
import Stripe from 'stripe'

let _client: Stripe | undefined

function getClient(): Stripe {
  if (!_client) {
    const key = process.env.STRIPE_SECRET_KEY?.trim()
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
    _client = new Stripe(key)
  }
  return _client
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    const val = Reflect.get(getClient(), prop)
    return typeof val === 'function' ? val.bind(getClient()) : val
  },
})
