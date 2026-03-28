import Link from 'next/link'
import { Shield, Users, Wrench, CheckCircle, ArrowRight, Building2, Home, HardHat } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0f1e36] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#3b82f6]" />
          <span className="text-xl font-bold tracking-tight">Nexus Operations</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="text-sm bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-20 max-w-5xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3b82f6] mb-6 px-3 py-1 border border-[#3b82f6]/40 rounded-full">
          Topeka&apos;s Premier Operations Platform
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance mb-6">
          One contractor.
          <br />
          <span className="text-[#3b82f6]">Exclusively yours.</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 text-pretty">
          Nexus Operations connects homeowners, property managers, and contractors on a single professional platform — with role-based dashboards, real-time job tracking, and secure document management.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/auth/sign-up"
            className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Create your account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Role cards */}
      <section className="px-8 pb-24 max-w-5xl mx-auto">
        <p className="text-center text-slate-400 text-sm uppercase tracking-widest font-medium mb-10">Built for every stakeholder</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
            <Home className="w-8 h-8 text-[#3b82f6] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Homeowners</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Request services, track job progress, review invoices, and communicate with your dedicated contractor — all from one dashboard.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
            <Building2 className="w-8 h-8 text-[#3b82f6] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Property Managers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Oversee multiple properties, assign contractors, manage work orders, and keep your portfolio running without the chaos.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
            <HardHat className="w-8 h-8 text-[#3b82f6] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Contractors</h3>
            <p className="text-slate-400 text-sm leading-relaxed">View only your assigned jobs, update statuses in real time, manage your schedule, and grow your professional reputation.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14 text-balance">Everything you need to run operations</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: Shield, title: 'Role-Based Access', desc: "Homeowners, property managers, and contractors each see only what's relevant to them." },
            { icon: CheckCircle, title: 'Real-Time Job Tracking', desc: 'From request to completion, every status update is visible to the right people instantly.' },
            { icon: Users, title: 'Secure Profiles', desc: 'Upload a profile photo, manage your credentials, and build trust with every stakeholder.' },
            { icon: Wrench, title: 'Work Order Management', desc: 'Create, assign, prioritize, and close jobs — with full audit history built in.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 bg-[#1e3a8a]/60 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-balance">Ready to take control of your operations?</h2>
        <p className="text-slate-400 mb-8 text-pretty">Join Nexus Operations and get your team working from a single source of truth.</p>
        <Link
          href="/auth/sign-up"
          className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-md font-semibold transition-colors"
        >
          Create your free account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#3b82f6]" />
          <span className="font-semibold text-slate-300">Nexus Operations</span>
        </div>
        <p>© {new Date().getFullYear()} Nexus Operations. Topeka, KS. All rights reserved.</p>
      </footer>
    </main>
  )
}
