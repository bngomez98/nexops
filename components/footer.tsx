import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Phone, Mail, MapPin, ArrowRight, BadgeCheck, Clock } from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

const platformLinks = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/commercial', label: 'Commercial' },
  { href: '/contractors', label: 'Contractor network' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
]

const accountLinks = [
  { href: '/auth/sign-up', label: 'Homeowner sign-up' },
  { href: '/auth/sign-up?role=property_manager', label: 'Property manager sign-up' },
  { href: '/auth/sign-up?role=contractor', label: 'Contractor application' },
  { href: '/auth/login', label: 'Sign in' },
]

const companyLinks = [
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of service' },
  { href: '/user-agreement', label: 'User agreement' },
  { href: '/site-map', label: 'Sitemap' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* CTA band */}
        <div className="mb-14 flex flex-col gap-5 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Ready to simplify maintenance?
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              One portal for requests, dispatch, updates, and billing.
            </h2>
            <p className="mt-1.5 max-w-lg text-[13.5px] text-muted-foreground">
              Free to sign up. No long-term contracts. Serving {CONTACT_INFO.cityState} and Shawnee County.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              Create account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-[13px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
            >
              Talk to the team
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Nexus Operations coordinates verified, insured contractors for homeowners, landlords,
              and property managers across {CONTACT_INFO.cityState}. One request, one point of
              contact, one invoice.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
              <BadgeCheck className="h-3.5 w-3.5" /> Licensed &amp; insured network
            </div>

            <div className="mt-5 flex flex-col gap-2.5 text-[13px]">
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-primary" /> {CONTACT_INFO.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-primary" /> {CONTACT_INFO.email}
              </a>
              <span className="inline-flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-primary" />
                <span>
                  {CONTACT_INFO.addressLine1}
                  <br />
                  {CONTACT_INFO.cityStateZip}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> {CONTACT_INFO.supportHoursShort}
              </span>
            </div>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Accounts" links={accountLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-muted-foreground">
            &copy; {new Date().getFullYear()} {CONTACT_INFO.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-[12px]">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/user-agreement" className="text-muted-foreground hover:text-foreground transition-colors">
              User agreement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
