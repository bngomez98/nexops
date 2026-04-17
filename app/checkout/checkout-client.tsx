'use client'

import { Suspense } from 'react'
import { useSearchParams } from '@/lib/router'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { fetchClientSecret } from '../actions/stripe'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

function CheckoutForm() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')

  if (!planId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">No plan selected. Please choose a plan first.</p>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-destructive/80">
          Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable checkout.
        </p>
      </div>
    )
  }

  const boundFetchClientSecret = fetchClientSecret.bind(null, planId)

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret: boundFetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

export function CheckoutClient() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><span className="text-sm text-muted-foreground">Loading checkout…</span></div>}>
      <CheckoutForm />
    </Suspense>
  )
}
