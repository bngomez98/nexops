import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Privacy Policy | Nexus Operations",
  description: "Privacy Policy for Nexus Operations contractor matching platform.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: March 5, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-2">
              We collect information you provide directly, including: name, email address, phone number, property address, project details, photographs, and budget information. For contractors, we also collect business information, license numbers, and insurance documentation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-2">
              We use your information to: match homeowners with appropriate contractors, facilitate consultations, process payments, communicate service updates, and improve our platform. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Information Sharing</h2>
            <p className="mt-2">
              Project details submitted by homeowners are shared with a single matched contractor for the purpose of scheduling and conducting consultations. We do not share your information with multiple contractors or lead aggregators.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures to protect your information, including encryption in transit and at rest. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Cookies and Tracking</h2>
            <p className="mt-2">
              We use cookies and similar technologies to improve user experience, analyze platform usage, and deliver relevant content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Third-Party Services</h2>
            <p className="mt-2">
              We use third-party services for payment processing, analytics, and customer support. These services have their own privacy policies governing their use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Data Retention</h2>
            <p className="mt-2">
              We retain your information for as long as necessary to provide services and comply with legal obligations. You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Your Rights</h2>
            <p className="mt-2">
              You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Children&apos;s Privacy</h2>
            <p className="mt-2">
              Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on our website with a new effective date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Contact Us</h2>
            <p className="mt-2">
              For privacy-related inquiries, contact us at:{" "}
              <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">
                admin@nexusoperations.org
              </a>
            </p>
            <p className="mt-2">
              Nexus Operations, LLC<br />
              405 SW Fillmore St<br />
              Topeka, KS 66606
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
