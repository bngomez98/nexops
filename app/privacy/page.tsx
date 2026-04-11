import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CONTACT_INFO } from "@/lib/contact-info"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | Nexus Operations",
  description: "Privacy policy for Nexus Operations, LLC",
}

export default function PrivacyPage() {
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

          <h1 className="font-serif text-5xl font-light mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">Last updated: April 2026</p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">1. Overview</h2>
            <p>
              This Privacy Policy explains how Nexus Operations, LLC (&quot;Nexus Operations,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) collects, uses, shares, and safeguards personal information when you use our website, dashboards, and services
              (collectively, the &quot;Services&quot;). By using the Services, you agree to the practices described here. If you disagree,
              please do not use the Services.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">2. Information We Collect</h2>
            <ul className="list-disc pl-6">
              <li><strong>Account and contact data:</strong> Name, email, phone number, mailing address, company/role, and password.</li>
              <li><strong>Property and project data:</strong> Property addresses, unit numbers, access instructions, photos or videos you upload, maintenance history, preferred vendors, and notes you provide.</li>
              <li><strong>Payment data:</strong> Billing contact, payment method details, and transaction history. Card data is processed by Stripe; we do not store full card numbers.</li>
              <li><strong>Communications:</strong> Messages, call notes, and emails exchanged with us or through the platform.</li>
              <li><strong>Usage and device data:</strong> IP address, browser type, device identifiers, referring/exit pages, timestamps, and analytics about how you navigate the Services.</li>
              <li><strong>Third-party sources:</strong> Information from contractors, property managers, or publicly available sources to verify identity, licensing, or service quality.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">3. How We Use Information</h2>
            <ul className="list-disc pl-6">
              <li>Provide, maintain, and improve the Services, including dispatching contractors and tracking SLAs.</li>
              <li>Process payments, subscriptions, refunds, and invoices.</li>
              <li>Communicate about requests, schedules, status updates, changes, and support.</li>
              <li>Verify identity, licensing, and insurance where required for safety and compliance.</li>
              <li>Analyze usage to improve reliability, security, and user experience.</li>
              <li>Send service-related notices; you may opt out of non-essential marketing at any time.</li>
              <li>Comply with legal obligations and enforce our <Link href="/terms" className="text-primary underline">Terms of Service</Link>.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">4. Legal Bases (where applicable)</h2>
            <p>
              We process personal information to perform our contract with you, based on legitimate interests (such as improving and securing the Services),
              to comply with legal obligations, and with consent where required (for example, certain marketing communications).
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">5. How We Share Information</h2>
            <ul className="list-disc pl-6">
              <li><strong>Contractors and vendors:</strong> To fulfill your requests, we share relevant details (address, scope, scheduling information) with vetted contractors.</li>
              <li><strong>Service providers:</strong> With trusted vendors that host our infrastructure, provide analytics, communications, customer support, billing, and security services under confidentiality obligations.</li>
              <li><strong>Payment processors:</strong> Stripe processes payments on our behalf; their use of your data is governed by their own privacy policy.</li>
              <li><strong>Legal and safety:</strong> When required by law, subpoena, or to protect rights, safety, or property of our users, contractors, or the public.</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, financing, or sale of assets, subject to continued protection of your data.</li>
              <li>We do not sell personal information or share it with third parties for their own marketing purposes.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">6. Data Retention</h2>
            <p>
              We retain personal information for as long as needed to deliver the Services, comply with legal obligations, resolve disputes, and enforce agreements.
              When no longer needed, we delete or de-identify data consistent with our retention schedule.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">7. Security</h2>
            <p>
              We use administrative, technical, and physical safeguards designed to protect personal information, including encryption in transit, access controls,
              and vendor security reviews. No system is 100% secure; please use strong passwords and notify us promptly of suspected account compromise.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">8. Your Choices and Rights</h2>
            <ul className="list-disc pl-6">
              <li>Access, correct, or delete certain personal information by contacting us.</li>
              <li>Update communication preferences or opt out of marketing emails via the unsubscribe link.</li>
              <li>Disable cookies in your browser; some features may not function properly without them.</li>
              <li>Request a copy of your data or ask us to limit processing where applicable law provides those rights.</li>
            </ul>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to keep you signed in, remember preferences, measure usage, and improve performance.
              Third-party analytics providers may set cookies to help us understand aggregate usage; they do not receive your contact information from us for marketing.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">10. Data Location and Transfers</h2>
            <p>
              We are based in the United States and store data primarily in the U.S. If data is transferred across borders, we use appropriate safeguards permitted by law.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">11. Children</h2>
            <p>
              The Services are not directed to children under 16, and we do not knowingly collect personal information from them. If you believe a child has provided us data,
              contact us and we will delete it.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes to our practices or for legal reasons. We will post the updated version with a new effective date and, when appropriate,
              notify account holders by email or dashboard notice.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">13. Contact Us</h2>
            <p>
              To exercise your rights or ask questions, contact us at {CONTACT_INFO.email} or call {CONTACT_INFO.phoneDisplay}. You may also write to {CONTACT_INFO.addressLine1},{" "}
              {CONTACT_INFO.cityStateZip}.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
