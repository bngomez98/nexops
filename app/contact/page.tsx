import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact | Get in Touch with Nexus Operations",
  description:
    "Reach out to Nexus Operations — whether you are a homeowner with a project, a contractor interested in joining our network, or a potential partner. Email admin@nexusoperations.org or call (913) 951-1711.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">Contact</p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                Let&apos;s talk
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you are a homeowner with a project, a property manager looking for coordination
                support, a contractor ready to join our network, or a potential partner — we respond to
                every message within one business day.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Contact info sidebar */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Direct contact</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href="mailto:admin@nexusoperations.org" className="text-sm font-medium hover:text-primary transition-colors">
                          admin@nexusoperations.org
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a href="tel:+19139511711" className="text-sm font-medium hover:text-primary transition-colors">
                          (913) 951-1711
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Business hours</p>
                        <p className="text-sm font-medium">Mon-Fri, 8:00 AM - 5:00 PM CT</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border/40">
                  <h3 className="text-sm font-semibold mb-2">Current service area</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Topeka, KS and the immediately surrounding region. We are actively expanding to
                    Lawrence, Manhattan, Salina, and Wichita based on contractor network growth.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border/40">
                  <h3 className="text-sm font-semibold mb-2">What to expect</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All inquiries receive a response within one business day. Contractor applications
                    enter our verification queue immediately. Homeowner requests submitted via the
                    platform are routed to contractors in real time.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3 p-8 rounded-xl bg-card border border-border/40">
                <h2 className="text-lg font-semibold mb-6">Send a message</h2>
                <form className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="firstName" className="text-sm font-medium">First name <span className="text-primary">*</span></label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="lastName" className="text-sm font-medium">Last name <span className="text-primary">*</span></label>
                      <Input id="lastName" placeholder="Smith" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium">Email <span className="text-primary">*</span></label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input id="phone" type="tel" placeholder="(555) 000-0000" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="type" className="text-sm font-medium">I am a... <span className="text-primary">*</span></label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select one...</option>
                      <option value="homeowner">Homeowner with a project</option>
                      <option value="commercial">Commercial property owner/manager</option>
                      <option value="contractor">Contractor interested in joining</option>
                      <option value="partner">Potential partner (real estate, insurance, etc.)</option>
                      <option value="other">Other inquiry</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-sm font-medium">Message <span className="text-primary">*</span></label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project, or what service categories you cover..."
                      rows={5}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity mt-2"
                  >
                    Send Message
                  </button>
                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to receive communications from Nexus Operations. We respect your privacy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
