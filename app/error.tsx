'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">500</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          An unexpected error occurred while loading this page. You can try again or head back to
          the homepage.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-muted/40"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
