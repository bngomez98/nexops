'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/link'
import { X } from 'lucide-react'

const CONSENT_KEY = 'nexus-cookie-consent'

type ConsentStatus = 'accepted' | 'rejected' | null

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function updateGtagConsent(granted: boolean) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const status = granted ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  })
  // Push a custom event so GTM triggers can listen for consent changes
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: granted ? 'cookie_consent_accepted' : 'cookie_consent_rejected',
    consent_granted: granted,
  })
}

export function CookieConsentBanner() {
  const [status, setStatus] = useState<ConsentStatus>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus
    if (stored === 'accepted') {
      updateGtagConsent(true)
      setStatus('accepted')
    } else if (stored === 'rejected') {
      updateGtagConsent(false)
      setStatus('rejected')
    } else {
      // No prior choice — show the banner
      setVisible(true)
    }
  }, [])

  function dismiss() {
    // Hide the banner without recording a consent decision
    setVisible(false)
  }

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setStatus('accepted')
    setVisible(false)
    updateGtagConsent(true)
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setStatus('rejected')
    setVisible(false)
    updateGtagConsent(false)
  }

  if (!visible || status !== null) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-lg"
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use cookies to improve your experience and analyze site traffic. See our{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={reject}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
          >
            Reject non-essential
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Accept all
          </button>
          <button
            onClick={dismiss}
            aria-label="Close cookie banner"
            className="ml-1 rounded-full p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
