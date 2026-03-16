import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight } from "lucide-react"

export const metadata = {
  title: "FAQ | Nexus Operations",
  description: "Frequently asked questions about Nexus Operations — property service coordination in Topeka, KS.",
}

const sections = [
  {
    category: "Property Owners",
    questions: [
      {
        q: "What does it cost to submit a service request?",
        a: "Property owners and property managers submit requests through a Nexus account. There are no per-request charges or hidden fees associated with submitting a request.",
      },
      {
        q: "What information is required to submit a request?",
        a: "Every request requires: 2–10 project photos, a written scope of work describing what needs to be done, a maximum budget cap, the property address, and at least one preferred consultation window. Requests that do not meet these requirements cannot be submitted.",
      },
      {
        q: "Will multiple contractors contact me about my request?",
        a: "No. Only one contractor is assigned per request. Once a contractor claims your request, it is immediately removed from all other contractors' feeds. You will not receive calls, emails, or visits from competing contractors.",
      },
      {
        q: "How quickly will a contractor claim my request?",
        a: "Claim times vary by trade and availability in your area. When a contractor claims your request, both parties receive a confirmed consultation appointment within 24 hours. If no contractor is available, you will be notified directly — there is no indefinite waiting period.",
      },
      {
        q: "Am I obligated to hire the contractor after the consultation?",
        a: "No. After the consultation, the contractor provides a written, itemized estimate. You can accept the estimate, negotiate, or decline with no obligation or cancellation fees.",
      },
      {
        q: "Can I cancel a submitted request?",
        a: "Yes. You may cancel an open request at any time before a contractor claims it. Once a contractor has claimed and a consultation is scheduled, cancellations must be made at least 24 hours in advance. Repeated same-day cancellations may affect your account standing.",
      },
      {
        q: "I manage multiple properties. Can one account cover all of them?",
        a: "Yes. Property manager accounts support multiple property addresses under a single login, with per-property request history and tracking. Register as a Property Manager during sign-up or contact our support team to upgrade an existing account.",
      },
    ],
  },
  {
    category: "Contractors",
    questions: [
      {
        q: "What is required to join as a contractor?",
        a: "Contractor applications require: a valid Kansas contractor license (or equivalent trade license), proof of current general liability insurance, and completion of a background check. Applications without all three items will not be approved.",
      },
      {
        q: "How does the claim process work?",
        a: "When a new request matching your service categories and area is submitted, you receive a notification. The first qualified contractor to tap 'Claim' secures the request exclusively. The listing is removed from all other contractors' feeds at the moment of claim. You then receive the property owner's full contact information and a confirmed consultation appointment.",
      },
      {
        q: "What information do I receive before claiming a request?",
        a: "Before claiming, you can see: the service category, a brief project description, the property address, the budget ceiling, the number of photos attached, and the property owner's availability windows. Full photo access and direct contact information are provided after you claim.",
      },
      {
        q: "Is there a fee to claim requests?",
        a: "Individual claims are not charged per-claim. Contractors pay a monthly membership that provides access to all open requests in their service area and categories. Membership details are available after completing the contractor application.",
      },
      {
        q: "What happens if I claim a request but cannot make the consultation?",
        a: "Contact our support team as soon as possible via the Help Center or by calling (785) 428-0244. The request may be released back to the open pool at Nexus Operations' discretion. Repeated failures to honor claimed consultations will result in account suspension.",
      },
      {
        q: "Can I set which request types and geographic area I receive?",
        a: "Yes. Your contractor profile allows you to select active service categories (e.g., HVAC, Electrical, Roofing) and set a service radius in miles from your registered address. You will only receive notifications for requests that match both filters.",
      },
    ],
  },
  {
    category: "Platform Policies",
    questions: [
      {
        q: "Is Nexus Operations available outside Topeka, KS?",
        a: "Currently, Nexus Operations serves Topeka, Kansas and the immediate surrounding Shawnee County area. Expansion to additional markets will be announced on this site and via contractor newsletter.",
      },
      {
        q: "How are contractors verified?",
        a: "All contractors must submit a current contractor license, active insurance certificate, and consent to a background check before account approval. Documentation is reviewed manually by Nexus Operations staff. Accounts are not automatically approved.",
      },
      {
        q: "Are there fake jobs or fake service requests on the platform?",
        a: "No. Only real, user-submitted service requests appear on the portal — not templated or fabricated jobs. Requests are published only after required project details are provided and the account is verified. Suspected fraud is manually reviewed and removed.",
      },
      {
        q: "What happens to my submitted photos and project data?",
        a: "Project photos and details are used solely for matching you with a contractor and facilitating the consultation. Your data is never sold, shared with advertising networks, or distributed to multiple contractors. See the Privacy Policy for full data handling details.",
      },
      {
        q: "How do I contact Nexus Operations for support?",
        a: "Phone: (785) 428-0244, Monday through Friday 8am–6pm CT. Help Center: nexusoperations.zendesk.com/hc/en-us. Our support team responds to all platform inquiries within one business day.",
      },
    ],
  },
]

export default function FAQPage() {
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
            <Link href="/faq"     className="text-foreground font-medium">FAQ</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to nexusoperations.org
        </Link>

        <h1 className="text-2xl font-bold mt-4">Frequently Asked Questions</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Questions about the platform process, fees, verification, and policies.
        </p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <div key={section.category}>
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map(({ q, a }) => (
                  <details key={q} className="group rounded-lg border border-border bg-card overflow-hidden">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium list-none select-none hover:bg-muted/50 transition">
                      {q}
                      <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-border px-5 py-4 text-[13px] text-muted-foreground leading-relaxed">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-semibold mb-2">Still have a question?</h3>
          <p className="text-[13px] text-muted-foreground mb-4">
            Reach us directly by phone or visit the Help Center for platform documentation and additional support resources.
          </p>
          <div className="flex flex-wrap gap-3 text-[13px]">
            <a href="tel:+17854280244" className="text-primary hover:underline">(785) 428-0244</a>
            <span className="text-border">·</span>
            <a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Help Center</a>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8 flex flex-wrap gap-6 text-[12px] text-muted-foreground">
          <Link href="/terms"   className="hover:text-foreground transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link>
          <Link href="/sitemap" className="hover:text-foreground transition">Sitemap</Link>
        </div>
      </div>
    </main>
  )
}
