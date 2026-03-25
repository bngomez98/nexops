import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SubmitCTA() {
  return (
    <section id="submit" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 to-primary/2 p-10 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.48_0.155_142_/_0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.62_0.18_200_/_0.06),transparent_50%)]" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Ready to get your project started?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Submit your request in under 5 minutes. Upload photos, set your budget, pick a consultation
              window, and we will match you with a verified contractor. No cost to you, ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition shadow-lg shadow-primary/20"
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
