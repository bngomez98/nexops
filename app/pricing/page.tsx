import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>
      </header>

      {/* Pricing for Homeowners */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground mb-12">For Homeowners</h2>
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-8 text-center max-w-md">
          <div className="text-5xl font-bold text-foreground mb-2">Free</div>
          <p className="text-muted-foreground mb-8">Forever free for homeowners</p>
          <ul className="space-y-4 text-left mb-8">
            {[
              'Post unlimited project requests',
              'Receive bids from contractors',
              'Real-time project tracking',
              'Direct messaging with contractors',
              'Project history and reviews',
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup?role=homeowner">
            <Button size="lg" className="w-full">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing for Contractors */}
      <section className="bg-muted/30 border-y border-border py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12">For Contractors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="border border-border rounded-lg p-8 bg-background hover:shadow-lg transition-all">
              <div className="text-2xl font-bold text-foreground mb-2">Free Trial</div>
              <div className="text-muted-foreground mb-8">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month (30 days)</span>
              </div>
              <ul className="space-y-4 text-left mb-8">
                {[
                  'Up to 3 active projects',
                  'Browse available projects',
                  'Basic contractor profile',
                  'Email support',
                  'Limited to 1 location',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=contractor">
                <Button variant="outline" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Professional Tier */}
            <div className="border-2 border-accent rounded-lg p-8 bg-accent/5 hover:shadow-lg transition-all relative">
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">Professional</div>
              <div className="text-muted-foreground mb-8">
                <span className="text-3xl font-bold text-foreground">$299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 text-left mb-8">
                {[
                  'Up to 5 active projects',
                  'Priority project access',
                  'Advanced contractor profile',
                  'Phone & email support',
                  'Analytics dashboard',
                  'Multiple locations',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=contractor">
                <Button className="w-full">
                  Upgrade to Professional
                </Button>
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="border border-border rounded-lg p-8 bg-background hover:shadow-lg transition-all">
              <div className="text-2xl font-bold text-foreground mb-2">Enterprise</div>
              <div className="text-muted-foreground mb-8">
                <span className="text-3xl font-bold text-foreground">$749</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 text-left mb-8">
                {[
                  'Up to 15 active projects',
                  'Exclusive project access',
                  'White-label profile option',
                  '24/7 dedicated support',
                  'Advanced analytics',
                  'Unlimited locations',
                  'Team management',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=contractor">
                <Button variant="outline" className="w-full">
                  Upgrade to Enterprise
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {[
            {
              q: 'Can I cancel my subscription anytime?',
              a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
            },
            {
              q: 'Do you offer discounts for annual billing?',
              a: 'Contact our sales team for information about annual billing discounts and custom plans.',
            },
            {
              q: 'What happens if I exceed my active project limit?',
              a: 'You can still view and manage projects, but you cannot claim new projects until you complete or close existing ones.',
            },
            {
              q: 'Is there a contract requirement?',
              a: 'No, all our plans are month-to-month with no long-term contracts required.',
            },
          ].map((item, i) => (
            <div key={i} className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join Nexus Operations?</h2>
          <p className="text-lg mb-8 opacity-90">Get started today with no credit card required.</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
