import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Users, BarChart3, Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Nexus Operations</div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-foreground hover:text-primary transition">
              Pricing
            </Link>
            <Link href="/services" className="text-foreground hover:text-primary transition">
              Services
            </Link>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Connect with Licensed Contractors
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Nexus Operations connects homeowners with trusted, licensed contractors for home improvement projects. Get bids, manage projects, and build lasting relationships.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link href="/signup?role=homeowner">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              I'm a Homeowner
            </Button>
          </Link>
          <Link href="/signup?role=contractor">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              I'm a Contractor
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 border-y border-border py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">Why Choose Nexus Operations?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Contractors',
                description: 'All contractors are licensed and verified for your peace of mind.'
              },
              {
                icon: BarChart3,
                title: 'Real-Time Tracking',
                description: 'Track your project progress and communicate directly with contractors.'
              },
              {
                icon: Users,
                title: 'Easy Bidding',
                description: 'Get competitive bids from multiple contractors instantly.'
              },
              {
                icon: CheckCircle,
                title: 'Quality Guaranteed',
                description: 'Ratings and reviews ensure quality workmanship on every project.'
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent/10 mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-16 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: '1', title: 'Post a Project', description: 'Describe your project and requirements' },
            { step: '2', title: 'Get Bids', description: 'Receive bids from qualified contractors' },
            { step: '3', title: 'Get It Done', description: 'Hire and manage your contractor' },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              </div>
              <p className="text-muted-foreground pl-16">{item.description}</p>
              {i < 2 && <div className="hidden md:block absolute top-6 left-full w-8 h-0.5 bg-border" />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of homeowners and contractors on Nexus Operations.</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Nexus Operations</h3>
              <p className="text-muted-foreground text-sm">Connecting homeowners with trusted contractors.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Homeowners</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/services" className="hover:text-foreground">Browse Services</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Contractors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground">Join Now</Link></li>
                <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Nexus Operations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
