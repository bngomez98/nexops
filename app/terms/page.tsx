import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CONTACT_INFO } from "@/lib/contact-info"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service | Nexus Operations",
  description: "Terms of service for Nexus Operations, LLC",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <h1 className="font-serif text-5xl font-light mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">Last updated: April 2026</p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern access to and use of Nexus Operations, LLC
              (&quot;Nexus Operations&quot;, &quot;we&quot;, &quot;us&quot;) coordination services, software, and
              websites (collectively, the &quot;Services&quot;). By submitting a request, creating an account, or
              authorizing work, you agree to these Terms, our <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>, and any order forms, statements of work, or
              subscription selections you approve (each, an &quot;Order&quot;).
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">2. Who May Use the Services</h2>
            <ul className="list-disc pl-6">
              <li>You must be at least 18 years old and able to form a binding contract.</li>
              <li>You represent that all registration, property, and payment information you provide is accurate and kept current.</li>
              <li>If you use the Services on behalf of a business or property owner, you represent that you have authority to bind that entity to these Terms.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">3. Scope of Services</h2>
            <p>
              Nexus Operations coordinates maintenance, repairs, and related services through vetted third-party contractors.
              We do not provide licensed trade services ourselves. Each Order will specify scope, pricing, service level,
              and any materials. If the scope changes after on-site evaluation, we will provide an updated quote for approval
              before proceeding unless you authorize emergency work up to a specified ceiling.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">4. Scheduling and Access</h2>
            <ul className="list-disc pl-6">
              <li>You agree to provide timely access to the property, utilities, parking, and any required permissions.</li>
              <li>Missed appointments or access delays may incur rescheduling fees and extend timelines.</li>
              <li>Emergency requests may be routed to the first available qualified contractor to meet the service level agreement (SLA).</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">5. Payment Terms</h2>
            <ul className="list-disc pl-6">
              <li>Unless otherwise stated in an Order, invoices are due upon receipt. Subscriptions are billed in advance on a recurring basis until cancelled.</li>
              <li>Prices exclude taxes unless stated; you are responsible for applicable taxes and government charges.</li>
              <li>Late balances may accrue a 1.5% monthly finance charge (or the maximum allowed by law) and collection costs.</li>
              <li>Disputes must be submitted in writing within 10 days of invoice delivery. Undisputed amounts remain payable.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">6. Cancellations and Changes</h2>
            <ul className="list-disc pl-6">
              <li>Standard requests may be cancelled with no fee if we receive notice at least 24 hours before the scheduled window.</li>
              <li>Emergency dispatches, work already in progress, or materials ordered for your job may incur actual costs and labor already performed.</li>
              <li>If site conditions differ materially from the provided scope, we may pause work until you approve revised pricing.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">7. Third-Party Contractors and Warranties</h2>
            <p>
              Contractors performing work are independent businesses. We vet licensing, insurance, and experience, monitor SLA performance,
              and document each job, but we do not guarantee contractor workmanship. Contractor warranties, if any, are passed through to you.
              To request a correction, notify us within 7 days of completion with photos or documentation so we can coordinate remediation.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">8. Safety and Compliance</h2>
            <ul className="list-disc pl-6">
              <li>You agree to maintain a safe work environment and notify us of known hazards.</li>
              <li>You will obtain required permits when you are the permit holder; if we obtain permits on your behalf, you authorize us to do so.</li>
              <li>We may decline or stop work if conditions are unsafe or unlawful; time and materials up to that point remain billable.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">9. Non-Solicitation</h2>
            <p>
              For 12 months after introduction, you agree not to directly solicit or hire contractors introduced through the Services for work
              outside the platform without our written consent. If you do, you agree to pay a placement fee equal to 20% of the first year’s
              expected compensation for that contractor engagement.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">10. Acceptable Use</h2>
            <ul className="list-disc pl-6">
              <li>No fraudulent requests, harassment, or unlawful content may be submitted through the platform.</li>
              <li>You will not reverse engineer, scrape, or misuse the Services, nor attempt to bypass payment flows.</li>
              <li>Accounts are single-user; you are responsible for safeguarding credentials and for actions under your account.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">11. Intellectual Property</h2>
            <p>
              We retain all rights to the Services, documentation, and brand assets. You receive a limited, non-transferable license to use the
              Services for your internal business purposes. Feedback you provide may be used to improve the Services without obligation to you.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">12. Data and Communications</h2>
            <p>
              We handle personal information as described in our <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
              You consent to receive service-related communications (email, SMS, or phone) necessary to fulfill requests. You may manage marketing
              preferences at any time; operational messages are required to deliver the Services.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">13. Disclaimers</h2>
            <p>
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED
              WARRANTIES; IN THAT CASE, THE ABOVE MAY NOT APPLY TO YOU TO THE EXTENT PROHIBITED BY LAW.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">14. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER NEXUS OPERATIONS NOR ITS OFFICERS, EMPLOYEES, OR AGENTS WILL BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS OR REVENUE. OUR TOTAL LIABILITY
              ARISING OUT OF OR RELATING TO THE SERVICES IS LIMITED TO THE GREATER OF (A) THE AMOUNT YOU PAID US FOR THE SERVICES IN THE SIX (6)
              MONTHS BEFORE THE CLAIM AROSE OR (B) ONE THOUSAND DOLLARS ($1,000). THESE LIMITATIONS APPLY EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">15. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Nexus Operations from claims, damages, or expenses arising out of your breach of
              these Terms, your misuse of the Services, or your violation of law, except to the extent caused by our gross negligence or willful misconduct.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">16. Termination and Suspension</h2>
            <p>
              We may suspend or terminate access to the Services for breach of these Terms, non-payment, or misuse. You may cancel at any time
              through your account or by contacting us; subscription cancellations take effect at the end of the current billing period. Sections
              that by their nature should survive termination will survive (including payments owed, intellectual property, limitations of liability, and dispute terms).
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">17. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the State of Kansas, without regard to conflicts of laws principles. Except for claims that qualify
              for small-claims court, any dispute will be resolved by binding arbitration in Topeka, Kansas under the rules of the American Arbitration
              Association. You and we waive any right to a jury trial or to participate in a class action. Judgment on the award may be entered in any court with jurisdiction.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">18. Updates</h2>
            <p>
              We may modify these Terms to reflect changes in the Services, law, or business needs. Material changes will be posted on this page with
              an updated date and, when appropriate, emailed to account holders. Continued use after the effective date constitutes acceptance.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">19. Contact</h2>
            <p>
              Questions about these Terms? Contact us at {CONTACT_INFO.email} or {CONTACT_INFO.phoneDisplay}. Mail can be sent to {CONTACT_INFO.addressLine1},{" "}
              {CONTACT_INFO.cityStateZip}.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
