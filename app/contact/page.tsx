import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Clock,
  Hammer,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { ContactForm } from '@/components/contact-form'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'Contact — Submit a Request or Reach the Nexus Team',
  description: `Contact Nexus Operations to submit a maintenance request, request a commercial proposal, or apply as a licensed contractor. Serving ${CONTACT_INFO.serviceArea}. Email ${CONTACT_INFO.email} or call ${CONTACT_INFO.phoneDisplay}.`,
}

const directItems = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT_INFO.phoneDisplay,
    href: CONTACT_INFO.phoneHref,
  },
  {
    icon: Clock,
    label: 'Business hours',
    value: CONTACT_INFO.businessHours,
  },
  {
    icon: MapPin,
    label: 'Office',
    value: `${CONTACT_INFO.addressLine1}, ${CONTACT_INFO.cityStateZip}`,
  },
]

const quickPaths = [
  {
    icon: Sparkles,
    title: 'Submit a maintenance request',
    desc: 'Already know what you need done? Skip the form and submit a documented request through your dashboard.',
    cta: 'Submit a request',
    href: '/auth/sign-up',
  },
  {
    icon: Building2,
    title: 'Commercial & portfolio proposals',
    desc: 'Managing 10+ doors? Our commercial team will put together a custom proposal within two business days.',
    cta: 'Request a proposal',
    href: '/commercial',
  },
  {
    icon: Hammer,
    title: 'Contractors joining the network',
    desc: 'Licensed and insured in Shawnee County? Apply directly — no cold outreach, no lead fees.',
    cta: 'Apply to join',
    href: '/auth/sign-up?role=contractor',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <MessageSquare className="h-3 w-3" /> Contact
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Talk to a real person in Topeka.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Whether you're a homeowner with a project, a property manager evaluating a commercial
              engagement, or a contractor interested in joining the network — we respond to every
              inquiry within one business day.
            </p>
          </div>
        </section>

        {/* ── Contact grid ───────────────────────────────── */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Direct contact sidebar */}
            <aside className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Reach us directly
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  Four ways to get a human on the other end.
                </h2>

                <ul className="mt-6 flex flex-col gap-4">
                  {directItems.map(({ icon: Icon, label, value, href }) => {
                    const inner = (
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                            {label}
                          </p>
                          <p className="mt-0.5 truncate text-[14px] font-semibold text-foreground">
                            {value}
                          </p>
                        </div>
                      </div>
                    )
                    return (
                      <li key={label}>
                        {href ? (
                          <a href={href} className="block transition hover:opacity-80">
                            {inner}
                          </a>
                        ) : (
                          inner
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Emergency callout */}
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">
                      Emergency? Use the emergency line.
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      Burst pipe, gas leak, or HVAC failure in extreme weather? Emergency requests
                      are handled 24/7 — contractor assignment within 1 hour, on-site within 4 hours.
                    </p>
                    <a
                      href={`mailto:emergency@${CONTACT_INFO.email.split('@')[1] ?? 'nexusoperations.org'}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-destructive hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      emergency@{CONTACT_INFO.email.split('@')[1] ?? 'nexusoperations.org'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Service area */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Service area
                </p>
                <p className="mt-2 text-[14px] font-semibold text-foreground">
                  {CONTACT_INFO.serviceArea}.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Not sure if we cover your address? Call us and we'll confirm on the spot.
                </p>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Section>

        {/* ── Quick paths ────────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Skip the form"
            title="Other ways to get started."
            description="If you already know what you're looking for, take the shortcut."
            align="center"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {quickPaths.map(({ icon: Icon, title, desc, cta, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[16px] font-bold text-foreground">{title}</p>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary group-hover:gap-2 transition-all">
                  {cta} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
