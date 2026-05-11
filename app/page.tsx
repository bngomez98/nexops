import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/link'
import { ArrowRight, Camera, Calendar, MessageSquare, Eye, Zap, CreditCard, Building2, HardHat } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Nexus Operations — Home Services, Coordinated.',
  description:
    'One request. One verified contractor. No runaround. Free for homeowners. Licensed & insured contractors only.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section className="bg-[#111111] min-h-[calc(100vh-64px)] flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: copy */}
              <div className="flex flex-col gap-7">
                <div>
                  <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl xl:text-7xl">
                    Home services,{' '}
                    <br className="hidden sm:block" />
                    coordinated.
                  </h1>
                  <h2 className="mt-2 text-5xl font-extrabold leading-tight tracking-tight text-white/40 lg:text-6xl xl:text-7xl">
                    Not complicated.
                  </h2>
                </div>

                <p className="text-lg text-white/60 max-w-md">
                  One request. One verified contractor. No runaround.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
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

                <p className="text-xs text-white/35 tracking-wide">
                  Free for homeowners. Licensed &amp; insured contractors only.
                </p>
              </div>

              {/* Right: image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg overflow-hidden rounded-2xl">
                  <Image
                    src="/photo-contractor.jpg"
                    alt="Contractor reviewing plans at a construction site"
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
        <section className="bg-[#f0eeeb]">
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
                  <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] lg:text-5xl">
                    For homeowners
                  </h2>
                  <p className="mt-3 text-base text-[#111111]/60 max-w-md">
                    Submit once. Get matched with one verified contractor. No phone tag, no surprise visits.
                  </p>
                </div>

                {/* Feature card */}
                <div className="rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    Homeowner Experience
                  </p>

                  <div className="flex flex-col gap-5">
                    {[
                      {
                        Icon: Camera,
                        title: 'Upload photos & set a budget cap',
                        desc: 'Show contractors exactly what you need',
                      },
                      {
                        Icon: Calendar,
                        title: 'Pick consultation windows',
                        desc: 'Choose times that work for your schedule',
                      },
                      {
                        Icon: MessageSquare,
                        title: 'Track status in one place',
                        desc: 'Stay updated throughout the process',
                      },
                    ].map(({ Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{title}</p>
                          <p className="text-sm text-[#111111]/55">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                  >
                    Submit a request <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOR CONTRACTORS ───────────────────────────────────────── */}
        <section className="bg-[#f0eeeb]">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 lg:pb-28">
            {/* subtle divider */}
            <div className="h-px bg-black/8 mb-20 lg:mb-28" />
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: copy + card */}
              <div className="flex flex-col gap-7">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] lg:text-5xl">
                    For contractors
                  </h2>
                  <p className="mt-3 text-base text-[#111111]/60 max-w-md">
                    Stop paying for shared leads. Claim exclusive, pre-qualified requests and show up with everything you need.
                  </p>
                </div>

                {/* Feature card */}
                <div className="rounded-2xl bg-white/60 border border-black/5 p-6 shadow-sm">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    Contractor Experience
                  </p>

                  <div className="flex flex-col gap-5">
                    {[
                      {
                        Icon: Eye,
                        title: 'See everything before claiming',
                        desc: 'Photos, budget, and scope upfront',
                      },
                      {
                        Icon: Zap,
                        title: 'First-come, first-served',
                        desc: 'No bidding wars, no competing quotes',
                      },
                      {
                        Icon: CreditCard,
                        title: 'Get paid faster',
                        desc: 'Unified invoicing and quick payouts',
                      },
                    ].map(({ Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{title}</p>
                          <p className="text-sm text-[#111111]/55">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/contractors"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                  >
                    Join the network <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/25 px-6 py-3 text-sm font-semibold text-[#111111] hover:bg-black/5 transition-colors"
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
                    alt="Contractor in hard hat using tablet at construction site"
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
        <section className="bg-[#111111]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            {/* Heading */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                Simple pricing
              </h2>
              <p className="mt-3 text-base text-white/50">
                No per-lead fees. No long-term contracts.
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {/* Homeowners */}
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    For Homeowners
                  </p>
                  <p className="mt-3 text-5xl font-extrabold text-white">Free</p>
                  <p className="mt-2 text-sm text-white/50">Submit requests at no cost.</p>
                </div>

                <ul className="flex flex-col gap-3">
                  {['Verified contractor match', 'Pre-scheduled consultation', 'Status tracking'].map(
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
                    href="/"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
                  >
                    Get started →
                  </Link>
                </div>
              </div>

              {/* Contractors */}
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    For Contractors
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white">$199</span>
                    <span className="text-lg text-white/50">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-white/50">Claim unlimited leads in your categories.</p>
                </div>

                <ul className="flex flex-col gap-3">
                  {['Exclusive leads', 'Pre-qualified details', 'Fast payout'].map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-white/75">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white text-xs">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link
                    href="/contractors"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
                  >
                    Join the network →
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise note */}
            <div className="mt-10 flex items-center justify-center gap-3 text-center">
              <Building2 className="h-5 w-5 flex-shrink-0 text-white/40" />
              <p className="text-sm text-white/40">
                Enterprise property management?{' '}
                <Link href="/contact" className="underline underline-offset-2 hover:text-white/70 transition-colors">
                  Contact us
                </Link>{' '}
                for custom coordination pricing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
