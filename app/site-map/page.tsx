import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { CONTACT_INFO } from "@/lib/contact-info"

export const metadata = {
  title: "Sitemap | Nexus Operations",
  description: "Full index of the main public pages and primary dashboard entry points on the Nexus Operations platform.",
}

type SiteMapLink = {
  href: string
  label: string
  desc: string
  external?: boolean
}

const sections: { label: string; links: SiteMapLink[] }[] = [
  {
    label: "Main Site",
    links: [
      { href: "/",            label: "Home",            desc: "Introduction to Nexus Operations, service categories, and account types" },
      { href: "/about",       label: "About",           desc: "Company background, mission, and team" },
      { href: "/services",    label: "Services",        desc: "Overview of commercial, residential, and B2B service offerings" },
      { href: "/pricing",     label: "Pricing",         desc: "Pricing details for homeowners, property managers, and contractors" },
      { href: "/contractors", label: "For Contractors", desc: "Contractor-focused overview and marketplace positioning" },
      { href: "/contact",     label: "Contact",         desc: "Contact Nexus Operations for consultations and support" },
      { href: "/faq",         label: "FAQ",             desc: "Frequently asked questions about the platform and policies" },
      { href: "/site-map",    label: "Sitemap",         desc: "This page — a structured index of major routes" },
    ],
  },
  {
    label: "Account Portals",
    links: [
      { href: "/auth/sign-up",                       label: "Create Account",         desc: "Register as a homeowner, property manager, or contractor" },
      { href: "/auth/sign-up?role=property_manager", label: "Property Manager",       desc: "Register as a property manager" },
      { href: "/auth/sign-up?role=contractor",       label: "Contractor Application", desc: "Apply to join the Nexus contractor network" },
      { href: "/auth/login",                         label: "Sign In",                desc: "Log in to your Nexus Operations account" },
    ],
  },
  {
    label: "Dashboard",
    links: [
      { href: "/dashboard",              label: "Overview",      desc: "Main dashboard — requests, stats, and recent activity" },
      { href: "/dashboard/requests/new", label: "New Request",   desc: "Submit a new maintenance or repair request" },
      { href: "/dashboard/requests",     label: "My Requests",   desc: "View and manage all submitted service requests" },
      { href: "/dashboard/settings",     label: "Settings",      desc: "Account settings, notifications, and preferences" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/terms",   label: "Terms of Service", desc: "Platform terms and conditions of use" },
      { href: "/privacy", label: "Privacy Policy",   desc: "How Nexus Operations collects and uses your data" },
    ],
  },
  {
    label: "Contact",
    links: [
      { href: CONTACT_INFO.phoneHref,                    label: CONTACT_INFO.phoneDisplay,     desc: `Phone support — ${CONTACT_INFO.supportHoursShort}`, external: true },
      { href: `mailto:${CONTACT_INFO.email}`,           label: CONTACT_INFO.email,            desc: "Email support — responses within one business day", external: true },
    ],
  },
]

export default function SiteMapPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between h-14">
          <Link href="/">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={140}
              height={47}
              style={{ height: "32px", width: "auto" }}
              priority
            />
          </Link>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <Link href="/terms"   className="hover:text-foreground transition">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition">Privacy</Link>
            <Link href="/faq"     className="hover:text-foreground transition">FAQ</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {CONTACT_INFO.website}
        </Link>

        <h1 className="text-2xl font-bold mt-4">Sitemap</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Complete index of the main public pages and primary dashboard entry points.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.label}>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
                {section.label}
              </h2>
              <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
                {section.links.map(({ href, label, desc, external }) =>
                  external ? (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-4 transition hover:bg-muted/50 group"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{label}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
                    </a>
                  ) : (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between px-5 py-4 transition hover:bg-muted/50 group"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{label}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8 flex flex-wrap gap-6 text-[12px] text-muted-foreground">
          <Link href="/terms"   className="hover:text-foreground transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link>
          <Link href="/faq"     className="hover:text-foreground transition">FAQ</Link>
        </div>
      </div>
    </main>
  )
}
