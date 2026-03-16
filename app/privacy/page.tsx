import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function PrivacyPage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-gray">
          <h1>Privacy Policy</h1>
          <p className="text-gray-500">Last updated: January 1, 2025</p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly, including name, email, phone number,
            company name, and project details. We do not sell your personal information.
          </p>

          <h2>2. How We Use Information</h2>
          <p>
            We use your information to operate the platform, match homeowners with contractors,
            process payments, and communicate with you about your account.
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            Homeowner contact information is shared only with the contractor who claims their
            project. Contractor profile information (name, company, license) is visible to
            homeowners whose projects they claim.
          </p>

          <h2>4. Security</h2>
          <p>
            We implement industry-standard security measures including HTTPS, HTTP security
            headers, and session-based authentication.
          </p>

          <h2>5. Contact</h2>
          <p>
            For privacy questions, contact us at{" "}
            <a href="mailto:privacy@nexops.com" className="text-blue-600 hover:underline">
              privacy@nexops.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
