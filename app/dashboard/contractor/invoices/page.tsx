'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Receipt, PlusCircle, ChevronRight,
  Clock, CheckCircle2, AlertCircle, DollarSign,
} from 'lucide-react'

interface Invoice {
  id: string
  job_id: string
  subtotal: number
  nexus_fee: number
  total: number
  status: 'draft' | 'sent' | 'paid'
  created_at: string
  jobs?: { service_type: string; urgency: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100' },
  sent:  { label: 'Sent',  color: 'text-amber-700', bg: 'bg-amber-100' },
  paid:  { label: 'Paid',  color: 'text-emerald-700', bg: 'bg-emerald-100' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function ContractorInvoicesPage() {
  const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      const { data } = await supabase
        .from('invoices')
        .select('*, jobs(service_type, urgency)')
        .eq('contractor_id', u.id)
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

  const totalEarned = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.subtotal, 0)
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.subtotal, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
            <p className="text-[14px] text-muted-foreground mt-1">Track your submitted invoices and payment status.</p>
          </div>
          <Link href="/dashboard/contractor/invoices/new">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              <PlusCircle className="w-4 h-4" /> New Invoice
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Earned', value: `$${totalEarned.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Pending Payment', value: `$${totalPending.toLocaleString()}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Total Invoices', value: invoices.length, icon: Receipt, color: 'text-primary', bg: 'bg-primary/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            )
          })}
        </div>

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No invoices yet</p>
            <p className="text-sm text-muted-foreground mb-5">Create your first invoice from a completed job.</p>
            <Link href="/dashboard/contractor/invoices/new">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90">
                <PlusCircle className="w-4 h-4" /> Create Invoice
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {invoices.map(inv => {
              const st = STATUS_MAP[inv.status] ?? STATUS_MAP.draft
              return (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt(inv.jobs.service_type) : 'Invoice'}</p>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[14px] font-bold text-foreground">${inv.subtotal.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">+ ${inv.nexus_fee.toLocaleString()} fee</p>
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
