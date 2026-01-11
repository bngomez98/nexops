import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Contact Us | Nexus Operations",
  description: "Get in touch with Nexus Operations. Same-day response guaranteed for all inquiries.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
