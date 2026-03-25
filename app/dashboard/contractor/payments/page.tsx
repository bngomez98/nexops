'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, DollarSign, CreditCard, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContractorPaymentsPage() {
  const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null)
  const [stats, setStats]       = useState({ totalPaid: 0, pendingPayout: 0, invoiceCount: 0 })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      const { data: cp } = await supabase
        .from('contractor_profiles')
        .select('stripe_account_id')
        .eq('user_id', u.id)
        .single()
      if (cp?.stripe_account_id) setStripeAccountId(cp.stripe_account_id)

      const { data: invoices } = await supabase
        .from('invoices')
        .select('subtotal, status')
        .eq('contractor_id', u.id)
      const paid    = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + i.subtotal, 0) ?? 0
      const pending = invoices?.filter(i => i.status === 'sent').reduce((s, i) => s + i.subtotal, 0) ?? 0
      setStats({ totalPaid: paid, pendingPayout: pending, invoiceCount: invoices?.length ?? 0 })
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handleStripeConnect() {
    const res = await fetch('/api/stripe/connect/onboard', { method: 'POST' })
    if (res.ok) {
      const { url } = await res.json()
      if (url) window.location.href = url
    }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Stripe Connect payout history and account status.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Earned', value: `$${stats.totalPaid.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Pending Payout', value: `$${stats.pendingPayout.toLocaleString()}`, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Total Invoices', value: stats.invoiceCount, icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}><Icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[14px] font-semibold">Stripe Connect</p>
              <p className="text-[12px] text-muted-foreground">{stripeAccountId ? 'Account connected' : 'Not connected'}</p>
            </div>
            <div className="ml-auto">
              {stripeAccountId ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Connected</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground/70">Not Connected</span>
              )}
            </div>
          </div>

          {!stripeAccountId ? (
            <div>
              <p className="text-[13px] text-muted-foreground mb-4">Connect your Stripe account to receive payouts when clients pay invoices.</p>
              <Button onClick={handleStripeConnect} className="h-10 px-5 text-[13.5px] font-semibold">
                Connect Stripe Account
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-[13px] text-muted-foreground mb-4">Your Stripe Express account is connected. View your payout history and balance in the Stripe dashboard.</p>
              <a
                href="https://connect.stripe.com/express_login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Open Stripe Dashboard <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
