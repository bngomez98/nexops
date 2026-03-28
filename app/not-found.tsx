import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          The page you were looking for may have moved, expired, or never existed. You can head back to the homepage
          or return to the main service flow from here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-muted/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
