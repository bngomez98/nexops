'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { X } from 'lucide-react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)

interface EmbeddedCheckoutModalProps {
  planId: string
  onClose: () => void
}

export function EmbeddedCheckoutModal({ planId, onClose }: EmbeddedCheckoutModalProps) {
  const [error, setError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the close button when the modal opens
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, embedded: true }),
    })
    const data = await res.json()
    if (!res.ok || !data.clientSecret) {
      setError(data.error || 'Failed to start checkout')
      throw new Error(data.error || 'Failed to start checkout')
    }
    return data.clientSecret as string
  }, [planId])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Complete your subscription"
        className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-4 h-4" />
        </button>

        {error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <div aria-live="polite" className="min-h-[400px]">
              <EmbeddedCheckout />
            </div>
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  )
}
