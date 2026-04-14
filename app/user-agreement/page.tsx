import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CONTACT_INFO } from "@/lib/contact-info"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "User Agreement",
  description: "Nexus Operations user agreement governing the use of the platform by homeowners, property managers, and contractors.",
}

export default function UserAgreementPage() {
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

          <h1 className="font-serif text-5xl font-light mb-2">User Agreement</h1>
          <p className="text-muted-foreground mb-12">Last updated: April 2026</p>

          <div className="prose prose-lg max-w-none space-y-10">

            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By creating an account on Nexus Operations (&quot;Platform&quot;), you agree to be bound by this User
                Agreement, our <Link href="/terms" className="text-primary underline">Terms of Service</Link>, and our{" "}
                <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>. If you do not agree to
                these terms, you may not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You must provide accurate, current, and complete information during registration. You are responsible
                for maintaining the confidentiality of your account credentials and for all activities that occur under
                your account.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must be at least 18 years of age to create an account.</li>
                <li>Each person may maintain only one active account.</li>
                <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                <li>Nexus Operations reserves the right to suspend or terminate accounts that violate these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Platform Roles</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Nexus Operations coordinates work between homeowners/property managers (clients) and contractors. We do not
                provide licensed trade services ourselves; we vet and dispatch independent contractors to perform the work.
                Each user type agrees to the obligations below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Homeowner &amp; Property Manager Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As a homeowner or property manager using the Platform, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate property information and service request details.</li>
                <li>Ensure that a responsible adult is available for contractor access at scheduled times.</li>
                <li>Pay invoices in a timely manner as outlined in our payment terms.</li>
                <li>Provide a safe working environment for all contractors dispatched to your property.</li>
                <li>Not solicit contractors identified through the Platform for work outside the Platform for a period of 12 months following introduction.</li>
                <li>Notify Nexus promptly of quality concerns so we can coordinate remediation with the contractor.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Contractor Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As a contractor using the Platform, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Maintain all required licenses, insurance, and certifications for your trade(s).</li>
                <li>Respond to job notifications within the timeframes specified by the service level agreement.</li>
                <li>Provide accurate quotes and complete work to a professional standard.</li>
                <li>Provide photographic documentation of work before and after completion.</li>
                <li>Comply with all applicable local, state, and federal laws and regulations.</li>
                <li>Not misrepresent your qualifications, experience, or credentials.</li>
                <li>Use the Platform to communicate status updates and closeout documentation for every job.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Service Requests &amp; Scheduling</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Clients submit requests with property details, scope, and urgency tier. Nexus assigns contractors based on
                trade, availability, and service level agreements. Access instructions must be accurate; missed appointments
                or site inaccessibility may require rescheduling and may be billable. Emergency requests may be routed to
                the first available qualified contractor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Subscription Plans &amp; Billing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Paid subscriptions are billed on a recurring basis. By subscribing to a paid plan, you authorize
                Nexus Operations to charge your payment method on a recurring basis until cancellation.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Monthly Plan:</strong> $79/month, billed each calendar month. Cancel any time.</li>
                <li><strong>Annual Plan:</strong> $59/month, billed as $708/year. Cancellation takes effect at end of billing period.</li>
                <li>Refunds for annual subscriptions are available within 14 days of initial purchase only.</li>
                <li>Price changes will be communicated at least 30 days in advance.</li>
                <li>All payments are processed securely by Stripe. Nexus Operations does not store card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Invoices, Disputes &amp; Adjustments</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Standard invoices are due upon receipt unless stated otherwise in a statement of work. Disputes must be
                submitted in writing within 10 days of invoice delivery with documentation. Undisputed amounts remain payable.
                If on-site findings materially change scope, a revised quote will be provided for approval before continuation
                unless you authorize a pre-set emergency ceiling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Platform for any unlawful purpose or in violation of any applicable law.</li>
                <li>Submit false, misleading, or fraudulent service requests or work reports.</li>
                <li>Harass, threaten, or intimidate other users.</li>
                <li>Attempt to circumvent payment through the Platform.</li>
                <li>Reverse engineer, scrape, or copy any portion of the Platform.</li>
                <li>Share account credentials with unauthorized individuals.</li>
                <li>Upload malicious code, interfere with security features, or attempt unauthorized access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Documentation, Photos &amp; Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Photos, notes, and job records uploaded to the Platform are used to coordinate work, validate completion,
                and maintain audit history. You grant Nexus Operations a non-exclusive right to store and use this
                documentation to operate and improve the Services, subject to our <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on the Platform, including text, graphics, logos, and software, is owned by or licensed
                to Nexus Operations and is protected by applicable intellectual property laws. You may not reproduce,
                distribute, or create derivative works without our express written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Ratings and Quality</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Nexus monitors quality through completion photos, SLA performance, and client feedback. We may prioritize
                or de-prioritize contractors based on performance and may remove content that is abusive or irrelevant.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                In the event of a dispute between users or between a user and Nexus Operations, we encourage resolution
                through our support channels first. Unresolved disputes will be subject to binding arbitration in
                Topeka, Kansas under the rules of the American Arbitration Association.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Nexus Operations shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of the Platform. Our
                total liability shall not exceed the amounts paid by you in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">15. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to update this User Agreement at any time. Material changes will be communicated
                via email or prominent notice on the Platform at least 14 days before taking effect. Continued use
                of the Platform after changes constitutes acceptance of the updated agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">16. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may suspend or terminate access for violations of this Agreement, non-payment, or misuse of the
                Platform. You may close your account at any time. Sections intended to survive termination (including
                payment obligations, documentation rights, disclaimers, and dispute terms) will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">17. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this User Agreement, please contact us:
              </p>
              <div className="mt-4 p-5 rounded-xl bg-card border border-border">
                <p className="font-semibold">{CONTACT_INFO.companyName}</p>
                <p className="text-muted-foreground">{CONTACT_INFO.addressLine1}</p>
                <p className="text-muted-foreground">{CONTACT_INFO.cityStateZip}</p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline block mt-2">
                  {CONTACT_INFO.email}
                </a>
                <a href={CONTACT_INFO.phoneHref} className="text-primary hover:underline block">
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
