'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CONTACT_INFO } from '@/lib/contact-info'
import {
  ArrowRight, CheckCircle, Clock, Shield, Phone, Mail,
  ChevronDown, Loader2,
} from 'lucide-react'

const POPULAR_TRADES = [
  'Plumbing', 'Electrical', 'HVAC', 'Roofing', 'General Contracting',
  'Painting', 'Concrete', 'Fencing', 'Tree Services', 'Landscaping',
  'Drywall & Plastering', 'Flooring', 'Carpentry', 'Masonry', 'Excavation',
  'Insulation', 'Gutters', 'Pressure Washing', 'Pest Control', 'Garage Doors',
  'Windows & Doors', 'Appliance Repair', 'Waterproofing', 'Foundation Repair',
]

const YEARS_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  serviceCategories: string
  yearsInBusiness: string
  licenseNumber: string
  insuranceCarrier: string
  serviceArea: string
  coverageNotes: string
}

const EMPTY: FormState = {
  firstName: '', lastName: '', email: '', phone: '',
  companyName: '', serviceCategories: '', yearsInBusiness: '',
  licenseNumber: '', insuranceCarrier: '', serviceArea: '', coverageNotes: '',
}

export default function ContractorApplyPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])
  const [customTrade, setCustomTrade] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleTrade(trade: string) {
    setSelectedTrades(prev =>
      prev.includes(trade) ? prev.filter(t => t !== trade) : [...prev, trade]
    )
  }

  function buildCategories(): string {
    const all = [...selectedTrades]
    if (customTrade.trim()) all.push(customTrade.trim())
    return all.join(', ')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const serviceCategories = buildCategories()
    if (!serviceCategories) {
      setError('Please select or enter at least one trade.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/contractors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, serviceCategories }),
      })
      const data = await res.json()
      if (!res.ok) {
        const firstError = data.details
          ? Object.values(data.details as Record<string, string[]>)[0]?.[0]
          : data.error
        setError(firstError ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-24 lg:pt-40">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
              Application received.
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We review every application within <strong>12 hours</strong> and will follow up at{' '}
              <strong>{form.email}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Questions in the meantime? Call us at{' '}
              <a href={CONTACT_INFO.phoneHref} className="text-foreground font-medium hover:text-primary transition-colors">
                {CONTACT_INFO.phoneDisplay}
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contractors"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
              >
                Back to Contractor Info
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-12 lg:pt-40 lg:pb-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-5">
                Contractor Network
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-5 text-balance">
                Join the network.{' '}
                <span className="font-serif italic font-normal text-primary">
                  Start receiving work within 12 hours.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
                We match verified contractors with pre-scoped service requests across
                Shawnee County. No subscription fees. Your full quoted rate on every job.
                Every application is reviewed and responded to within 12 hours.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {[
                  { icon: Clock, text: '12-hour review guarantee' },
                  { icon: Shield, text: 'All trades considered' },
                  { icon: CheckCircle, text: 'No subscription fees' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Main form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal info */}
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-4">Contact information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">First name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={e => set('firstName', e.target.value)}
                          required
                          placeholder="First"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Last name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={e => set('lastName', e.target.value)}
                          required
                          placeholder="Last"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => set('email', e.target.value)}
                          required
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Phone <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          required
                          placeholder="(785) 555-0100"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business info */}
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-4">Business details</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Company name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={form.companyName}
                          onChange={e => set('companyName', e.target.value)}
                          required
                          placeholder="Acme Plumbing & Mechanical LLC"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Years in business <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            value={form.yearsInBusiness}
                            onChange={e => set('yearsInBusiness', e.target.value)}
                            required
                            className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select…</option>
                            {YEARS_OPTIONS.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">License number</label>
                        <input
                          type="text"
                          value={form.licenseNumber}
                          onChange={e => set('licenseNumber', e.target.value)}
                          placeholder="KS-XXXXXX (if applicable)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Insurance carrier</label>
                        <input
                          type="text"
                          value={form.insuranceCarrier}
                          onChange={e => set('insuranceCarrier', e.target.value)}
                          placeholder="Carrier name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Service area <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={form.serviceArea}
                          onChange={e => set('serviceArea', e.target.value)}
                          required
                          placeholder="Topeka, KS and surrounding areas"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trades */}
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-1.5">Trade(s) &amp; specialties <span className="text-red-500">*</span></h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select all that apply. Any home service trade is welcome.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {POPULAR_TRADES.map(trade => (
                        <button
                          key={trade}
                          type="button"
                          onClick={() => toggleTrade(trade)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selectedTrades.includes(trade)
                              ? 'bg-foreground text-background'
                              : 'bg-secondary text-foreground/70 hover:text-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {trade}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Other trade or specialty</label>
                      <input
                        type="text"
                        value={customTrade}
                        onChange={e => setCustomTrade(e.target.value)}
                        placeholder="e.g. Solar installation, Well pump service…"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Anything else we should know?</label>
                    <textarea
                      value={form.coverageNotes}
                      onChange={e => set('coverageNotes', e.target.value)}
                      rows={3}
                      placeholder="Certifications, specializations, crew size, availability…"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-24">
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">12-hour review</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every application is reviewed by a member of our team. You'll receive a
                    decision at the email you provide within 12 hours of submission.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">What happens next</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { step: '01', text: 'We review your application and credentials.' },
                      { step: '02', text: 'We reach out to confirm details and answer any questions.' },
                      { step: '03', text: 'Once approved, you\'re added to the active network.' },
                      { step: '04', text: 'You start receiving assignment notifications for matching work.' },
                    ].map(s => (
                      <div key={s.step} className="flex gap-3">
                        <span className="text-[10px] font-mono font-semibold text-muted-foreground mt-0.5 w-5 shrink-0">{s.step}</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground text-sm mb-4">Questions?</h3>
                  <div className="space-y-3">
                    <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      {CONTACT_INFO.email}
                    </a>
                    <a href={CONTACT_INFO.phoneHref} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      {CONTACT_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <Link
                  href="/contractors"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to contractor overview
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
