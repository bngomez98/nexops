import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.75_0.18_155_/_0.08),_transparent_60%)]" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/40" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-primary text-sm font-medium tracking-wide mb-6">
            Home services, simplified
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
            One request.
            <br />
            One verified contractor.
            <br />
            <span className="text-primary">No runaround.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
            Upload photos of your project, set a budget, and pick a consultation time.
            We match you with a single licensed, insured contractor who claims your job first-come, first-served. Free for homeowners.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <Link
              href="#submit"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit a Request
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contractors"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              I'm a contractor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Exclusive leads, not shared
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Licensed and insured only
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Free for homeowners
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
