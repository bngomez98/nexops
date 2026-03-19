import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
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
            <p className="text-muted-foreground">Last updated: January 2025</p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Information We Collect</h2>
            <p>
              When you use our services, we collect information necessary to fulfill your requests, including contact
              details, project specifications, and payment information. We only collect what's needed to deliver
              professional service.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">How We Use Your Information</h2>
            <p>
              Your information is used exclusively to coordinate services, communicate about your projects, process
              payments, and improve our offerings. We never sell or share your data with third parties for marketing
              purposes.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information. All payment processing is
              handled through secure, encrypted channels.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. Contact us at
              admin@nexusoperations.org for any privacy-related requests.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Contact</h2>
            <p>
              For questions about this privacy policy, contact us at admin@nexusoperations.org or call (913) 951-1711.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
