import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AirVent,
  ArrowRight,
  Brush,
  ClipboardList,
  Droplets,
  FileText,
  Hammer,
  Layers,
  ShieldCheck,
  Sparkles,
  TreeDeciduous,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'Services — Trade Categories by Nexus Operations',
  description:
    'Nexus Operations coordinates plumbing, electrical, HVAC, general repair, turnover, landscaping, and preventative maintenance for Topeka and Shawnee County property owners. Licensed, insured contractors on every job.',
}

const tradeCategories = [
  {
    icon: Droplets,
    title: 'Plumbing',
    desc: 'Leaks, burst supply lines, fixture replacement, water heater install, drain and sewer issues, garbage disposals, toilets, and shutoffs.',
    examples: ['Leaking faucets & fixtures', 'Water heater replacement', 'Drain clearing', 'Burst pipe repair', 'Toilet & shutoff replacement'],
  },
  {
    icon: Zap,
    title: 'Electrical',
    desc: 'Outlets, switches, panels, breakers, light fixtures, GFCI installation, ceiling fans, and general troubleshooting by licensed electricians.',
    examples: ['Outlet & switch replacement', 'Light fixture install', 'Panel & breaker work', 'GFCI / AFCI upgrades', 'Ceiling fan install'],
  },
  {
    icon: AirVent,
    title: 'HVAC',
    desc: 'Furnace and A/C diagnostics, repair, and replacement. Seasonal tune-ups, filter service, and emergency response during temperature extremes.',
    examples: ['Furnace repair', 'A/C diagnostics & repair', 'Seasonal tune-ups', 'Thermostat install', 'Filter & duct service'],
  },
  {
    icon: Hammer,
    title: 'General repair & carpentry',
    desc: 'Drywall, trim, doors, locks, windows, cabinetry, flooring repair, and the small jobs that keep a property running day-to-day.',
    examples: ['Drywall patching', 'Door & lock service', 'Trim & baseboard', 'Flooring repair', 'Cabinet & hardware fixes'],
  },
  {
    icon: Brush,
    title: 'Paint & finishes',
    desc: 'Interior and exterior touch-up, full-room repaints, and turnover cosmetic refresh between tenants.',
    examples: ['Touch-up painting', 'Full-room repaint', 'Exterior trim paint', 'Turnover refresh'],
  },
  {
    icon: ClipboardList,
    title: 'Turnover & make-ready',
    desc: 'Full punch-list management between tenants — cleaning, paint, minor repair, and documentation so you can list the unit faster.',
    examples: ['Move-out walk-through', 'Deep clean', 'Paint & patch', 'Punch-list repair', 'Photo documentation for listing'],
  },
  {
    icon: Wind,
    title: 'Roofing & exterior',
    desc: 'Leak investigation, shingle repair, flashing, gutter cleaning, and exterior trim work through licensed roofing partners.',
    examples: ['Leak investigation', 'Shingle repair', 'Flashing & sealing', 'Gutter cleaning', 'Soffit & fascia repair'],
  },
  {
    icon: TreeDeciduous,
    title: 'Landscaping & exterior maintenance',
    desc: 'Seasonal yard cleanups, tree trimming, mulching, and snow removal contracts during winter months.',
    examples: ['Spring & fall cleanup', 'Mowing contracts', 'Tree trimming', 'Mulch install', 'Snow removal'],
  },
  {
    icon: Layers,
    title: 'Appliances',
    desc: 'Diagnosis and repair of built-in and freestanding appliances, with replacement sourcing when repair is not cost-effective.',
    examples: ['Refrigerator service', 'Washer/dryer repair', 'Dishwasher install', 'Range & oven repair'],
  },
  {
    icon: ShieldCheck,
    title: 'Preventative & seasonal',
    desc: 'Scheduled inspections, filter changes, gutter cleaning, HVAC tune-ups, and other recurring maintenance to catch issues early.',
    examples: ['Quarterly inspections', 'Filter swap service', 'Pre-winter HVAC tune-up', 'Smoke detector audit'],
  },
]

