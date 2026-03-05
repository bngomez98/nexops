import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  TreePine,
  Zap,
  Thermometer,
  Hammer,
  Fence,
  Home,
  ArrowRight,
  BadgeCheck,
  Users,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={160}
              height={53}
              style={{ height: "40px", width: "auto" }}
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="text-sm text-muted-foreground transition hover:text-foreground">
              How It Works
            </a>
            <a href="#services" className="text-sm text-muted-foreground transition hover:text-foreground">
              Services
            </a>
            <a href="#why-nexus" className="text-sm text-muted-foreground transition hover:text-foreground">
              Why Nexus
            </a>
            <a href="#contractors" className="text-sm text-muted-foreground transition hover:text-foreground">
              For Contractors
            </a>
            <a
              href="https://nexusoperations.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Help Center
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">Now serving Topeka, KS and surrounding areas</p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              One contractor.
              <br />
              <span className="text-primary">Exclusively yours.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Submit your project once with photos, scope, and budget. A single verified contractor claims it exclusively before your phone rings. No bidding wars. No competing contractors. Free for property owners.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Join as Contractor
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">$0</div>
              <div className="mt-1 text-xs text-muted-foreground">Cost to homeowners</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">1</div>
              <div className="mt-1 text-xs text-muted-foreground">Contractor per job</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">24hr</div>
              <div className="mt-1 text-xs text-muted-foreground">Consultation confirmed</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="mt-1 text-xs text-muted-foreground">Verified contractors</div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>Licensed, insured, and verified contractors</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Your project is never sold or shared</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
            <p className="mt-2 text-muted-foreground">From submission to consultation in under 24 hours</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                01
              </div>
              <h3 className="mt-4 font-semibold">Submit your project</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload 2–10 project photos, document the scope of work, set a budget cap, and select consultation windows.
              </p>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                02
              </div>
              <h3 className="mt-4 font-semibold">A contractor claims it</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Verified contractors in your area are notified. The first to claim your request secures it exclusively—removed from all others immediately.
              </p>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                03
              </div>
              <h3 className="mt-4 font-semibold">Consultation confirmed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Both you and the contractor receive a confirmed appointment. They review your photos and scope in advance.
              </p>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                04
              </div>
              <h3 className="mt-4 font-semibold">Project moves forward</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Receive a written, itemized estimate. Accept, negotiate, or decline—with no obligation.
              </p>
import Link from 'next/link'
import Image from 'next/image'
import { HeroTypewriter } from '@/components/hero-typewriter'
import { ProjectCard } from '@/components/project-card'

