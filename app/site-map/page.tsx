import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Sitemap | Nexus Operations",
  description: "Full index of all pages on the Nexus Operations platform.",
}

const sections = [
  {
    label: "Main Site",
    links: [
      { href: "/", label: "Home", desc: "Introduction to Nexus Operations, service categories, and account types" },
      { href: "/services", label: "Services", desc: "Overview of commercial, residential, and B2B service offerings" },
      { href: "/pricing", label: "Pricing", desc: "Pricing details for homeowners, property managers, and contractors" },
      { href: "/contractors", label: "For Contractors", desc: "Contractor-focused overview and marketplace positioning" },
      { href: "/contact", label: "Contact", desc: "Contact Nexus Operations for consultations and support" },
      { href: "/faq", label: "FAQ", desc: "Frequently asked questions about the platform and policies" },
      { href: "/site-map", label: "Sitemap", desc: "This page — a structured index of major routes" },
    ],
  },
  {
    label: "Account & Authentication",
    links: [
      { href: "/auth/sign-up", label: "Create Account", desc: "Register as a homeowner, property manager, or contractor" },
      { href: "/auth/sign-up?role=property_manager", label: "Property Manager Registration", desc: "Open a property management account supporting multiple addresses" },
      { href: "/auth/sign-up?role=contractor", label: "Contractor Application", desc: "Apply to join the verified contractor network" },
      { href: "/auth/login", label: "Sign In", desc: "Access your existing account" },
    ],
  },
  {
    label: "Homeowner & Manager Dashboard",
    links: [
      { href: "/dashboard/homeowner", label: "Dashboard Overview", desc: "Summary of active requests and account status" },
      { href: "/dashboard/homeowner/new-request", label: "Submit New Request", desc: "Create a new service request with photos, scope, and budget" },
      { href: "/dashboard/homeowner/settings", label: "Account Settings", desc: "Profile, contact details, and preferences" },
    ],
  },
  {
    label: "Contractor Dashboard",
    links: [
      { href: "/dashboard/contractor", label: "Contractor Overview", desc: "Activity summary and claimed requests" },
      { href: "/dashboard/contractor/projects/[id]", label: "Project Details", desc: "View project specifics and status" },
      { href: "/dashboard/contractor/settings", label: "Settings", desc: "License, insurance, and preferences" },
      { href: "/dashboard/contractor/analytics", label: "Analytics", desc: "Performance metrics and earnings data" },
    ],
  },
  {
    label: "Legal & Support",
    links: [
      { href: "/privacy", label: "Privacy Policy", desc: "Data handling and privacy practices" },
      { href: "/terms", label: "Terms of Service", desc: "Platform terms and conditions" },
      { href: "/about", label: "About", desc: "Company information and mission" },
    ],
  },
]

export default function SiteMapPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary"></div>
            <span className="text-sm font-semibold text-primary">Navigation</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Sitemap</h1>
          <p className="text-muted-foreground max-w-2xl">
            Complete index of all pages and features on the Nexus Operations platform.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.label}>
              <h2 className="text-lg font-semibold text-foreground mb-4">{section.label}</h2>
              <div className="grid gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {link.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

      { href: "/dashboard", label: "Dashboard", desc: "Main authenticated dashboard overview" },
      { href: "/dashboard/requests", label: "Requests", desc: "Review submitted homeowner requests" },
      { href: "/dashboard/requests/new", label: "New Request", desc: "Create a new service request" },
      { href: "/dashboard/contractor", label: "Contractor Dashboard", desc: "View open jobs, metrics, and contractor actions" },
      { href: "/dashboard/contractor/analytics", label: "Contractor Analytics", desc: "Analytics and performance reporting for contractors" },
      { href: "/dashboard/contractor/settings", label: "Contractor Settings", desc: "Manage contractor account and billing settings" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/terms",   label: "Terms of Service", desc: "Platform rules, responsibilities, fees, and governing law" },
      { href: "/privacy", label: "Privacy Policy",   desc: "Data collection, use, retention, sharing, and your rights" },
    ],
  },
  {
    label: "Support",
    links: [
      { href: "/faq", label: "FAQ", desc: "Frequently asked questions — process, verification, contractor network, and policies" },
      { href: "tel:+17854280244",          label: "(785) 428-0244",              desc: "Phone support — Monday through Friday, 8 am–6 pm CT", external: true },
      { href: "mailto:admin@nexusoperations.org", label: "admin@nexusoperations.org", desc: "Email support for account, billing, and platform questions", external: true },
      { href: "/privacy", label: "Privacy Policy", desc: "Privacy and data-handling details" },
      { href: "/terms", label: "Terms of Service", desc: "Terms, responsibilities, and governing rules" },
    ],
  },
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
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
            <Link href="/terms" className="hover:text-foreground transition">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition">Privacy</Link>
            <Link href="/faq" className="hover:text-foreground transition">FAQ</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to nexusoperations.org
        </Link>

        <h1 className="text-2xl font-bold mt-4">Sitemap</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Complete index of all pages on the Nexus Operations platform.
          Complete index of the main public pages and primary dashboard entry points.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.label}>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
                {section.label}
              </h2>
              <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
                {section.links.map(({ href, label, desc, external }) => (
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
                {section.links.map(({ href, label, desc }) => (
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
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8 flex flex-wrap gap-6 text-[12px] text-muted-foreground">
          <Link href="/terms"   className="hover:text-foreground transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link>
          <Link href="/faq"     className="hover:text-foreground transition">FAQ</Link>
          <Link href="/terms" className="hover:text-foreground transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link>
          <Link href="/faq" className="hover:text-foreground transition">FAQ</Link>
        </div>
      </div>
    </main>
  )
}
