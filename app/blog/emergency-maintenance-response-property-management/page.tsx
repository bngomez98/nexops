import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "@/components/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Emergency Maintenance at 11 PM: What a Well-Managed Response Looks Like | Nexus Operations",
  description:
    "A burst pipe on a Saturday night is a test of your operations system. This post walks through what a documented emergency response process looks like — from tenant call to invoice.",
  keywords: [
    "emergency maintenance property management",
    "after hours maintenance Topeka",
    "emergency contractor response",
    "burst pipe property management",
    "emergency repair response",
    "24 hour maintenance Topeka KS",
  ],
  alternates: { canonical: "https://nexusoperations.org/blog/emergency-maintenance-response-property-management" },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <article className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
            </Link>
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">Emergency Response</span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> 5 min read</span>
              <span className="text-[12px] text-muted-foreground">· February 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground mb-6">
              Emergency Maintenance at 11 PM: What a Well-Managed Response Actually Looks Like
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-5">
              A burst pipe on a Saturday night is a test of your operations system. Most property managers have a mental rolodex of contractors they hope will pick up. This post walks through what a documented emergency response process looks like.
            </p>
            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6">
              <h2 className="text-xl font-semibold text-foreground">The problem with the mental rolodex</h2>
              <p>
                Most property managers who have managed a portfolio for more than a year have a short list of contractors they trust. For routine jobs in business hours, this works fine. For an emergency at 11 PM on a Saturday, it becomes a race to find someone available — and it usually falls to whoever picks up first, not whoever is best qualified.
              </p>
              <p>
                When the call comes in, the property manager starts dialing. One plumber doesn&apos;t answer. The second says he can&apos;t make it until morning. The third agrees but gives a rate 40% above normal. The tenant is told help is coming, but no one knows when. The manager stays up waiting for updates.
              </p>
              <h2 className="text-xl font-semibold text-foreground">What a documented emergency process looks like</h2>
              <p>
                A documented emergency process removes the improvisation. Instead of starting from scratch when the call comes in, the response follows a defined path: the request is submitted through a portal with basic information (unit, issue type, photos), a contractor is assigned from a pre-verified on-call pool within a defined window (1 hour in the case of Nexus Operations&apos; Emergency tier), and the tenant and property manager both receive confirmation with contractor details and ETA.
              </p>
              <p>
                The key difference is that the property manager is not the dispatcher. They submit the request and receive updates. The operational work — finding the contractor, confirming availability, scheduling arrival — happens in the system.
              </p>
              <h2 className="text-xl font-semibold text-foreground">After-hours coverage: what the SLA actually means</h2>
              <p>
                The Nexus Operations Emergency tier — contractor assigned within 1 hour, on-site within 4 hours — applies around the clock. Including 11 PM Saturday. That coverage is only possible because the contractor pool is maintained in advance, on-call rotation exists, and the dispatch process doesn&apos;t depend on one person being awake and available.
              </p>
              <p>
                For property managers whose current emergency plan is &quot;hope someone answers,&quot; this is the structural difference. It&apos;s not about working harder in the moment. It&apos;s about building the system before the call comes in.
              </p>
              <h2 className="text-xl font-semibold text-foreground">The after-hours contact path</h2>
              <p>
                For Nexus Operations clients, after-hours emergencies are handled through the portal or via the dedicated emergency email:{" "}
                <a href="mailto:emergency@nexusoperations.org" className="text-primary hover:underline">emergency@nexusoperations.org</a>.
                An on-call coordinator responds within 15 minutes. The Emergency SLA clock starts from the moment the request is received — not from the next business day.
              </p>
            </div>
            <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">See the full process walkthrough</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                The Nexus Operations About page walks through a real Emergency-tier request from submission to invoice — times and all.
              </p>
              <Link href="/about#process" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                Read the walkthrough <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 pt-8 border-t border-border">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
