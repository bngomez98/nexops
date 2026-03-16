import Link from "next/link"
import { ArrowRight, Shield, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Now serving the greater metro area</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Home projects done right,{" "}
            <span className="text-primary">every time</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            Connect with vetted, licensed contractors who deliver quality work on schedule. 
            No more endless searching or unreliable quotes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start your project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup?role=contractor">Join as a contractor</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">500+</span>
            <span className="text-sm text-muted-foreground text-center">Verified contractors</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-6">
            <Clock className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{"<"} 24hr</span>
            <span className="text-sm text-muted-foreground text-center">Average response time</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-6">
            <Star className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">4.9</span>
            <span className="text-sm text-muted-foreground text-center">Average contractor rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
