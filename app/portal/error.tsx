'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Portal error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Error</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          An unexpected error occurred in the portal. Please try again.
        </p>
        <div className="mt-6">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
