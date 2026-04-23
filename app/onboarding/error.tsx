'use client'

import { useEffect } from 'react'
import Link from '@/components/link'

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Onboarding error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Error</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Setup interrupted</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Something went wrong during setup. Your progress has been saved where possible — you can
          try again or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-muted/40"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
