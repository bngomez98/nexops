import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "@/components/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Vet a Contractor in Kansas: License Verification and Insurance Checks | Nexus Operations",
  description:
    "A practical guide to verifying Kansas contractor licenses against state records and confirming insurance directly with the provider — and why most property managers skip the steps that matter.",
  keywords: [
    "how to vet contractor Kansas",
    "Kansas contractor license verification",
    "contractor insurance verification",
    "hire contractor Topeka KS",
    "verify contractor credentials Kansas",
    "property management contractor vetting",
  ],
  alternates: { canonical: "https://nexusoperations.org/blog/how-to-vet-contractors-topeka-kansas" },
  openGraph: {
    title: "How to Properly Vet a Contractor in Kansas: License Verification and Insurance Checks",
    description: "The specific steps to verify a Kansas contractor's license and insurance — and what most property managers skip.",
    url: "https://nexusoperations.org/blog/how-to-vet-contractors-topeka-kansas",
    type: "article",
  },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <article className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to blog
            </Link>

            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                Contractor Management
              </span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> 8 min read
              </span>
              <span className="text-[12px] text-muted-foreground">· March 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground mb-6">
              How to Properly Vet a Contractor in Kansas: License Verification, Insurance Checks, and What Most Property Managers Skip
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-5">
              A certificate of insurance handed to you by a contractor is not the same as a verified policy.
              A license number on a business card is not the same as an active license. This guide covers
              the steps that actually close the gap.
            </p>

            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Why the standard approach is insufficient</h2>
              <p>
                Most property managers verify contractors by asking for a copy of their license and certificate
                of insurance. This is a starting point, not a verification. A document can be expired, altered,
                or fabricated. The policy shown on a certificate might have lapsed since it was issued.
                The license might be current but restricted, or the license holder might not be the same person
                as the contractor showing up to the job.
              </p>
              <p>
                None of these are hypothetical scenarios. They occur regularly, and the liability exposure to
                a property manager who allowed an unverified contractor on a property is significant.
              </p>

              <h2 className="text-xl font-semibold text-foreground">Step 1: Verify the license number against state records</h2>
              <p>
                Kansas license verification depends on the trade. Here are the primary lookup resources:
              </p>
              <ul className="space-y-3 list-none pl-0">
                {[
                  {
                    trade: "Electrical contractors",
                    resource: "Kansas State Board of Technical Professions (KSBTP)",
                    url: "ksbtp.ks.gov",
                    note: "Lookup by license number or business name. Confirms license type, status, and expiration.",
                  },
                  {
                    trade: "Plumbers",
                    resource: "Kansas Department of Health and Environment (KDHE)",
                    url: "kdhe.ks.gov",
                    note: "Master and journeyman plumber licenses. Confirm the license class matches the work scope.",
                  },
                  {
                    trade: "HVAC contractors",
                    resource: "Kansas Department of Labor / KDHE",
                    url: "kdol.ks.gov",
                    note: "Also verify EPA 608 certification for refrigerant handling if the job involves refrigerant.",
                  },
                  {
                    trade: "General contractors and other trades",
                    resource: "Kansas Secretary of State business lookup",
                    url: "sos.ks.gov",
                    note: "Confirms the business is registered and in good standing as a Kansas entity.",
                  },
                ].map((item) => (
                  <li key={item.trade} className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-sm font-semibold text-foreground mb-1">{item.trade}</p>
                    <p className="text-[12.5px] text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">{item.resource}</span>
                    </p>
                    <p className="text-[12px] text-muted-foreground">{item.note}</p>
                  </li>
                ))}
              </ul>
              <p>
                When reviewing the record, confirm: the license is active (not expired, suspended, or inactive),
                the name on the license matches the contractor&apos;s legal name or business name, and the license
                type covers the scope of work being performed.
              </p>

              <h2 className="text-xl font-semibold text-foreground">Step 2: Verify insurance with the provider — not just the contractor</h2>
              <p>
                A certificate of insurance (COI) is a summary document, not a policy. It can be issued to show
                a lapsed policy, it can be altered to change dates or coverage amounts, and it reflects the
                policy at the time of issuance — not at the time of the job.
              </p>
              <p>
                The right step is to call or email the insurance company listed on the certificate and request
                verification of the policy. Ask for:
              </p>
              <ul className="pl-4 space-y-1">
                <li>Confirmation the policy is currently active</li>
                <li>The coverage limits (per occurrence and aggregate)</li>
                <li>The named insured on the policy</li>
                <li>Whether there are any exclusions relevant to the work type</li>
              </ul>
              <p>
                For most residential and commercial maintenance work, a minimum of $500,000 per occurrence
                general liability is standard. Jobs involving tree removal, roofing, or higher-risk trades
                typically warrant $1M or more.
              </p>
              <p>
                Also verify workers compensation coverage if the contractor has employees. If they do not
                have workers comp and an employee is injured on your property, the exposure can fall back
                on the property owner.
              </p>

              <h2 className="text-xl font-semibold text-foreground">Step 3: Confirm the person on-site matches the verified entity</h2>
              <p>
                A licensed contractor sometimes sends an unlicensed employee or subcontractor to perform
                licensed-trade work. In Kansas, the licensed individual must be present or directly supervising
                the work, depending on the trade and the specific regulation.
              </p>
              <p>
                For higher-stakes jobs — anything involving electrical panels, gas lines, or structural work —
                confirm that the person who will be on-site holds the applicable license, not just the company.
              </p>

              <h2 className="text-xl font-semibold text-foreground">What Nexus Operations does differently</h2>
              <p>
                Every contractor in the Nexus Operations network has been through the verification process
                described above: license confirmed against state records, insurance confirmed directly with
                the issuing provider, and re-verified annually. Commercial clients can request the license
                number and current insurance certificate for any assigned contractor before a job begins —
                the information is provided within one business day.
              </p>
              <p>
                For property managers who do not want to run this process for every new contractor they
                encounter, a verified network removes the burden. You are working with contractors whose
                credentials have already been checked — not relying on documents handed to you at the door.
              </p>
            </div>

            <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">Want to see the network?</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                The Nexus Operations contractor directory shows active contractors by trade category,
                credentials required, and current verification status.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contractors#network"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                >
                  View the network
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-card border border-border text-foreground rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  Request credential details
                </Link>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