const services = [
  { name: 'Tree Removal', icon: '🌲' },
  { name: 'Concrete Work', icon: '🧱' },
  { name: 'Roofing', icon: '🏠' },
  { name: 'HVAC', icon: '❄️' },
  { name: 'Fencing', icon: '🔩' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Excavation', icon: '🚜' },
]

const steps = [
  {
    step: '01',
    title: 'Submit Your Project',
    body: 'Describe your project with photos, a written scope, and a real budget ceiling. No bids, no guesswork.',
  },
  {
    step: '02',
    title: 'One Contractor Claims It',
    body: 'A single licensed, insured contractor claims your project exclusively. Once claimed, it disappears from all other feeds.',
  },
  {
    step: '03',
    title: 'Work Gets Done',
    body: 'Direct communication from day one. They arrive at your consultation already knowing the full scope.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[6px] flex items-center justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nexus%20official%20logo%20small-Isfi4ffPq4jpg0F0ALxirkL1wVWk3u.png"
                alt="Nexus Operations"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <div className="leading-[1.1]">
              <p className="text-[13px] font-bold text-[var(--color-foreground)] tracking-wide">Nexus</p>
              <p className="text-[9px] font-semibold text-[var(--color-subtle)] tracking-[0.18em] uppercase">Operations</p>
            </div>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            <Link href="#how-it-works" className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">How It Works</Link>
            <Link href="#services"     className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">Services</Link>
            <Link href="#contractors"  className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">For Contractors</Link>
            <Link href="#property-managers" className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">For Property Managers</Link>
            <Link href="#contact"      className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">Contact</Link>
          </nav>

          {/* Right auth */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link href="#" className="flex items-center gap-1.5 text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Log In
            </Link>
            <button className="h-8 px-4 text-[13px] font-semibold bg-[var(--color-primary)] text-black rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-5 sm:px-8 pt-14 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 border border-[var(--color-border)] rounded-full px-3.5 py-1 mb-10">
            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-xs text-[var(--color-subtle)]">Now serving Topeka, KS — one project, one professional</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-14">

            {/* Left copy */}
            <div className="flex-1 max-w-[560px]">
              <h1 className="font-black tracking-tight leading-[1.04] mb-7" style={{ fontSize: 'clamp(2.6rem, 5vw, 3.75rem)' }}>
                <span className="text-[var(--color-foreground)]">One <HeroTypewriter /></span>
                <br />
                <span className="text-[var(--color-foreground)]">solution.</span>
                <br />
                <span className="text-[var(--color-primary)]">We work for you.</span>
                <br />
                <span className="text-[var(--color-subtle)]">{"That's the whole"}</span>
                <br />
                <span className="text-[var(--color-subtle)]">point.</span>
              </h1>

              <p className="text-base text-[var(--color-subtle)] leading-relaxed mb-8 max-w-md text-pretty">
                Nexus Operations connects you directly with a  licensed, insured contractor and does this while allowing you to have full control. It takes 5 minutes of your time to make a request a reality, and we handle the rest. On your terms oly.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-5 mb-10">
                <button className="flex items-center gap-2 h-11 px-6 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
                  Start Your Project — Free
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <Link href="#contractors" className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
                  {"I'm a contractor"}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Trust row */}
              <ul className="flex flex-col gap-2.5">
                {[
                  { Icon: LockIcon,    text: 'Your project is never sold or shared with a list' },
                  { Icon: ShieldIcon,  text: 'Every contractor is licensed, insured, and verified' },
                  { Icon: BoltIcon,    text: 'Consultation confirmed within 24 hours — on your schedule' },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[13px] text-[var(--color-subtle)]">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right card */}
            <div className="flex-shrink-0 flex justify-center lg:justify-end lg:pt-4">
              <ProjectCard />
            </div>

          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Service categories</h2>
            <p className="mt-2 text-muted-foreground">
              Every request requires project several photos, or a video, specifications, scope, and budget before submission. This allows us to provide you with specialized results, from a skilled trade specialist just for you.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TreePine,
                title: "Tree Removal",
                description: "Licensed removal, crown reduction, stump grinding, and post-storm assessment. ISA-certified arborists.",
                range: "$500 – $8,000",
              },
              {
                icon: Thermometer,
                title: "HVAC",
                description: "Central air, heat pumps, ductless mini-splits, furnace replacement, and maintenance agreements.",
                range: "$3,000 – $20,000",
              },
              {
                icon: Zap,
                title: "Electrical",
                description: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in.",
                range: "$500 – $10,000",
              },
              {
                icon: Home,
                title: "Roofing",
                description: "Full replacements, leak repairs, storm damage assessment, and insurance restoration.",
                range: "$5,000 – $25,000",
              },
              {
                icon: Hammer,
                title: "Concrete",
                description: "Driveways, patios, sidewalks, flatwork, and foundation repairs.",
                range: "$2,000 – $15,000",
              },
              {
                icon: Fence,
                title: "Fencing",
                description: "Privacy, chain link, vinyl, wood, and specialty fencing for residential and commercial.",
                range: "$1,500 – $10,000",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Live
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Typical range: <span className="font-medium text-foreground">{service.range}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t see your category?{" "}
              <a href="#start" className="text-primary hover:underline">
                Submit a request
              </a>{" "}
              — we prioritize expansion based on demand, tell us where we are needed, and what your trade is. We're open to all trades, and dedicated to meeting service demands across Kansas.
            </p>
          </div>
        </div>
      </section>

      {/* Why Nexus */}
      <section id="why-nexus" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Why Nexus Operations</h2>
            <p className="mt-2 text-muted-foreground">Built for outcomes, not volume</p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 text-left font-medium text-primary">Nexus Operations</th>
                  <th className="py-3 text-left font-medium text-muted-foreground">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 text-muted-foreground">Contractor assignment</td>
                  <td className="py-3 font-medium">One contractor per request</td>
                  <td className="py-3 text-muted-foreground">3–7 contractors competing</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Cost</td>
                  <td className="py-3 font-medium">No fees or outrageous margins, prices are set by contractors and property owners. For more on this, see our Help Center or FAQ.</td>
                  <td className="py-3 text-muted-foreground"></td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Budget transparency</td>
                  <td className="py-3 font-medium">Set your budget limit in your submission request. While we can't guarantee that your cap will meet the contractors' minimums, they are immediately aware of your preferences. This saves everyone time</td>
                  <td className="py-3 text-muted-foreground">Contractor guesses on-site</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Documentation</td>
                  <td className="py-3 font-medium">This is required so we can work our magic, with efficiency.</td>
                  <td className="py-3 text-muted-foreground">Optional, often absent</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Consultation scheduling</td>
                  <td className="py-3 font-medium">Pre-confirmed at submission, dates pre-set by you.</td>
                  <td className="py-3 text-muted-foreground"></td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Contractor Verification</td>
                  <td className="py-3 font-medium">Licensed, insured, background verified by us. Your trust and safety are of top priority. Reliability is also non-negotiable.</td>
                  <td className="py-3 text-muted-foreground">Self-reported, or non-existent.</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Ongoing Relationships</td>
                  <td className="py-3 font-medium">Our flexible platform can be your one-stop-shop, or ongoing maintenance at your request. Save time and money by choosing us for all of your property needs, on demand. We can serve as your preferred specialists, or as your maintenance support staff. We provide the availability, skill, and price combined to maximize the quality of the work done.</td>
                  <td className="py-3 text-muted-foreground">5–15 calls in the first hour</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="font-semibold text-foreground">The Nexus Commitment</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One request. One verified contractor. Zero unsolicited calls. If no qualified contractor is currently available in your area, you are told immediately—no indefinite wait, no ambiguity.
            </p>
      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] text-center mb-3">Process</p>
          <h2 className="text-[2rem] font-black tracking-tight text-center mb-3">How It Works</h2>
          <p className="text-center text-[var(--color-subtle)] mb-14 max-w-md mx-auto text-[14px] leading-relaxed">
            Fast, direct, and transparent — from first submission to completed work
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-7">
                <p className="text-[var(--color-primary)] text-xs font-bold tracking-widest mb-4">{step}</p>
                <h3 className="text-[15px] font-bold mb-2.5">{title}</h3>
                <p className="text-[var(--color-subtle)] text-[13px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] text-center mb-3">Coverage</p>
          <h2 className="text-[2rem] font-black tracking-tight text-center mb-3">Service Categories</h2>
          <p className="text-center text-[var(--color-subtle)] mb-14 max-w-md mx-auto text-[14px] leading-relaxed">
            Home and commercial services across the Topeka region — with more added regularly
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {services.map(({ name }) => (
              <div
                key={name}
                className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-primary)] transition-colors"
              >
                <p className="font-semibold text-[var(--color-foreground)] text-[13px] mb-1.5">{name}</p>
                <p className="text-[11px] text-[var(--color-primary)] font-medium uppercase tracking-wide">Available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section id="contractors" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-primary">For Contractors</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
Want to scale, expand, or gain customers without paying for marketing, responding to calls, emails, and inquiries online? We hande all of it. You'll be notifieid when a qualified request is available to you, based  on your availability, trade, and preferences. We may be adaptable, but we don't expect you to be. You have full ownership over your business and work. We just make it easier.
              </h2>
              <p className="mt-4 text-muted-foreground">
              </p>
              <p className="mt-4 text-muted-foreground">
                Nexus Operations works differently. Pay a flat monthly membership. When you claim a project, it is yours. Accepting a job costs you nothing, and your time is just as important to us, as it is to you.. The property owner is expecting your call and has already shared complete project details.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Charge your own prices for services provided,",
                  "Exclusive projects, with full scope, specifications and scheduling - right away",
                  "Track your jobs in the dashboard, have 24/7 support if problems arise",
                  "Budget ceiling is visible upfront, transparency is critical to efficiency, and accuracy.",
                  "Not lead generation, automated and managed.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/sign-up"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-semibold">Membership Requirements</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Valid state license</p>
                    <p className="text-sm text-muted-foreground">In your trade category</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">General liability insurance</p>
                    <p className="text-sm text-muted-foreground">$500K minimum coverage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Background check</p>
                    <p className="text-sm text-muted-foreground">Clean record required</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">24-hour response commitment</p>
                    <p className="text-sm text-muted-foreground">Consultation confirmation</p>
                  </div>
                </li>
              </ul>
      <section id="contractors" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest mb-4">For Contractors</p>
              <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">
                Stop chasing leads.<br />Let them come to you.
              </h2>
              <p className="text-[var(--color-subtle)] leading-relaxed mb-8 text-sm text-pretty">
                You have full ownnership, and so do the property owners.
              </p>
              <ul className="space-y-4">
                {[
                  'Join our Network, exclusively available to contractors who meet the Nexus Standard',
                  'Timeliness, Professionalism, Reputable, Experienced, Efficient',
                  'No cost upfront, no risk.',
                  'Simple license and insurance verification',
                  'Growing network across the NE Kansas region',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[var(--color-primary)] font-bold flex-shrink-0 mt-0.5">&#10003;</span>
                    <span className="text-[var(--color-subtle)] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-8">
              <p className="text-xs text-[var(--color-subtle)] uppercase tracking-widest mb-6">Contractor dashboard preview</p>
              <div className="space-y-3">
                {[
                  { label: 'Open projects near you', value: '14', highlight: true },
                  { label: 'Projects claimed this month', value: '6' },
                  { label: 'Avg. budget ceiling', value: '$6,200' },
                  { label: 'Consultation rate', value: '94%' },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                    <span className="text-sm text-[var(--color-subtle)]">{label}</span>
                    <span className={`text-sm font-bold ${highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'}`}>{value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-[var(--color-primary)] text-[var(--color-background)] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors text-sm">
                Apply as a Contractor
              </button>
            </div>
            <button className="w-full mt-6 h-10 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Apply as a Contractor
            </button>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Who we serve</h2>
            <p className="mt-2 text-muted-foreground">Property owners and operators who need reliable contractor coordination</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Home, title: "Homeowners", description: "Remodeling, Home Projects, Restoration, Preventation Services, Upgrades, Restoration, Repairs" },
              { icon: Building2, title: "Property Managers", description: "Full Maintenance Lifecyce, Turnover, Repairs, Emergency Maintenance" },
              { icon: Users, title: "Landlords", description: "Give your maintenance man a break, call us instead. Available 24/7, skilled in all major trades." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      {/* For Property Managers */}
      <section id="property-managers" className="py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-3">For Property Managers</p>
          <h2 className="text-[2rem] font-black tracking-tight mb-5">Manage multiple properties.<br />One place.</h2>
          <p className="text-[var(--color-subtle)] text-[14px] leading-relaxed mb-12 max-w-xl mx-auto">
            Submit projects across your entire portfolio and track each one from claim to completion. Every contractor is verified — so you never have to guess who is showing up.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Portfolio-wide submissions',  body: 'Submit projects across all your properties from a single account.' },
              { title: 'Verified contractors only',   body: 'Every contractor on the platform is licensed and insured — no exceptions.' },
              { title: 'Full project records',        body: 'Photos, scopes, budgets, and timelines stored for every completed job.' },
            ].map(({ title, body }) => (
              <div key={title} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                <h3 className="font-bold text-[14px] mb-2.5">{title}</h3>
                <p className="text-[var(--color-subtle)] text-[13px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground">
            Submit your project or join our contractor network today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:admin@nexusoperations.org"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              admin@nexusoperations.org
            </a>
            <a
              href="tel:9139511711"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <Phone className="h-4 w-4" />
              (913) 951-1711
            </a>
      <section id="contact" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 text-balance tracking-tight">Ready to hire with confidence?</h2>
          <p className="text-[var(--color-subtle)] mb-10 leading-relaxed text-sm">
            Join Nexus Operations — submit your first project free and get matched with a verified contractor in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="h-11 px-7 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Start Your Project — Free
            </button>
            <button className="h-11 px-7 border border-[var(--color-border)] text-[var(--color-foreground)] text-[13px] font-semibold rounded-full hover:bg-[var(--color-surface-raised)] transition-colors">
              Apply as a Contractor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Image
                src="/nexus-logo.png"
                alt="Nexus Operations"
                width={140}
                height={47}
                style={{ height: "36px", width: "auto" }}
              />
              <p className="mt-4 text-sm text-muted-foreground">
                The Nexus Promise is that we will always follow our best practices, and yours.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#services" className="hover:text-foreground">Service Categories</a></li>
                <li><a href="#start" className="hover:text-foreground">Submit a Request</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Contractors</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#contractors" className="hover:text-foreground">Join the Network</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Membership Plans</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Verification Process</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:admin@nexusoperations.org" className="hover:text-foreground">Contact</a></li>
                <li><a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Help Center</a></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Serving Topeka, KS and surrounding areas
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
      <footer className="bg-[var(--color-background)] border-t border-[var(--color-border)] py-12 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[var(--color-primary)] rounded-[5px] flex items-center justify-center flex-shrink-0">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nexus%20official%20logo%20small-Isfi4ffPq4jpg0F0ALxirkL1wVWk3u.png"
                    alt="Nexus Operations"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <div className="leading-[1.1]">
                  <p className="text-[12px] font-bold text-[var(--color-foreground)]">Nexus</p>
                  <p className="text-[9px] font-semibold text-[var(--color-subtle)] tracking-[0.18em] uppercase">Operations</p>
                </div>
              </div>
              <p className="text-[12px] text-[var(--color-subtle)] leading-relaxed max-w-[200px]">
                One contractor. Exclusively yours.<br />Topeka, KS.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-subtle)] mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Services',     href: '#services' },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-subtle)] mb-4">Company</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'For Contractors',      href: '#contractors' },
                  { label: 'For Property Managers', href: '#property-managers' },
                  { label: 'Contact',              href: '#contact' },
                  { label: 'Help Center',          href: 'https://nexusoperations.zendesk.com/hc/en-us', external: true },
                ].map(({ label, href, external }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-subtle)] mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms',   href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

          </div>
          <div className="border-t border-[var(--color-border)] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--color-subtle)]">
            <p>&copy; 2026 Nexus Operations. All rights reserved.</p>
            <Link
              href="https://nexusoperations.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-foreground)] transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </footer>

    </main>
  )
}

/* ── Inline icon components ── */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
