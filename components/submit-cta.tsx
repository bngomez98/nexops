import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SubmitCTA() {
  return (
    <section id="submit" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-2xl border border-border/40 bg-card p-10 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.75_0.18_155_/_0.06),_transparent_50%)]" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Ready to get your project started?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Submit your request in under 5 minutes. Upload photos, set your budget, pick a consultation
              window, and we will match you with a verified contractor. No cost to you, ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit a Request
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Free for homeowners</span>
                <span className="hidden sm:inline">No phone tag</span>
                <span className="hidden sm:inline">24hr response</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
