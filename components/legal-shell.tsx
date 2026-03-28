import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Scale, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface LegalShellProps {
  title: string
  updated: string
  children: React.ReactNode
}

export function LegalShell({ title, updated, children }: LegalShellProps) {
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
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to nexusoperations.org
        </Link>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative h-44 border-b border-border">
            <Image src="/photo-manager.jpg" alt="Property manager reviewing documentation" fill className="object-cover" priority />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1.5 text-[12px] text-muted-foreground">Last updated: {updated}</p>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              This document explains how Nexus Operations structures legal responsibilities, account expectations, and data governance for property owners, managers, and contractors using the platform.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border bg-background/60 p-3 text-[12px] text-muted-foreground">
                <Scale className="mb-1.5 h-4 w-4 text-primary" />
                Written to clarify rights, obligations, and dispute handling.
              </div>
              <div className="rounded-md border border-border bg-background/60 p-3 text-[12px] text-muted-foreground">
                <ShieldCheck className="mb-1.5 h-4 w-4 text-primary" />
                Updated to reflect current platform workflows and protections.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">{children}</div>

        <div className="mt-14 flex flex-wrap gap-6 border-t border-border pt-8 text-[12px] text-muted-foreground">
          <Link href="/terms" className="transition hover:text-foreground">Terms of Service</Link>
          <Link href="/privacy" className="transition hover:text-foreground">Privacy Policy</Link>
          <Link href="/faq" className="transition hover:text-foreground">FAQ</Link>
          <Link href="/sitemap" className="transition hover:text-foreground">Sitemap</Link>
        </div>
      </div>
    </main>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-5 py-4 text-[13px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}
