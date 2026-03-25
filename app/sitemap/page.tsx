import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Sitemap | Nexus Operations",
  description: "Full index of all pages on the Nexus Operations platform.",
}

const sections = [
  {
    label: "Main Site",
    links: [
      { href: "/", label: "Home", desc: "Introduction to Nexus Operations, service categories, and account types" },
      { href: "/faq", label: "FAQ", desc: "Frequently asked questions for owners, managers, and contractors" },
      { href: "/sitemap", label: "Sitemap", desc: "Complete index of platform routes and support paths" },
    ],
  },
  {
    label: "Account Portals",
    links: [
      { href: "/auth/sign-up", label: "Create Account", desc: "Register as homeowner, property manager, or contractor" },
      { href: "/auth/login", label: "Sign In", desc: "Access existing dashboard and project records" },
      { href: "/auth/forgot-password", label: "Forgot Password", desc: "Reset account access securely through email" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service", desc: "Responsibilities, liabilities, and platform governance" },
      { href: "/privacy", label: "Privacy Policy", desc: "Data collection, usage, retention, and user rights" },
    ],
  },
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={140} height={47} style={{ height: "32px", width: "auto" }} priority />
          </Link>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <Link href="/terms" className="transition hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="transition hover:text-foreground">Privacy</Link>
            <Link href="/faq" className="transition hover:text-foreground">FAQ</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />Back to nexusoperations.org
        </Link>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative h-44 border-b border-border">
            <Image src="/photo-manager.jpg" alt="Organized property operations workspace" fill className="object-cover" priority />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Sitemap</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">Use this index to quickly navigate core pages for onboarding, legal references, and support.</p>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.label}>
              <h2 className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{section.label}</h2>
              <div className="overflow-hidden rounded-lg border border-border bg-card divide-y divide-border">
                {section.links.map(({ href, label, desc }) => (
                  <Link key={href} href={href} className="group flex items-center justify-between px-5 py-4 transition hover:bg-muted/50">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{label}</p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{desc}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
