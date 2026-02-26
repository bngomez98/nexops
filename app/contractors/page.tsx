import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Clock, DollarSign } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "For Contractors",
  description: "Join NexOps to receive exclusive, pre-qualified project requests with full scope and budget context.",
}

const benefits = [
  { icon: ShieldCheck, title: "Exclusive assignment", text: "When you claim, the project is removed from all other contractor feeds." },
  { icon: Clock, title: "Complete briefs", text: "Photos, scope, and budget details are available before you commit." },
  { icon: DollarSign, title: "Flat monthly pricing", text: "No per-lead fees and no bidding war economics." },
]

export default function ContractorsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 max-w-3xl">
            <p className="text-primary text-sm font-medium tracking-wide mb-4">For licensed contractors</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              Exclusive project requests in Topeka.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Claim work that matches your verified categories with complete project context and predictable access costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90">
                Apply to join <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-border/40 rounded-xl hover:bg-secondary/50">
                View plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <article key={b.title} className="rounded-2xl border border-border/40 bg-card p-6">
                  <b.icon className="h-5 w-5 text-primary mb-4" />
                  <h2 className="text-lg font-semibold mb-2">{b.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
