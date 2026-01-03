import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, ArrowRight, CheckCircle } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block text-sm font-semibold tracking-wider text-muted-foreground mb-4 uppercase">
            Get Started
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">Submit a request</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Describe your needs and we'll respond with a plan and cost estimate during business hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2.5 rounded-lg">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">admin@nexusoperations.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2.5 rounded-lg">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">+1 (913) 951-1711</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <h4 className="font-semibold mb-4">Business Hours</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Monday - Friday: 8:00 AM - 5:00 PM</div>
                <div>Saturday - Sunday: Closed</div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <h4 className="font-semibold mb-4">Service Standards</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">Response within one business day</div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">Written cost estimates before work begins</div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">Documented processes and receipts</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="lg:col-span-3 p-8 shadow-xl border-border/50">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name *
                  </label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name *
                  </label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium">
                  Service Type *
                </label>
                <select
                  id="service"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a service...</option>
                  <option value="sourcing">Product Sourcing</option>
                  <option value="resale">Resale & Fulfillment</option>
                  <option value="coordination">Service Coordination</option>
                  <option value="project">Project Support</option>
                  <option value="hourly">On-Demand Help</option>
                  <option value="concierge">Personal Concierge</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget Range
                </label>
                <Input id="budget" placeholder="e.g., $100-500 or flexible" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  What do you need help with? *
                </label>
                <Textarea
                  id="message"
                  placeholder="Describe your goal, timeline, and any specific requirements..."
                  rows={5}
                  required
                />
              </div>

              <div className="pt-4">
                <Button className="w-full font-semibold shadow-lg hover:shadow-xl transition-shadow" size="lg">
                  Submit Request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Submitting this form does not obligate you to any service or fee.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
