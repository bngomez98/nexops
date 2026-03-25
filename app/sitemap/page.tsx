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
      { href: "/",                 label: "Home",               desc: "Introduction to Nexus Operations, service categories, and account types" },
      { href: "/faq",              label: "FAQ",                desc: "Frequently asked questions — process, fees, verification, and policies" },
      { href: "/sitemap",          label: "Sitemap",            desc: "This page — full index of all public pages" },
    ],
  },
  {
    label: "Account Portals",
    links: [
      { href: "/auth/sign-up",                        label: "Create Account",                  desc: "Register as a homeowner, property manager, or contractor" },
      { href: "/auth/sign-up?role=property_manager",  label: "Property Manager Registration",   desc: "Open a property management account supporting multiple addresses" },
      { href: "/auth/sign-up?role=contractor",        label: "Contractor Application",          desc: "Apply to join the verified contractor network" },
      { href: "/auth/login",                          label: "Sign In",                         desc: "Access your existing account" },
    ],
  },
  {
    label: "Property Owner & Manager Dashboard",
    links: [
      { href: "/dashboard",                  label: "Dashboard Overview",       desc: "Summary of active requests, recent activity, and account status" },
      { href: "/dashboard/requests",         label: "My Requests",              desc: "Full list of submitted service requests and their current status" },
      { href: "/dashboard/requests/new",     label: "Submit New Request",       desc: "Create a new service request with photos, scope, and budget" },
      { href: "/dashboard/messages",         label: "Messages",                 desc: "Communication threads with assigned contractors" },
      { href: "/dashboard/settings",         label: "Account Settings",         desc: "Profile, contact details, property addresses, and notifications" },
    ],
  },
  {
    label: "Contractor Dashboard",
    links: [
      { href: "/dashboard/contractor",          label: "Contractor Overview",      desc: "Activity summary, claimed requests, and account metrics" },
      { href: "/dashboard/contractor/requests", label: "Open Requests",            desc: "Browse and claim available service requests in your area and trade" },
      { href: "/dashboard/contractor/profile",  label: "Contractor Profile",       desc: "License, insurance, service area, and trade categories" },
      { href: "/dashboard/contractor/billing",  label: "Contractor Billing",       desc: "Membership billing, invoices, payment methods, and payout setup" },
      { href: "/dashboard/contractor/settings", label: "Contractor Settings",      desc: "Notification preferences and account management" },
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
                ))}
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
