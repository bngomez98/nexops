'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Receipt, CheckCircle2, Clock } from 'lucide-react'

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function PMInvoicesPage() {
  const router = useRouter()
  const [user, setUser]         = useState<{ id: string; name: string; role: string } | null>(null)
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { data } = await supabase.from('invoices').select('*, jobs(service_type, urgency, properties(address, city))').eq('client_id', u.id).order('created_at', { ascending: false })
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

  const totalPaid  = invoices.filter(i => (i as Record<string, unknown>).status === 'paid').reduce((s: number, i: Record<string, unknown>) => s + (i.total as number), 0)
  const totalDue   = invoices.filter(i => (i as Record<string, unknown>).status === 'sent').reduce((s: number, i: Record<string, unknown>) => s + (i.total as number), 0)

  // Spend by property
  const byProperty: Record<string, number> = {}
  invoices.filter(i => (i as Record<string, unknown>).status === 'paid').forEach((inv: Record<string, unknown>) => {
    const jobs = inv.jobs as Record<string, unknown> | undefined
    const props = jobs?.properties as Record<string, unknown> | undefined
    const addr = (props?.address as string) ?? 'Unknown'
    byProperty[addr] = (byProperty[addr] ?? 0) + (inv.total as number)
  })

  // Spend by category
  const byCategory: Record<string, number> = {}
  invoices.filter(i => (i as Record<string, unknown>).status === 'paid').forEach((inv: Record<string, unknown>) => {
    const jobs = inv.jobs as Record<string, unknown> | undefined
    const cat = (jobs?.service_type as string) ?? 'Other'
    byCategory[cat] = (byCategory[cat] ?? 0) + (inv.total as number)
  })

  const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100' },
    sent:  { label: 'Due',   color: 'text-foreground/70', bg: 'bg-muted' },
    paid:  { label: 'Paid',  color: 'text-foreground', bg: 'bg-muted' },
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Invoices & Spend</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Portfolio-level financial overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Paid', value: `$${totalPaid.toLocaleString()}`, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Amount Due', value: `$${totalDue.toLocaleString()}`,  icon: Clock,        color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Total Invoices', value: invoices.length,              icon: Receipt,       color: 'text-primary',     bg: 'bg-primary/10' },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {Object.keys(byProperty).length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[13px] font-semibold mb-3">Spend by Property</p>
              <div className="space-y-2">
                {Object.entries(byProperty).map(([addr, amt]) => (
                  <div key={addr} className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground truncate mr-3">{addr}</span>
                    <span className="font-semibold flex-shrink-0">${amt.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {Object.keys(byCategory).length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[13px] font-semibold mb-3">Spend by Trade Category</p>
              <div className="space-y-2">
                {Object.entries(byCategory).map(([cat, amt]) => (
                  <div key={cat} className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">{fmt(cat)}</span>
                    <span className="font-semibold">${amt.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl text-center"><Receipt className="w-10 h-10 text-muted-foreground mb-4" /><p className="font-semibold mb-1">No invoices yet</p></div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {invoices.map((inv: Record<string, unknown>) => {
              const st = STATUS_MAP[inv.status as string] ?? STATUS_MAP.draft
              return (
                <div key={inv.id as string} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt((inv.jobs as any).service_type) : 'Invoice'}</p>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    {(inv.jobs as any)?.properties && <p className="text-[12px] text-muted-foreground">{(inv.jobs as any).properties.address}</p>}
                    <p className="text-[12px] text-muted-foreground">{new Date(inv.created_at as string).toLocaleDateString()}</p>
                  </div>
                  <p className="text-[14px] font-bold flex-shrink-0">${(inv.total as number).toLocaleString()}</p>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
