import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, HelpCircle, Mail, Phone } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section } from '@/components/section'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'FAQ — Nexus Operations',
  description:
    'Frequently asked questions about Nexus Operations — how to submit service requests, contractor verification, response commitments, pricing, and platform policies in Topeka, KS.',
  alternates: { canonical: 'https://nexusoperations.org/faq' },
  openGraph: {
    title: 'FAQ — Nexus Operations',
    description:
      'Everything you need to know about submitting requests, contractor verification, response commitments, and platform policies.',
    url: 'https://nexusoperations.org/faq',
    type: 'article',
  },
}

const sections = [
  {
    category: 'For homeowners & property owners',
    questions: [
      {
        q: 'How do I submit a service request?',
        a: 'Sign in to your dashboard, pick the trade category, upload a few photos, describe the issue, and choose an availability window. Our coordinator reads the request, confirms scope, and dispatches a license-verified contractor within the SLA window for the urgency tier you selected.',
      },
      {
        q: 'What information do I need to include with a request?',
        a: 'A short written description of the issue, 2–10 photos showing the scope, the property address, and at least one preferred visit window. Optional: a preferred budget ceiling, access notes (lockbox codes, pet warnings), and any contractor preferences.',
      },
      {
        q: 'Will multiple contractors contact me about my request?',
        a: 'No. Nexus is not a marketplace. One coordinator reviews your request and assigns it to one contractor. You will not receive cold calls, emails, or competing quotes from other tradespeople.',
      },
      {
        q: 'How fast will someone be on-site?',
        a: 'It depends on the urgency tier you selected. Routine: assigned within 24 hours, on-site in 3–5 business days. Urgent: assigned within 4 hours, on-site next business day. Emergency: assigned within 1 hour, on-site within 4 hours (24/7).',
      },
      {
        q: 'Am I obligated to accept the quote?',
        a: 'No. After the on-site visit, the contractor provides a written estimate. You can accept, negotiate scope, or decline with no cancellation fee. If you decline, the request closes out cleanly in your dashboard.',
      },
      {
        q: 'Can I cancel a request I already submitted?',
        a: 'Yes. You can cancel any open request before a contractor is on-site. Once a contractor has been dispatched and is en route, same-day cancellations may incur a trip fee from the contractor — we will always tell you in advance if that applies.',
      },
      {
        q: 'I manage several properties. Can one account cover all of them?',
        a: `Yes. Property manager accounts support unlimited property addresses under a single login with per-property request history. For portfolios of 10+ units, consider our dedicated commercial engagement — contact ${CONTACT_INFO.email} to get started.`,
      },
    ],
  },
  {
    category: 'For contractors',
    questions: [
      {
        q: 'What does it cost to join the contractor network?',
        a: 'Nothing. Starter contractor accounts are free, forever. Pro and Elite tiers are optional upgrades that unlock additional capacity and priority routing, but they are not required to receive work.',
      },
      {
        q: 'What is required to join?',
        a: 'A valid Kansas business license, applicable trade licenses for your service categories, current general liability insurance (minimum $500K per occurrence), workers compensation (if you have employees), and two references or prior client endorsements.',
      },
      {
        q: 'How are contractors verified?',
        a: 'Every applicant goes through a three-part verification. We cross-check license numbers against Kansas state records, confirm insurance certificates directly with the issuing carrier (not just the document), and contact references. Verification typically takes 3–5 business days, and credentials are re-verified annually.',
      },
      {
        q: 'How fast do I get paid?',
        a: 'Nexus pays contractors directly after each completed job on the schedule configured in your payout settings. We never hold funds or take a percentage of your quoted rate — you get exactly what you quoted.',
        q: "Is there a cost to join the Nexus contractor network?",
        a: "Joining the contractor network is free. Nexus Operations does not charge contractors subscription fees or lead fees. Contractors receive their full quoted rate on every job. Nexus Operations collects payment from the client and pays contractors directly within 30 days of job completion.",
      },
      {
        q: 'Do I have to accept every job that routes to me?',
        a: 'No. You can decline any assignment for any reason. Consistently meeting SLA on accepted jobs is how contractors earn priority placement on higher-value work over time.',
      },
      {
        q: 'Can I set my own rates and service area?',
        a: 'Yes. You quote every job at your own rate, and your profile includes a service radius in miles from your registered address plus active trade categories. You will only receive work that matches both filters.',
      },
    ],
  },
  {
    category: 'Platform & policies',
    questions: [
      {
        q: 'Is Nexus Operations available outside Topeka?',
        a: 'Not yet. We currently serve Topeka and the surrounding Shawnee County area exclusively. Expansion to additional Kansas markets will be announced here first.',
      },
      {
        q: 'How does pricing work?',
        a: 'Homeowners and commercial clients subscribe to a plan that includes coordination, documentation, and unified invoicing. Contractor work is billed at the contractor\'s quoted rate and rolled into a monthly unified invoice. See the pricing page for current plans and features.',
      },
      {
        q: 'What happens to photos and project data I submit?',
        a: 'Project photos and details are used solely for matching you with a contractor and documenting the job in your account. Your data is never sold, shared with advertising networks, or distributed to third parties. See the privacy policy for full data handling details.',
      },
      {
        q: 'How do I reach someone after hours for an emergency?',
        a: `General support runs ${CONTACT_INFO.businessHours} at ${CONTACT_INFO.phoneDisplay} or ${CONTACT_INFO.email}. For after-hours emergencies — burst pipes, gas leaks, HVAC failure in extreme weather — email emergency@nexusoperations.org. An on-call coordinator responds within 15 minutes around the clock, including nights, weekends, and holidays.`,
      },
      {
        q: 'What if I have a complaint about a contractor or a job?',
        a: `Email ${CONTACT_INFO.email} with the request ID and a description of the issue. A Nexus coordinator will investigate, contact the contractor, and work toward a resolution. If a job falls short of our standards, we will make it right.`,
      },
    ],
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sections.flatMap((section) =>
    section.questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  ),
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <HelpCircle className="h-3 w-3" /> FAQ
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Everything you wanted to ask.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              How to submit requests, how contractors get verified, pricing, response commitments,
              and the platform policies that govern every job.
            </p>
          </div>
        </section>

        {/* ── FAQ sections ───────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-4xl space-y-14">
            {sections.map((section) => (
              <div key={section.category}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  {section.category}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {section.category === 'For homeowners & property owners'
                    ? 'Submitting, tracking, and closing out requests.'
                    : section.category === 'For contractors'
                      ? 'Joining the network, quoting work, and getting paid.'
                      : 'Verification, data handling, and the rules of the road.'}
                </h2>

                <div className="mt-6 flex flex-col gap-3">
                  {section.questions.map(({ q, a }) => (
                    <details
                      key={q}
                      className="group rounded-2xl border border-border bg-card p-5 open:border-primary/40"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14.5px] font-semibold text-foreground">
                        {q}
                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                        {a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Still have questions ───────────────────────── */}
        <Section tone="muted">
          <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-background p-8 text-center sm:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Still have questions?
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Talk to a real coordinator.
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Reach out directly and a member of the Nexus team will get back to you within one
              business day — sooner for anything urgent.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition"
              >
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
              >
                <Mail className="h-4 w-4" /> {CONTACT_INFO.email}
              </a>
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
              >
                <Phone className="h-4 w-4" /> {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
