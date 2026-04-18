import type { Metadata } from 'next'
import Link from '@/components/link'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  ClipboardList,
  Compass,
  FileText,
  HeartHandshake,
  Landmark,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'About — Managed Property Maintenance Built in Topeka',
  description:
    'Nexus Operations is a locally owned managed property maintenance company founded in Topeka, Kansas. Learn about our team, our process, and our commitment to verified, documented service.',
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Integrity first',
    desc: 'We only work with licensed, insured contractors we would hire for our own homes. Every quote is reviewed, every job is documented.',
  },
  {
    icon: Target,
    title: 'Response you can count on',
    desc: 'We commit to assignment and on-site timelines by urgency tier. If we miss a commitment, we own it.',
  },
  {
    icon: HeartHandshake,
    title: 'Locally owned',
    desc: 'We live in Topeka. Our team knows the neighborhoods, the building stock, and the trades community.',
  },
  {
    icon: FileText,
    title: 'Documentation by default',
    desc: 'Photos, scope notes, and invoices are attached to every request so you have full records for insurance, owners, and resale.',
  },
]

const commitments = [
  {
    icon: Users,
    badgeClassName: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
    title: 'Homeowners control their projects',
    desc:
      'Homeowners define the project scope, maximum budget, and available consultation windows before any contractor is notified. The terms are established before the match is made.',
  },
  {
    icon: ShieldCheck,
    badgeClassName: 'bg-amber-500/12 text-amber-400 border-amber-500/25',
    title: 'Contractors own their projects',
    desc:
      "Claim a project and it's yours alone. No bidding wars, no competing for the same job.",
  },
  {
    icon: ClipboardList,
    badgeClassName: 'bg-violet-500/12 text-violet-400 border-violet-500/25',
    title: 'Both sides come prepared',
    desc:
      'Every project includes photos, scope, and budget before matching. Consultations are productive from minute one.',
  },
  {
    icon: BadgeCheck,
    badgeClassName: 'bg-teal-500/12 text-teal-400 border-teal-500/25',
    title: 'Quality matters',
    desc:
      'Every contractor in the network is license-verified, insurance-confirmed, and background-checked before gaining access to project requests. Performance ratings reflect actual project outcomes — not self-reported reviews.',
  },
]

const milestones = [
  { year: '2026', title: 'Nexus Operations founded', desc: 'Launched in Topeka, KS to give homeowners and property managers a single, accountable service for property maintenance.' },
  { year: '2026', title: 'Verified contractor network', desc: 'Built a starting roster of 20+ license-verified trades across plumbing, electrical, HVAC, and general repair.' },
  { year: '2026', title: 'Unified billing launched', desc: 'Rolled out monthly consolidated invoices so owners stop juggling contractor-by-contractor billing.' },
  { year: '2026', title: 'Commercial portfolio tier', desc: 'Introduced dedicated service tiers for property managers with 10+ units under management.' },
]

const services = [
  { icon: ClipboardList, title: 'Intake & scope review', desc: 'We read every request, clarify scope, and confirm access details before dispatch.' },
  { icon: Users, title: 'Contractor matching', desc: 'We match each job to a trade specialist based on fit, availability, and recent performance.' },
  { icon: Compass, title: 'Active oversight', desc: 'We manage scheduling, updates, and change orders directly with the contractor on your behalf.' },
  { icon: Landmark, title: 'Unified invoicing', desc: 'We consolidate every job into one monthly invoice with photo records attached.' },
]