const urgencyTiers = [
  {
    label: 'Routine',
    time: 'Assigned within 24 hours',
    onSite: 'On-site in 3–5 business days',
    detail: 'Scheduled maintenance, cosmetic repair, planned replacements. Most Nexus work falls here.',
  },
  {
    label: 'Urgent',
    time: 'Assigned within 4 hours',
    onSite: 'On-site next business day',
    detail: 'Non-emergency issues that need prompt attention — failing appliances, minor leaks, non-critical HVAC.',
  },
  {
    label: 'Emergency',
    time: 'Assigned within 1 hour',
    onSite: 'On-site within 4 hours',
    detail: 'Critical failures — burst pipes, gas leaks, no heat in winter, no A/C in extreme heat, safety hazards.',
  },
]

const process = [
  { step: '01', title: 'Submit', desc: 'Fill out a three-minute request with the issue, photos, property address, and urgency.' },
  { step: '02', title: 'Review', desc: 'A Nexus team member reads the request, confirms scope, and selects the best-fit contractor.' },
  { step: '03', title: 'Dispatch', desc: 'We notify the contractor, confirm access, and update you when the job is scheduled.' },
  { step: '04', title: 'Document', desc: 'Arrival photos, completion photos, and a written summary land in your dashboard.' },
  { step: '05', title: 'Invoice', desc: 'The job rolls into your monthly unified invoice with line-item transparency.' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3 w-3" /> Services
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Every trade you need. One service.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Nexus Operations manages every trade a typical property requires — routine,
              urgent, or emergency. Here&apos;s everything we handle, plus how we route each request
              through our licensed, insured network.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Submit a request <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trade categories ────────────────────────────── */}
        <Section>
          <SectionHeading
            eyebrow="Trade categories"
            title="What we coordinate."
            description="Every category below is handled by licensed, insured contractors in our network. If your issue doesn&apos;t fit a category, submit a request anyway — our team will route it."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tradeCategories.map(({ icon: Icon, title, desc, examples }) => (
              <div
                key={title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[17px] font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
                <ul className="mt-4 flex flex-1 flex-col gap-1.5 border-t border-border pt-4 text-[12.5px] text-muted-foreground">
                  {examples.map((e) => (
                    <li key={e} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Urgency tiers ───────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Urgency tiers"
            title="Response commitments by urgency."
            description="Every request is tagged at submission. We commit to assignment and on-site timelines based on the tier."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {urgencyTiers.map(({ label, time, onSite, detail }) => (
              <div
                key={label}
                className="flex flex-col rounded-2xl border border-border bg-background p-7"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  {label}
                </p>
                <p className="mt-3 text-[14px] font-semibold text-foreground">{time}</p>
                <p className="text-[13px] text-muted-foreground">{onSite}</p>
                <p className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-muted-foreground">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Process ─────────────────────────────────────── */}
        <Section>
          <SectionHeading
            eyebrow="Process"
            title="Every request follows the same documented workflow."
            align="center"
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {process.map(({ step, title, desc }) => (
              <div
                key={step}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Step {step}
                </span>
                <p className="mt-3 text-[16px] font-bold text-foreground">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── What's included ─────────────────────────────── */}
        <Section tone="muted">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="What every job includes"
                title="Oversight is built into every job — not sold as an add-on."
                description="You don&apos;t pay per task or per photo or per note. Every Nexus request gets the full treatment."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {[
                { icon: ClipboardList, title: 'Human review', desc: 'Every request read by a Nexus team member before dispatch.' },
                { icon: Wrench, title: 'Verified contractor', desc: 'Matched to a trade specialist with confirmed license and insurance.' },
                { icon: FileText, title: 'Photo documentation', desc: 'Arrival and completion photos attached to every job.' },
                { icon: ShieldCheck, title: 'Unified invoice', desc: 'Consolidated into your monthly billing with line-item detail.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-5"
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

        {/* ── CTA ─────────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Have a job that doesn&apos;t fit a category?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] text-primary-foreground/80">
              Submit it anyway. Our team routes every request, including ones that don&apos;t fit a listed category.
              Serving {CONTACT_INFO.serviceArea}.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary shadow-lg hover:opacity-95 transition"
              >
                Submit a request <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/10 transition"
              >
                Call {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
