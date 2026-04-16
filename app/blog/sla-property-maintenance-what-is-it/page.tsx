import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "@/components/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "What Is an SLA in Property Maintenance? | Nexus Operations",
  description:
    "A service level agreement defines how quickly a contractor must be assigned and on-site. Without one, you have a vendor relationship built on goodwill. Here's what an SLA actually commits to.",
  keywords: [
    "SLA property maintenance",
    "service level agreement property management",
    "contractor response time",
    "maintenance SLA Topeka",
    "property management vendor SLA",
  ],
  alternates: { canonical: "https://nexusoperations.org/blog/sla-property-maintenance-what-is-it" },
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">Operations</span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> 4 min read</span>
              <span className="text-[12px] text-muted-foreground">· January 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground mb-6">
              What Is an SLA in Property Maintenance — and Why You Should Be Holding Your Vendors to One
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-5">
              Without an SLA, you have a vendor relationship built on goodwill. With one, you have a contractual benchmark — something you can measure, report on, and enforce.
            </p>
            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6">
              <h2 className="text-xl font-semibold text-foreground">What an SLA is</h2>
              <p>
                A service level agreement (SLA) is a written commitment that a service will be delivered within specific, measurable time windows. In property maintenance, that typically means two things: how long until a contractor is assigned to the job, and how long until the contractor is on-site.
              </p>
              <p>
                An SLA is not a best-effort promise. It&apos;s a defined standard against which actual performance is measured. If performance falls below the standard, there&apos;s a documented gap — and typically a defined consequence or escalation path.
              </p>
              <h2 className="text-xl font-semibold text-foreground">Why most property managers don&apos;t have one</h2>
              <p>
                Most property manager / contractor relationships in the Topeka market are informal. The contractor is a trusted contact, work gets done on a handshake, and response times are understood rather than documented. This works fine when the relationship is stable and the contractor has capacity.
              </p>
              <p>
                It fails when the contractor is unavailable, when there&apos;s a dispute about how quickly they responded, or when a tenant escalation requires documented evidence that repair timelines were reasonable. At that point, there&apos;s no benchmark — just competing recollections.
              </p>
              <h2 className="text-xl font-semibold text-foreground">The Nexus Operations SLA structure</h2>
              <p>
                Nexus Operations defines three urgency tiers with specific SLA commitments for each:
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="bg-secondary/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Tier</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Assignment SLA</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">On-site SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    <tr><td className="px-4 py-3 font-medium text-foreground">Routine</td><td className="px-4 py-3 text-muted-foreground">Within 24 hours</td><td className="px-4 py-3 text-muted-foreground">3–5 business days</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-foreground">Urgent</td><td className="px-4 py-3 text-muted-foreground">Within 4 hours</td><td className="px-4 py-3 text-muted-foreground">Next business day</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-foreground">Emergency</td><td className="px-4 py-3 text-muted-foreground">Within 1 hour</td><td className="px-4 py-3 text-muted-foreground">Within 4 hours (24/7)</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                SLA adherence is tracked automatically on every job. Commercial clients receive a monthly report showing actual assignment times and on-site times versus the committed SLAs. This makes performance visible — not just understood.
              </p>
              <h2 className="text-xl font-semibold text-foreground">What to ask before signing a vendor agreement</h2>
              <p>
                When evaluating any maintenance coordinator or contractor relationship, the key questions are: What is the committed assignment time? What is the committed on-site time? How is emergency coverage handled after hours? How is SLA performance tracked and reported?
              </p>
              <p>
                If the answers are vague or entirely informal, that&apos;s useful information. It tells you that the relationship is built on availability and trust — which can work, but won&apos;t give you anything to hold the vendor to when the relationship is tested.
              </p>
            </div>
            <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">See the full SLA schedule</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">The commercial page includes the complete SLA table and how performance is tracked and reported for commercial clients.</p>
              <Link href="/commercial#sla" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                View SLA commitments <ArrowRight className="h-4 w-4" />
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
