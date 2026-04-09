'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CreditCard, CheckCircle2, AlertCircle, Receipt } from 'lucide-react'
import { toast } from 'sonner'

interface Invoice {
  id: string
  job_id: string
  total: number
  subtotal: number
  nexus_fee: number
  status: string
  created_at: string
  stripe_payment_url?: string
  stripe_invoice_id?: string
  jobs?: { service_type: string; urgency: string }
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

function HomeownerPaymentsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser]         = useState<{ id: string; name: string; role: string } | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading]   = useState(true)
  const [paying, setPaying]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'homeowner' })

      const { data } = await supabase
        .from('invoices')
        .select('*, jobs(service_type, urgency)')
        .eq('client_id', u.id)
        .order('created_at', { ascending: false })
      setInvoices(data ?? [])
      setLoading(false)
    }
    load()

    // Handle return from Stripe
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      toast.success('Payment completed successfully!')
    } else if (payment === 'cancelled') {
      toast.info('Payment was cancelled.')
    }
  }, [router, searchParams])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handlePay(invoice: Invoice) {
    setPaying(invoice.id)
    try {
      // If invoice has a Stripe payment URL, redirect directly
      if (invoice.stripe_payment_url) {
        window.location.href = invoice.stripe_payment_url
        return
      }

      // Otherwise, create a Stripe checkout session for this invoice
      const res = await fetch('/api/stripe/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id, jobId: invoice.job_id }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to initiate payment')
        return
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPaying(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
    </div>
  )
  if (!user) return null

  const due  = invoices.filter(i => i.status === 'sent')
  const paid = invoices.filter(i => i.status === 'paid')
  const totalDue = due.reduce((s, i) => s + i.total, 0)
  const totalPaid = paid.reduce((s, i) => s + i.total, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Pay outstanding invoices and view payment history.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-foreground">${totalDue.toLocaleString()}</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">{due.length} invoice{due.length !== 1 ? 's' : ''} due</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600">${totalPaid.toLocaleString()}</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">{paid.length} payment{paid.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Outstanding invoices */}
        {due.length > 0 && (
          <div className="mb-6">
            <p className="text-[13px] font-semibold mb-3">Outstanding ({due.length})</p>
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {due.map(inv => (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt(inv.jobs.service_type) : 'Invoice'}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {new Date(inv.created_at).toLocaleDateString()} · ${inv.subtotal.toLocaleString()} + ${inv.nexus_fee.toLocaleString()} fee
                    </p>
                  </div>
                  <p className="text-[14px] font-bold flex-shrink-0">${inv.total.toLocaleString()}</p>
                  <button
                    onClick={() => handlePay(inv)}
                    disabled={paying === inv.id}
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold text-[12.5px] px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                  >
                    {paying === inv.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    Pay now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment history */}
        <div>
          <p className="text-[13px] font-semibold mb-3">Payment History ({paid.length})</p>
          {paid.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl text-center px-6">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="font-semibold text-foreground mb-1">No payment history</p>
              <p className="text-sm text-muted-foreground">Completed payments will appear here.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {paid.map(inv => (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt(inv.jobs.service_type) : 'Invoice'}</p>
                    <p className="text-[12px] text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="text-[14px] font-bold text-emerald-600 flex-shrink-0">${inv.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {due.length === 0 && paid.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold text-foreground mb-1">No invoices yet</p>
            <p className="text-sm text-muted-foreground">Invoices from your contractors will appear here.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function HomeownerPaymentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <HomeownerPaymentsInner />
    </Suspense>
  )
}
