import Link from 'next/link'
import Image from 'next/image'

const services = [
  'Tree Removal',
  'Concrete Work',
  'Roofing',
  'HVAC',
  'Fencing',
  'Electrical',
  'Plumbing',
  'Excavation',
]

const homeownerBenefits = [
  'Licensed and insured contractors only',
  'Exclusive project claims mean focused attention',
  'Direct communication with your contractor',
  'Full project documentation from the start',
]

const contractorBenefits = [
  'Steady stream of qualified projects',
  'Exclusive claims — no bidding wars',
  'Simple license and insurance verification',
  'Growing regional network in Topeka, KS',
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-lg font-bold text-[var(--color-primary)] tracking-tight">
              Nexus Operations
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">
              How It Works
            </Link>
            <Link href="#services" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">
              Services
            </Link>
            <Link href="#contact" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">
              Contact
            </Link>
            <button className="px-5 py-2 text-sm bg-[var(--color-primary)] text-[var(--color-background)] font-semibold rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={88}
              height={88}
              priority
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            Connect with{' '}
            <span className="text-[var(--color-primary)]">Trusted Contractors</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-subtle)] mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            Nexus Operations connects homeowners with licensed, insured contractors across Topeka, KS and the surrounding region. Submit your project and get matched directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[var(--color-primary)] text-[var(--color-background)] font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              For Homeowners
            </button>
            <button className="px-8 py-3 border border-[var(--color-border)] text-[var(--color-foreground)] font-semibold rounded-full hover:bg-[var(--color-surface-raised)] transition-colors">
              For Contractors
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-3 text-center">How It Works</h2>
          <p className="text-center text-[var(--color-subtle)] mb-16 max-w-xl mx-auto leading-relaxed">
            Fast, direct, and transparent — from project submission to completion
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Submit Your Project',
                body: 'Homeowners submit their project with photos, a written scope, and a maximum budget. No guesswork.',
              },
              {
                step: '2',
                title: 'Contractor Claims It',
                body: 'A licensed, insured contractor claims your project exclusively. Once claimed, it disappears from all other feeds.',
              },
              {
                step: '3',
                title: 'Work Gets Done',
                body: 'Direct communication from day one. No middlemen, no delays — just the homeowner and contractor aligned on the job.',
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl p-8"
              >
                <div className="w-11 h-11 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mb-5 font-bold text-[var(--color-background)] text-lg">
                  {step}
                </div>
                <h3 className="text-lg font-bold mb-3">{title}</h3>
                <p className="text-[var(--color-subtle)] leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-3 text-center">Service Categories</h2>
          <p className="text-center text-[var(--color-subtle)] mb-16 max-w-xl mx-auto leading-relaxed">
            We cover a wide range of home and commercial services across the Topeka region
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary)] transition-colors"
              >
                <p className="font-semibold text-[var(--color-foreground)]">{service}</p>
                <p className="text-xs text-[var(--color-subtle)] mt-2 uppercase tracking-wide">Available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Nexus Operations</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full flex-shrink-0" />
                For Homeowners
              </h3>
              <ul className="space-y-4">
                {homeownerBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[var(--color-primary)] font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span className="text-[var(--color-subtle)] leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full flex-shrink-0" />
                For Contractors
              </h3>
              <ul className="space-y-4">
                {contractorBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[var(--color-primary)] font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span className="text-[var(--color-subtle)] leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Ready to Get Started?</h2>
          <p className="text-[var(--color-subtle)] mb-8 text-lg leading-relaxed">
            Join Nexus Operations and transform how projects get done in your region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[var(--color-primary)] text-[var(--color-background)] font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Join Now
            </button>
            <button className="px-8 py-3 border border-[var(--color-border)] text-[var(--color-foreground)] font-semibold rounded-full hover:bg-[var(--color-surface-raised)] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/nexus-logo.png" alt="Nexus Operations" width={22} height={22} />
                <span className="font-bold text-[var(--color-primary)] text-sm">Nexus Operations</span>
              </div>
              <p className="text-xs text-[var(--color-subtle)] leading-relaxed">
                Connecting homeowners and contractors across Topeka, KS
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--color-subtle)]">
                <li><Link href="#how-it-works" className="hover:text-[var(--color-foreground)] transition-colors">How It Works</Link></li>
                <li><Link href="#services" className="hover:text-[var(--color-foreground)] transition-colors">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--color-subtle)]">
                <li><Link href="#" className="hover:text-[var(--color-foreground)] transition-colors">About</Link></li>
                <li><Link href="#contact" className="hover:text-[var(--color-foreground)] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--color-subtle)]">
                <li><Link href="#" className="hover:text-[var(--color-foreground)] transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[var(--color-foreground)] transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--color-border)] pt-8 text-center text-xs text-[var(--color-subtle)]">
            <p>&copy; 2026 Nexus Operations. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
