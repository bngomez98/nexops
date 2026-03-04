import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-base bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/nexus-logo.png" alt="Nexus Operations" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">Nexus Operations</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-muted hover:text-foreground transition">How It Works</Link>
            <Link href="#services" className="text-muted hover:text-foreground transition">Services</Link>
            <Link href="#contact" className="text-muted hover:text-foreground transition">Contact</Link>
            <button className="px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <img src="/nexus-logo.png" alt="Nexus Operations" className="w-20 h-20" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Connect with <span className="text-primary">Trusted Contractors</span>
          </h1>
          <p className="text-xl text-muted mb-8 max-w-3xl mx-auto text-balance">
            Nexus Operations connects homeowners with licensed, insured contractors in Topeka, KS and surrounding regions. Claim projects directly and close deals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition">
              For Homeowners
            </button>
            <button className="px-8 py-3 border border-tertiary text-foreground font-semibold rounded-full hover:bg-tertiary/50 transition">
              For Contractors
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">How It Works</h2>
          <p className="text-center text-muted mb-16 max-w-2xl mx-auto">
            A seamless experience designed for efficiency and transparency
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-tertiary/50 border border-border rounded-lg p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 font-bold text-background">1</div>
              <h3 className="text-xl font-bold mb-3">Submit Your Project</h3>
              <p className="text-muted">Homeowners describe their project with photos, scope, and budget. Contractors review available projects in real-time.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-tertiary/50 border border-border rounded-lg p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 font-bold text-background">2</div>
              <h3 className="text-xl font-bold mb-3">Claim Your Project</h3>
              <p className="text-muted">Licensed contractors claim projects exclusively. Once claimed, the project is removed from other contractors' feeds immediately.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-tertiary/50 border border-border rounded-lg p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 font-bold text-background">3</div>
              <h3 className="text-xl font-bold mb-3">Close the Deal</h3>
              <p className="text-muted">Direct communication between parties leads to faster closures and better outcomes for everyone involved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Service Categories</h2>
          <p className="text-center text-muted mb-16 max-w-2xl mx-auto">
            We serve a wide range of professional services across the Topeka region
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Tree Removal', 'Concrete Work', 'Roofing', 'HVAC', 'Fencing', 'Electrical', 'Plumbing', 'Excavation'].map((service) => (
              <div key={service} className="bg-tertiary/50 border border-border rounded-lg p-6 hover:border-primary/50 transition">
                <p className="font-semibold text-foreground">{service}</p>
                <p className="text-sm text-muted mt-2">Available Now</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Choose Nexus Operations</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Homeowners */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                For Homeowners
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Licensed and insured contractors only</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Competitive bidding through exclusive claims</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Direct communication with contractors</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Transparent project management</span>
                </li>
              </ul>
            </div>

            {/* For Contractors */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                For Contractors
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Steady stream of qualified projects</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Exclusive project claims - no competition</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Simple verification process</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted">Growing network in Topeka region</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-tertiary/50 border border-border rounded-lg p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted mb-8 text-lg">Join Nexus Operations today and transform how you do business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition">
              Join Now
            </button>
            <button className="px-8 py-3 border border-tertiary text-foreground font-semibold rounded-full hover:bg-tertiary/50 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/nexus-logo.png" alt="Nexus Operations" className="w-6 h-6" />
                <span className="font-bold text-primary">Nexus Operations</span>
              </div>
              <p className="text-sm text-muted">Connecting homeowners and contractors in Topeka, KS</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-foreground transition">How It Works</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Services</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted">
            <p>&copy; 2026 Nexus Operations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
