import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, MessageCircleQuestion } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "FAQ | Nexus Operations",
  description: "Frequently asked questions about Nexus Operations — property service coordination in Topeka, KS.",
}

const sections = [
  {
    category: "Property Owners",
    questions: [
      {
        q: "How do I submit a service request?",
        a: "Log in to your account, select the trade category, upload project photos, describe the scope of work, set a maximum budget, and provide your availability for a contractor consultation. Requests that meet all documentation requirements are routed to the contractor network.",
      },
      {
        q: "What information is required to submit a request?",
        a: "Every request requires: 2–10 project photos, a written scope of work describing what needs to be done, a maximum budget cap, the property address, and at least one preferred consultation window. Requests that do not meet these requirements cannot be submitted.",
      },
      {
        q: "Will multiple contractors contact me about my request?",
        a: "No. Only one contractor is assigned per request. Once a contractor claims your request, it is immediately removed from all other contractors' feeds. You will not receive calls, emails, or visits from competing contractors.",
      },
    ],
  },
  {
    category: "Contractors",
    questions: [
      {
        q: "What is required to join as a contractor?",
        a: "Contractor applications require: a valid Kansas contractor license (or equivalent trade license) and proof of current general liability insurance. All applications are reviewed manually by Nexus Operations staff.",
      },
      {
        q: "How does the claim process work?",
        a: "When a new request matching your service categories and area is submitted, you receive a notification. The first qualified contractor to tap 'Claim' secures the request exclusively. The listing is removed from all other contractors' feeds at the moment of claim.",
      },
      {
        q: "Is there a fee to join or claim requests?",
        a: "The Nexus contractor network is free to join and free to use. There are no signup fees, monthly subscriptions, per-claim charges, or referral percentages.",
      },
    ],
  },
  {
    category: "Platform Policies",
    questions: [
      {
        q: "Is Nexus Operations available outside Topeka, KS?",
        a: "Currently, Nexus Operations serves Topeka, Kansas and surrounding Shawnee County areas. Expansion to additional markets will be announced on this site.",
      },
      {
        q: "How are contractors verified?",
        a: "All contractors must submit current licensing and active insurance documentation before account approval. Credentials are reviewed manually and must remain current for continued access.",
      },
      {
        q: "How do I contact support?",
        a: "Phone: (785) 428-0244, Monday through Friday 8am–6pm CT. Email: admin@nexusoperations.org.",
      },
    ],
  },
]

export default function FAQPage() {
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
            <Link href="/faq" className="font-medium text-foreground">FAQ</Link>
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
            <Image src="/photo-contractor.jpg" alt="Contractor consultation in progress" fill className="object-cover" priority />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">Quick answers about account setup, request routing, contractor verification, and platform policies.</p>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <div key={section.category}>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map(({ q, a }) => (
                  <details key={q} className="group overflow-hidden rounded-lg border border-border bg-card">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium select-none transition hover:bg-muted/50">
                      {q}
                      <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-border px-5 py-4 text-[13px] leading-relaxed text-muted-foreground">{a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessageCircleQuestion className="h-4 w-4 text-primary" />Still need help?</h3>
          <p className="mb-4 text-[13px] text-muted-foreground">Contact our team directly or visit the help center for implementation and policy documentation.</p>
          <div className="flex flex-wrap gap-3 text-[13px]">
            <a href="tel:+17854280244" className="text-primary hover:underline">(785) 428-0244</a>
            <span className="text-border">·</span>
            <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">admin@nexusoperations.org</a>
            <span className="text-border">·</span>
            <a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Help Center</a>
          </div>
        </div>
      </div>
    </main>
  )
}
