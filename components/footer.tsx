import Link from '@/components/link'
import { Logo } from '@/components/logo'
import { Phone, Mail, MapPin, ArrowRight, BadgeCheck, Clock } from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

const platformLinks = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/commercial', label: 'Commercial' },
  { href: '/contractors', label: 'Contractor Network' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
]

const accountLinks = [
  { href: '/auth/sign-up', label: 'Homeowner Sign-up' },
  { href: '/auth/sign-up?role=property-manager', label: 'Property Manager Sign-up' },
  { href: '/auth/sign-up?role=contractor', label: 'Contractor Application' },
  { href: '/auth/login', label: 'Sign In' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/user-agreement', label: 'User Agreement' },
  { href: '/site-map', label: 'Sitemap' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* CTA Band */}
        <div className="mb-14 rounded-xl border border-border bg-background p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono-label text-primary">Ready to simplify maintenance?</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
                One portal for requests, dispatch, and billing.
              </h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                Free to sign up. No long-term contracts. Serving {CONTACT_INFO.cityState} and Shawnee County.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm btn-primary-glow hover:opacity-95 transition-all"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
              >
                Talk to the team
              </Link>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Nexus Operations manages verified, insured contractors for homeowners, landlords, 
              and property managers across {CONTACT_INFO.cityState}. One request, one point of contact, one invoice.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <BadgeCheck className="h-3.5 w-3.5" /> Licensed & Insured Network
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" /> 
                {CONTACT_INFO.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" /> 
                {CONTACT_INFO.email}
              </a>
              <span className="inline-flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>
                  {CONTACT_INFO.addressLine1}
                  <br />
                  {CONTACT_INFO.cityStateZip}
                </span>
              </span>
              <span className="inline-flex items-center gap-2.5 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> 
                {CONTACT_INFO.supportHoursShort}
              </span>
            </div>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Accounts" links={accountLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {CONTACT_INFO.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/user-agreement" className="text-muted-foreground hover:text-foreground transition-colors">
              User Agreement
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
      <h3 className="font-mono-label mb-4 text-foreground">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
