import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/link'
import { ArrowRight, Camera, Calendar, MessageSquare, Eye, Zap, CreditCard, Building2, HardHat } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Property Maintenance Coordination in Topeka, KS',
  description:
    'Nexus Operations coordinates property repairs in Topeka and Shawnee County: request review, contractor matching, scheduling, job records, and invoicing. Labor and materials are billed separately.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section className="bg-sidebar min-h-[calc(100vh-64px)] flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: copy */}
              <div className="flex flex-col gap-7">
                <div>
                  <p className="mb-4 text-sm font-medium text-white/70">Topeka &amp; Shawnee County, Kansas</p>
                  <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl xl:text-7xl">
                    Property maintenance coordination.
                  </h1>
                </div>

                <p className="text-lg text-white/60 max-w-2xl">
                  Nexus Operations coordinates repairs and maintenance for homeowners, landlords,
                  and property managers. We review the issue, match it with a contractor, coordinate
                  scheduling, and track the work through completion and invoicing. Contractors
                  provide the trade work; Nexus manages the coordination and records.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/request"
                    className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90 transition-colors"
                  >
                    Submit a request <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contractors"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <HardHat className="h-4 w-4" /> I&apos;m a contractor
                  </Link>
                </div>

                <p className="text-sm text-white/70">
                  Homeowner Starter includes up to 3 requests per year with no subscription fee.
                  Contractor labor and materials are billed separately.
                </p>
              </div>

              {/* Right: image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg overflow-hidden rounded-2xl">
                  <Image
                    src="/photo-contractor.jpg"
                    alt="Illustration of a contractor wearing a hard hat and safety vest"
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOR HOMEOWNERS ────────────────────────────────────────── */}
        <section className="bg-background">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: image */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/minimalist-modern-office-workspace-aerial-view.jpg"
                    alt="Modern workspace representing homeowner experience"
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Right: copy + card */}
              <div className="flex flex-col gap-7">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                    For homeowners
                  </h2>
                  <p className="mt-3 text-base text-muted-foreground max-w-xl">
                    Submit the property address, a description of the issue, and any photos.
                    Nexus reviews the request, confirms the scope and access details, and coordinates
                    a contractor. A submitted budget is not a final quote; confirm the scope and
                    price before authorizing work.
                  </p>
                </div>

                {/* Feature card */}
                <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Homeowner Experience
                  </p>

                  <div className="flex flex-col gap-5">
                    {[
                      {
                        Icon: Camera,
                        title: 'Describe the work and budget',
                        desc: 'Add photos and a budget range for review',
                      },
                      {
                        Icon: Calendar,
                        title: 'Provide access and availability',
                        desc: 'Nexus coordinates the appointment with the contractor',
                      },
                      {
                        Icon: MessageSquare,
                        title: 'Track status in one place',
                        desc: 'Stay updated throughout the process',
                      },
                    ].map(({ Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sidebar text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{title}</p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="/request"
                    className="inline-flex items-center gap-2 rounded-full bg-sidebar px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                  >
                    Submit a request <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOR CONTRACTORS ───────────────────────────────────────── */}
        <section className="bg-background">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 lg:pb-28">
            {/* subtle divider */}
            <div className="h-px bg-black/8 mb-20 lg:mb-28" />
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: copy + card */}
              <div className="flex flex-col gap-7">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                    For contractors
                  </h2>
                  <p className="mt-3 text-base text-muted-foreground max-w-xl">
                    Contractors review available requests in their service categories and accept
                    work that fits their capacity. Nexus coordinates the request and customer
                    communication. Contractors confirm the scope and price, perform the work,
                    and submit progress notes, photos, and invoices.
                  </p>
                </div>

                {/* Feature card */}
                <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Contractor Experience
                  </p>

                  <div className="flex flex-col gap-5">
                    {[
                      {
                        Icon: Eye,
                        title: 'Review request details',
                        desc: 'See the issue, available photos, and budget context',
                      },
                      {
                        Icon: Zap,
                        title: 'Accept work in your trade',
                        desc: 'Assignments depend on eligibility and availability',
                      },
                      {
                        Icon: CreditCard,
                        title: 'Submit invoices and track payments',
                        desc: 'Keep job records and billing in your dashboard',
                      },
                    ].map(({ Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sidebar text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{title}</p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/contractors"
                    className="inline-flex items-center gap-2 rounded-full bg-sidebar px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                  >
                    Join the network <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-black/5 transition-colors"
                  >
                    View pricing ↗
                  </Link>
                </div>
              </div>

              {/* Right: image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="overflow-hidden rounded-2xl w-full max-w-lg">
                  <Image
                    src="/photo-contractor.jpg"
                    alt="Illustration of a contractor wearing a hard hat and safety vest"
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING ───────────────────────────────────────────────── */}
        <section className="bg-sidebar">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            {/* Heading */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                Coordination fees and repair costs
              </h2>
              <p className="mt-3 mx-auto max-w-2xl text-base text-white/70">
                Plans cover maintenance coordination and account features, not the repair itself.
                Labor and materials are charged separately. Contractor accounts have a separate
                fee structure, including commissions on completed jobs.
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {/* Homeowners */}
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    For Homeowners
                  </p>
                  <p className="mt-3 text-5xl font-extrabold text-white">$0</p>
                  <p className="mt-2 text-sm text-white/70">Starter subscription · up to 3 requests per year.</p>
                  <p className="mt-2 text-sm text-white/70">Labor and materials are billed separately.</p>
                </div>

                <ul className="flex flex-col gap-3">
                  {['Verified contractor match', 'Scheduling coordination', 'Status tracking'].map(
                    (feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-sm text-white/75">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white text-xs">✓</span>
                        {feat}
                      </li>
                    )
                  )}
                </ul>

                <div className="mt-auto">
                  <Link
                    href="/request"
                    className="inline-flex w-full items-center justify-center rounded-full bg-card px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90 transition-colors"
                  >
                    Get started →
                  </Link>
                </div>
              </div>

              {/* Contractors */}
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    For Contractors
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white">$0</span>
                    <span className="text-lg text-white/70">to join</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Starter: up to 3 active projects; 10–15% commission on completed jobs.</p>
                  <p className="mt-2 text-sm text-white/70">Paid plans offer higher project limits. See pricing for details.</p>
                </div>

                <ul className="flex flex-col gap-3">
                  {['Available project board', 'Request details before acceptance', 'Invoice and payment tracking'].map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-white/75">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white text-xs">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link
                    href="/contractors"
                    className="inline-flex w-full items-center justify-center rounded-full bg-card px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90 transition-colors"
                  >
                    Join the network →
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise note */}
            <div className="mt-10 flex items-center justify-center gap-3 text-center">
              <Building2 className="h-5 w-5 flex-shrink-0 text-white/70" />
              <p className="text-sm text-white/70">
                Enterprise property management?{' '}
                <Link href="/contact" className="underline underline-offset-2 hover:text-white/70 transition-colors">
                  Contact us
                </Link>{' '}
                for custom portfolio pricing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
