'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ChevronLeft, AlertCircle, CheckCircle2, Building2 } from 'lucide-react'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal',  label: 'Tree Removal',  icon: '🌳' },
  { value: 'concrete-work', label: 'Concrete Work', icon: '🏗️' },
  { value: 'roofing',       label: 'Roofing',       icon: '🏠' },
  { value: 'hvac',          label: 'HVAC',          icon: '❄️' },
  { value: 'fencing',       label: 'Fencing',       icon: '🏡' },
  { value: 'electrical',    label: 'Electrical',    icon: '⚡' },
  { value: 'plumbing',      label: 'Plumbing',      icon: '🔧' },
  { value: 'excavation',    label: 'Excavation',    icon: '🚜' },
]

function PMNewRequestInner() {
  const router  = useRouter()
  const params  = useSearchParams()
  const [user, setUser]   = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [properties, setProperties] = useState<Record<string, unknown>[]>([])

  const [form, setForm] = useState({
    propertyId: params.get('property_id') ?? '',
    serviceType: '',
    urgency: 'routine',
    description: '',
    budgetCeiling: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { data } = await supabase.from('properties').select('*').eq('owner_id', u.id)
      setProperties(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSubmit() {
    if (!user) return
    if (!form.serviceType) { setError('Please select a service category.'); return }
    if (!form.propertyId) { setError('Please select a property.'); return }
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.from('jobs').insert({
      client_id: user.id,
      property_id: form.propertyId || null,
      service_type: form.serviceType,
      urgency: form.urgency,
      description: form.description || null,
      budget_ceiling: form.budgetCeiling ? parseFloat(form.budgetCeiling) : null,
      status: 'open',
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    router.push('/dashboard/property-manager/requests')
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-2xl">
        <Link href="/dashboard/property-manager/requests" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Requests
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">New Service Request</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Submit a service request for one of your managed properties.</p>
        </div>

        {error && <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-5"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

        <div className="space-y-6">
          {/* Property selector */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <p className="text-[13px] font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" /> Select Property *</p>
            {properties.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[13px] text-muted-foreground mb-3">No properties in your portfolio.</p>
                <Link href="/dashboard/property-manager/properties">
                  <Button size="sm" variant="outline" className="h-8 px-3 text-[12px]">Add a property first</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {properties.map(prop => (
                  <button key={prop.id as string} type="button" onClick={() => setForm(f => ({ ...f, propertyId: prop.id as string }))}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${form.propertyId === (prop.id as string) ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-border/80'}`}
                  >
                    <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold">{prop.address as string}</p>
                      <p className="text-[11px] text-muted-foreground">{[prop.city as string, prop.state as string].filter(Boolean).join(', ')}</p>
                    </div>
                    {form.propertyId === (prop.id as string) && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service category */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <p className="text-[13px] font-semibold">Service Category *</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SERVICE_CATEGORIES.map(cat => (
                <button key={cat.value} type="button" onClick={() => setForm(f => ({ ...f, serviceType: cat.value }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${form.serviceType === cat.value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[11px] font-semibold leading-tight text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <p className="text-[13px] font-semibold">Urgency</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'routine', label: 'Routine', desc: 'Schedule within 1–2 weeks', color: 'text-muted-foreground' },
                { value: 'urgent', label: 'Urgent', desc: 'Needed within 48–72 hours', color: 'text-amber-600' },
                { value: 'emergency', label: 'Emergency', desc: 'Needs immediate attention', color: 'text-red-600' },
              ].map(u => (
                <button key={u.value} type="button" onClick={() => setForm(f => ({ ...f, urgency: u.value }))}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${form.urgency === u.value ? 'border-primary bg-primary/10' : 'border-border hover:border-border/80'}`}
                >
                  <span className={`text-[13px] font-bold ${form.urgency === u.value ? 'text-primary' : u.color}`}>{u.label}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{u.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description & budget */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-semibold">Details</p>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Description</Label>
              <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the work needed…" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-[13px] placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Budget ceiling <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">$</span>
                <Input type="number" min="0" step="50" value={form.budgetCeiling} onChange={e => setForm(f => ({ ...f, budgetCeiling: e.target.value }))} placeholder="e.g. 2500" className="h-10 text-[13px] pl-7" />
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={saving} className="w-full h-10 text-[13.5px] font-semibold rounded-lg">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Request'}
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function PMNewRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <PMNewRequestInner />
    </Suspense>
  )
}
