import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function TermsPage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-gray">
          <h1>Terms of Service</h1>
          <p className="text-gray-500">Last updated: January 1, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using NexOps (Nexus Operations LLC), you agree to be bound by
            these Terms of Service. If you do not agree, do not use the platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            NexOps is a marketplace that connects homeowners with licensed, insured contractors
            in the Topeka, KS region. Homeowners submit project requests at no cost. Contractors
            pay a monthly membership fee to access and claim projects.
          </p>

          <h2>3. Homeowner Terms</h2>
          <p>
            Submitting a project request is free. By submitting, you represent that the
            project description, photos, and budget are accurate. NexOps does not guarantee
            that a contractor will claim your project.
          </p>

          <h2>4. Contractor Terms</h2>
          <p>
            Contractors must maintain a valid license and insurance. Membership fees are
            charged monthly. No refunds are issued for partial months. NexOps reserves the
            right to suspend accounts that receive substantiated complaints.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            NexOps is not a party to any agreement between homeowners and contractors.
            We are not responsible for the quality, safety, or completion of any work.
          </p>

          <h2>6. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Kansas. Disputes shall
            be resolved in Shawnee County, Kansas.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
