'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, MapPin, Zap, Clock, ChevronLeft,
  Phone, CheckCircle2, CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Job {
  id: string
  service_type: string
  urgency: string
  description: string
  status: string
  budget_ceiling: number | null
  created_at: string
  properties?: { address: string; city: string; state: string; zip: string }
  contractor_profile?: { full_name: string; phone: string; photo_url: string; bio: string }
}

const STATUS_STEPS = [
  { key: 'open',            label: 'Submitted' },
  { key: 'matched',         label: 'Contractor Assigned' },
  { key: 'in_progress',     label: 'In Progress' },
  { key: 'pending_invoice', label: 'Invoice Pending' },
  { key: 'completed',       label: 'Complete' },
]

const URGENCY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  routine:   { label: 'Routine',   color: 'text-foreground/70', bg: 'bg-muted' },
  urgent:    { label: 'Urgent',    color: 'text-foreground/70', bg: 'bg-muted' },
  emergency: { label: 'Emergency', color: 'text-red-700',   bg: 'bg-red-100' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function HomeownerRequestDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [user, setUser]   = useState<{ id: string; name: string; role: string } | null>(null)
  const [job, setJob]     = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [invoice, setInvoice] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'homeowner' })

      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          properties(address, city, state, zip),
          contractor_profile:profiles!jobs_contractor_id_fkey(full_name, phone, photo_url)
        `)
        .eq('id', id)
        .eq('client_id', u.id)
        .single()

      if (!data) { router.push('/dashboard/homeowner/requests'); return }
      setJob(data)

      // Load invoice if exists
      const { data: inv } = await supabase
        .from('invoices')
        .select('*')
        .eq('job_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (inv) setInvoice(inv)

      setLoading(false)
    }
    load()
  }, [router, id])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user || !job) return null

  const urg      = URGENCY_MAP[job.urgency] ?? URGENCY_MAP.routine
  const stepIdx  = STATUS_STEPS.findIndex(s => s.key === job.status)
  const assigned = ['matched', 'in_progress', 'pending_invoice', 'completed'].includes(job.status)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <Link href="/dashboard/homeowner/requests" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Requests
        </Link>

        <div className="space-y-5">
          {/* Header */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-bold">{fmt(job.service_type)}</h1>
                <p className="text-[13px] text-muted-foreground mt-0.5">Request #{job.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${urg.bg} ${urg.color}`}>
                <Zap className="w-3 h-3" /> {urg.label}
              </span>
            </div>

            <div className="space-y-2 text-[13px] text-muted-foreground mb-4">
              {job.properties && (
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.properties.address}, {job.properties.city}, {job.properties.state}</p>
              )}
              <p className="flex items-center gap-2"><Clock className="w-4 h-4" />{new Date(job.created_at).toLocaleDateString()}</p>
            </div>

            {job.description && (
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-[13px] text-foreground">{job.description}</p>
              </div>
            )}
          </div>

          {/* Progress timeline */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[13px] font-semibold mb-4">Progress</p>
            <div className="space-y-3">
              {STATUS_STEPS.map((step, i) => {
                const done   = i <= stepIdx
                const active = i === stepIdx
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold border-2 ${
                      done && !active ? 'bg-primary border-primary text-primary-foreground' :
                      active         ? 'border-primary text-primary bg-primary/10' :
                      'border-border text-muted-foreground'
                    }`}>
                      {done && !active ? '✓' : i + 1}
                    </div>
                    <span className={`text-[13px] ${active ? 'text-primary font-semibold' : done ? 'text-foreground/60' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Assigned contractor */}
          {assigned && job.contractor_profile && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[13px] font-semibold mb-3">Your Contractor</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-[14px] font-bold text-primary">
                  {job.contractor_profile.full_name?.[0]?.toUpperCase() ?? 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px]">{job.contractor_profile.full_name}</p>
                  {job.contractor_profile.phone && (
                    <p className="text-[12px] text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{job.contractor_profile.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Invoice */}
          {invoice && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[13px] font-semibold mb-3">Invoice</p>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">${invoice.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Nexus fee</span><span className="font-semibold">${invoice.nexus_fee.toLocaleString()}</span></div>
                <div className="flex justify-between border-t border-border pt-2"><span className="font-bold">Total</span><span className="font-bold">${invoice.total.toLocaleString()}</span></div>
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    invoice.status === 'sent' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {invoice.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : null}
                    {fmt(invoice.status)}
                  </span>
                </div>
                {invoice.status === 'sent' && (
                  <Link href="/dashboard/homeowner/payments">
                    <Button size="sm" className="mt-2 h-9 px-4 text-[13px]">
                      <CreditCard className="w-3.5 h-3.5 mr-2" /> Pay Invoice
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
