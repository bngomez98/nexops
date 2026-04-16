'use client'

import { useEffect } from 'react'
import Link from '@/components/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">500</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
        An unexpected error occurred. Your data is safe — try refreshing or returning to the
        dashboard home.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-muted/40"
        >
          Dashboard home
        </Link>
      </div>
    </div>
  )
}