const switchReasons = [
  {
    title: 'From search-heavy to service-led',
    description:
      'Instead of browsing listings and comparing callbacks, Nexus gives you one team that owns coordination from first request to closeout.',
  },
  {
    title: 'From contractor-by-contractor billing to one invoice',
    description:
      'You stop collecting separate invoices and status threads; monthly billing and records are unified in one place.',
  },
  {
    title: 'From uncertain follow-through to documented accountability',
    description:
      'Every request is tracked with timeline updates, required photos, and a written summary before it can be marked complete.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="border-b border-border relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 home-service-bg" />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-12 lg:items-center lg:py-28">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <MapPin className="h-3 w-3" /> {CONTACT_INFO.cityState}
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                We built Nexus Operations so property owners have a single, accountable service for maintenance.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                Most property owners in Topeka juggle a patchwork of contractors, handwritten
                invoices, and missed callbacks. We founded Nexus Operations to be the single,
                accountable partner that handles the work end-to-end — intake, dispatch,
                documentation, and billing — so owners can focus on running their properties, not
                chasing tradespeople.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                >
                  Talk to our team <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
                >
                  What we do
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-accent p-6 shadow-xl card-elevated">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary contractor-accent pb-4">
                  What accountability looks like
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    'A real person reviews every request before dispatch.',
                    'Assignment and arrival timelines are measured against published SLAs.',
                    'Completion photos and notes are required before closeout.',
                    'Every job lands in one auditable monthly invoice.',
                  ].map((line) => (
                    <div
                      key={line}
                      className="rounded-xl border border-primary/10 bg-gradient-to-r from-background to-accent/30 px-4 py-3 text-sm text-foreground shadow-sm"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission ───────────────────────────────────────── */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Our mission"
                title="Be the maintenance partner you'd rehire on purpose."
                description="We measure ourselves against the bar that most property owners secretly hope exists: a team that picks up the phone, follows through, and leaves a clean paper trail."
              />
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
                <p className="text-[14.5px] leading-relaxed text-foreground">
                  Property maintenance fails most often in the hand-offs — between the owner and the
                  contractor, between one trade and another, between the job being &quot;done&quot; and the
                  invoice being paid. Every hand-off is a chance for details to get lost.
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-foreground">
                  Nexus Operations exists to own every one of those hand-offs. We review each
                  request, assign the right contractor, track the work in real time, and close the
                  loop with photo documentation and a unified invoice. Nothing important gets
                  dropped, and nothing happens without a record.
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-foreground">
                  Founded in Topeka, Kansas in 2026, we&apos;re locally owned and operated. Our
                  team lives in the community we serve.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Values ────────────────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Our values"
            title="Four principles we run the business on."
            align="center"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[15px] font-bold text-foreground">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── What we do ────────────────────────────────────── */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="What we do"
                title="Four things, done well — on every request."
                description="We do not sell software. We do not run a contractor marketplace. We manage property maintenance — intake, dispatch, documentation, and billing."
              />
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:gap-2 transition-all"
              >
                Full services list <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {services.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Marketplace comparison */}
        <section className="py-16 lg:py-24 border-t border-border">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Why Nexus is different
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Built as an upgrade from Angi-style directory experiences.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Directory apps hand you contacts; then you still manage the work. Nexus Operations
                was built to own the coordination and outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {switchReasons.map(({ title, description }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Walkthrough */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                How it works
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                From request to resolved: a real example.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A property manager overseeing 120 units submits an emergency request at 11:14 PM on a Saturday.
                Here is exactly what happens next.
              </p>
            </div>

            <div className="relative">
              {/* Timeline connector line */}
              <div className="absolute left-[19px] top-8 bottom-8 w-px bg-border hidden sm:block" aria-hidden="true" />

              <div className="flex flex-col gap-0">
                {[
                  {
                    time: "11:14 PM Saturday",
                    label: "Request submitted",
                    color: "bg-foreground",
                    detail: "Property manager logs into the portal and submits: burst pipe in Unit 14B, water actively running, tenant present. Uploads 4 photos. Selects Emergency tier.",
                    outcome: null,
                  },
                  {
                    time: "11:14 PM",
                    label: "Automated triage",
                    color: "bg-primary",
                    detail: "System classifies as Emergency — Plumbing. SLA clock starts: contractor must be assigned within 1 hour, on-site within 4 hours.",
                    outcome: null,
                  },
                  {
                    time: "11:27 PM",
                    label: "Contractor assigned",
                    color: "bg-primary",
                    detail: "On-call plumber from the verified network accepts the assignment. Property manager receives confirmation with contractor name, license number, and ETA. Tenant is notified.",
                    outcome: "13 minutes to assignment. SLA: 60 minutes.",
                  },
                  {
                    time: "12:51 AM Sunday",
                    label: "On-site arrival",
                    color: "bg-primary",
                    detail: "Contractor arrives at Unit 14B, locates the failed supply line under the kitchen sink, shuts off water to the unit. Submits arrival photo through the portal.",
                    outcome: "97 minutes from submission. SLA: 4 hours.",
                  },
                  {
                    time: "2:18 AM",
                    label: "Work completed",
                    color: "bg-primary",
                    detail: "Supply line replaced, water restored to unit. Contractor submits 6 completion photos and a written summary noting secondary water intrusion in the cabinet below.",
                    outcome: null,
                  },
                  {
                    time: "Monday AM",
                    label: "Invoice issued",
                    color: "bg-secondary border-2 border-border",
                    detail: "Nexus Operations generates a unified invoice: $280 total. Invoice delivered to the property manager's portal with full photo documentation attached.",
                    outcome: "One invoice. Full documentation. Zero back-and-forth.",
                  },
                  {
                    time: "Within 30 days",
                    label: "Contractor paid",
                    color: "bg-green-500",
                    detail: "Once the property manager pays the invoice, Nexus Operations pays the plumber directly at the full quoted rate of $280. No collection lag, no disputed invoices.",
                    outcome: null,
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 sm:gap-8 pb-8 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center z-10 ${step.color}`} />
                    </div>
                    <div className="flex-1 pt-1.5 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{step.time}</span>
                        <h3 className="text-sm font-semibold text-foreground">{step.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        {step.detail}
                      </p>
                      {step.outcome && (
                        <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-primary bg-primary/8 rounded-full px-3 py-1">
                          <CheckCircle className="h-3 w-3" />
                          {step.outcome}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Commitments ───────────────────────────────────── */}
        <Section tone="dark">
          <SectionHeading
            eyebrow="Our core commitments"
            title="A more structured experience for both sides of every project."
            description="We designed Nexus Operations to feel personal for homeowners and practical for contractors — with clear expectations before anyone is matched."
            align="center"
            onDark
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {commitments.map(({ icon: Icon, title, desc, badgeClassName }) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/8 bg-black/20 px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:px-7"
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${badgeClassName}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-white">{title}</h3>
                <p className="mt-4 max-w-2xl text-[15px] leading-8 text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Timeline ──────────────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Company milestones"
            title="A short history of a young company."
            align="center"
          />
          <div className="mx-auto mt-14 max-w-4xl">
            <ol className="relative border-l border-border pl-8">
              {milestones.map(({ year, title, desc }, i) => (
                <li key={i} className="relative mb-10 last:mb-0">
                  <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                    {year}
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-foreground">{title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ── Service area ──────────────────────────────────── */}
        <Section>
          <div className="grid gap-10 rounded-3xl border border-border bg-card p-8 sm:p-12 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                Service area
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {CONTACT_INFO.serviceArea}.
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Nexus Operations and our contractor network serve every neighborhood in Topeka and
                surrounding Shawnee County communities. If you&apos;re unsure whether we cover your
                address, call us directly and we&apos;ll confirm on the spot.
              </p>
              <p className="mt-4 flex items-center gap-2 text-[13.5px] font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" /> {CONTACT_INFO.addressLine1},{' '}
                {CONTACT_INFO.cityStateZip}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Contact us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-[13px] font-semibold text-foreground hover:border-primary/40 transition"
              >
                {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
