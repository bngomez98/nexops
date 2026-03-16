import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface LegalShellProps {
  title: string
  updated: string
  children: React.ReactNode
}

export function LegalShell({ title, updated, children }: LegalShellProps) {
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to nexusoperations.org
        </Link>

        <h1 className="text-2xl font-bold mt-4">{title}</h1>
        <p className="mt-1.5 text-[12px] text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-10 space-y-8">{children}</div>

        <div className="mt-14 border-t border-border pt-8 flex flex-wrap gap-6 text-[12px] text-muted-foreground">
          <Link href="/terms"   className="hover:text-foreground transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link>
          <Link href="/faq"     className="hover:text-foreground transition">FAQ</Link>
          <Link href="/site-map" className="hover:text-foreground transition">Sitemap</Link>
        </div>
      </div>
    </main>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-5 py-4 text-[13px] text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  )
}
