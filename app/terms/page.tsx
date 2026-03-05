import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms of Service | Nexus Operations",
  description: "Terms of Service for Nexus Operations contractor matching platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: March 5, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using Nexus Operations (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Description of Service</h2>
            <p className="mt-2">
              Nexus Operations is a contractor matching platform that connects property owners with licensed, insured, and verified contractors. The Platform facilitates exclusive project assignment—one contractor per project request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. User Eligibility</h2>
            <p className="mt-2">
              You must be at least 18 years of age to use this Platform. By using the Platform, you represent and warrant that you have the legal capacity to enter into a binding agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Homeowner Responsibilities</h2>
            <p className="mt-2">
              Homeowners agree to provide accurate project information, including photographs, scope of work, and budget parameters. Homeowners understand that project submissions will be shared with a single verified contractor for the purpose of scheduling a consultation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Contractor Responsibilities</h2>
            <p className="mt-2">
              Contractors agree to maintain valid licenses, insurance, and certifications as required by their trade and jurisdiction. Contractors agree to respond to claimed projects within 24 hours and to conduct themselves professionally in all interactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. No Guarantee of Work</h2>
            <p className="mt-2">
              Nexus Operations facilitates introductions between property owners and contractors. The Platform does not guarantee that any project will result in a contract, nor does it guarantee the quality of work performed by contractors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Payment Terms</h2>
            <p className="mt-2">
              The Platform is free for homeowners. Contractors pay a monthly membership fee as described in their membership agreement. All payments are non-refundable except as expressly stated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="mt-2">
              Nexus Operations is not liable for any damages arising from the use of the Platform, including but not limited to direct, indirect, incidental, or consequential damages. Our liability is limited to the amount paid to us in the twelve months preceding any claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Indemnification</h2>
            <p className="mt-2">
              You agree to indemnify and hold harmless Nexus Operations, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Modifications</h2>
            <p className="mt-2">
              We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Governing Law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of the State of Kansas. Any disputes shall be resolved in the courts of Shawnee County, Kansas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
            <p className="mt-2">
              For questions about these Terms, contact us at{" "}
              <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">
                admin@nexusoperations.org
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <Link href="/" className="text-sm text-primary hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
