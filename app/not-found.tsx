import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-border/40 bg-card p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-3">Page not found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          The route may have moved or the URL may be incorrect. Return home and continue from the main navigation.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
          Back to homepage <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}
