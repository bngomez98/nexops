'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2, Plus, Trash2, ChevronLeft, Receipt,
  AlertCircle, CheckCircle2,
} from 'lucide-react'

interface LineItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

interface Job {
  id: string
  service_type: string
  urgency: string
  properties?: { address: string; city: string }
}

const FEE_RATES: Record<string, number> = {
  routine: 0.25, urgent: 0.30, emergency: 0.35,
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

function NewInvoiceInner() {
  const router   = useRouter()
  const params   = useSearchParams()
  const jobId    = params.get('job_id')
  const [user, setUser]   = useState<{ id: string; name: string; role: string } | null>(null)
  const [job, setJob]     = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [items, setItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unit_price: 0, amount: 0 },
  ])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'contractor' })

      if (jobId) {
        const { data } = await supabase
          .from('jobs')
          .select('*, properties(address, city)')
          .eq('id', jobId)
          .eq('contractor_id', u.id)
          .single()
        if (data) setJob(data)
      }
      setLoading(false)
    }
    load()
  }, [router, jobId])

  function updateItem(idx: number, field: keyof LineItem, val: string | number) {
    setItems(prev => {
      const next = [...prev]
      const item = { ...next[idx], [field]: val }
      item.amount = item.quantity * item.unit_price
      next[idx] = item
      return next
    })
  }

  function addItem() {
    setItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0, amount: 0 }])
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const subtotal  = items.reduce((s, i) => s + i.amount, 0)
  const urgency   = job?.urgency ?? 'routine'
  const feeRate   = FEE_RATES[urgency] ?? 0.25
  const nexusFee  = Math.round(subtotal * feeRate * 100) / 100
  const total     = subtotal + nexusFee

  async function handleSubmit() {
    if (!user || !job) { setError('No job selected.'); return }
    if (items.some(i => !i.description.trim())) { setError('All line items need a description.'); return }
    setSaving(true)
    setError(null)
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id, line_items: items }),
    })
    setSaving(false)
    if (!res.ok) {
      const { error: e } = await res.json()
      setError(e ?? 'Failed to create invoice.')
    } else {
      setSuccess(true)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
        <main className="md:ml-[240px] p-5 md:p-7 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Invoice created</h1>
            <p className="text-muted-foreground text-[14px] mb-6">Your invoice has been saved as a draft.</p>
            <Link href="/dashboard/contractor/invoices">
              <Button className="h-10 px-6 text-[13.5px] font-semibold">View Invoices</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <Link href="/dashboard/contractor/invoices" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Invoices
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">New Invoice</h1>
          {job && <p className="text-[14px] text-muted-foreground mt-1">For: {fmt(job.service_type)} {job.properties && `— ${job.properties.city}`}</p>}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}

        {!job && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px] text-amber-700 mb-5">
            No job selected. Return to a job detail page to create an invoice.
          </div>
        )}

        {/* Line items */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 mb-5">
          <p className="text-[13px] font-semibold">Line Items</p>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-1">
                  {i === 0 && <Label className="text-[12px] text-muted-foreground">Description</Label>}
                  <Input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Labor / Materials" className="h-9 text-[13px]" />
                </div>
                <div className="col-span-2 space-y-1">
                  {i === 0 && <Label className="text-[12px] text-muted-foreground">Qty</Label>}
                  <Input type="number" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)} className="h-9 text-[13px]" />
                </div>
                <div className="col-span-3 space-y-1">
                  {i === 0 && <Label className="text-[12px] text-muted-foreground">Unit Price ($)</Label>}
                  <Input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)} className="h-9 text-[13px]" />
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  {i === 0 && <div className="h-[22px]" />}
                  <span className="text-[13px] font-semibold text-foreground">${item.amount.toFixed(2)}</span>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {i === 0 && <div className="h-[22px]" />}
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-primary/80 font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add line item
          </button>
        </div>

        {/* Totals */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2 mb-6">
          <div className="flex justify-between text-[13px]">
            <span className="text-muted-foreground">Subtotal (your amount)</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-muted-foreground">Nexus fee ({(feeRate * 100).toFixed(0)}% — {fmt(urgency)} rate)</span>
            <span className="font-semibold text-muted-foreground">${nexusFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-[14px] font-bold">
            <span>Client total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">The Nexus fee is added to the client invoice separately. You receive ${subtotal.toFixed(2)}.</p>
        </div>

        <Button onClick={handleSubmit} disabled={saving || !job} className="w-full h-10 text-[13.5px] font-semibold rounded-lg">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Invoice...</> : <><Receipt className="mr-2 h-4 w-4" /> Create Invoice</>}
        </Button>
      </main>
    </div>
  )
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <NewInvoiceInner />
    </Suspense>
  )
}
