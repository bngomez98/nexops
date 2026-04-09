'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Receipt, DollarSign, TrendingUp } from 'lucide-react'

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100' },
  sent:  { label: 'Sent',  color: 'text-foreground/70', bg: 'bg-muted' },
  paid:  { label: 'Paid',  color: 'text-foreground', bg: 'bg-muted' },
}

export default function AdminInvoicesPage() {
  const router = useRouter()
  const [user, setUser]         = useState<{ id: string; name: string; role: string } | null>(null)
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      if (u.user_metadata?.role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })

      const { data } = await supabase.from('invoices').select('*, jobs(service_type, urgency)').order('created_at', { ascending: false })
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

  const totalRevenue = invoices.filter(i => (i as Record<string, unknown>).status === 'paid').reduce((s: number, i: Record<string, unknown>) => s + (i.nexus_fee as number), 0)
  const totalVolume  = invoices.filter(i => (i as Record<string, unknown>).status === 'paid').reduce((s: number, i: Record<string, unknown>) => s + (i.total as number), 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Invoices & Revenue</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Platform-wide billing overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Nexus Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Total Volume', value: `$${totalVolume.toLocaleString()}`,   icon: TrendingUp,  color: 'text-primary',    bg: 'bg-primary/10' },
            { label: 'Total Invoices', value: invoices.length,                    icon: Receipt,     color: 'text-muted-foreground', bg: 'bg-muted' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}><Icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                </div>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            )
          })}
        </div>

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center">
            <Receipt className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold mb-1">No invoices yet</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {invoices.map((inv: Record<string, unknown>) => {
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
                    <p className="text-[14px] font-bold">${inv.total?.toLocaleString()}</p>
                    {inv.status === 'paid' && <p className="text-[11px] text-emerald-600">+${inv.nexus_fee?.toLocaleString()} revenue</p>}
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
