'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Receipt, DollarSign, CheckCircle2, Clock } from 'lucide-react'

interface Invoice {
  id: string
  job_id: string
  subtotal: number
  nexus_fee: number
  total: number
  status: 'draft' | 'sent' | 'paid'
  created_at: string
  jobs?: { service_type: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100' },
  sent:  { label: 'Payment Due', color: 'text-amber-700', bg: 'bg-amber-100' },
  paid:  { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-100' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function HomeownerInvoicesPage() {
  const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'homeowner' })

      const { data } = await supabase
        .from('invoices')
        .select('*, jobs(service_type)')
        .eq('client_id', u.id)
        .order('created_at', { ascending: false })
      setInvoices(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const totalDue  = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Review and pay your project invoices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Paid', value: `$${totalPaid.toLocaleString()}`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Amount Due',  value: `$${totalDue.toLocaleString()}`,  icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-500/10' },
            { label: 'Total Invoices', value: invoices.length,               icon: Receipt,       color: 'text-primary',     bg: 'bg-primary/10' },
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

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <Receipt className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold text-foreground mb-1">No invoices yet</p>
            <p className="text-sm text-muted-foreground">Invoices from your contractors will appear here.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {invoices.map(inv => {
              const st = STATUS_MAP[inv.status] ?? STATUS_MAP.draft
              return (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt(inv.jobs.service_type) : 'Invoice'}</p>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[14px] font-bold text-foreground">${inv.total.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">incl. ${inv.nexus_fee.toLocaleString()} fee</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
