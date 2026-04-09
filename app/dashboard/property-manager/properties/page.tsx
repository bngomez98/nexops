'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Building2, Plus, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  created_at: string
}

export default function PMPropertiesPage() {
  const router = useRouter()
  const [user, setUser]             = useState<{ id: string; name: string; role: string } | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading]       = useState(true)
  const [adding, setAdding]         = useState(false)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState<string | null>(null)
  const [newProp, setNewProp]       = useState({ address: '', city: '', state: 'KS', zip: '' })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { data } = await supabase.from('properties').select('*').eq('owner_id', u.id).order('created_at', { ascending: false })
      setProperties(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleAdd() {
    if (!user || !newProp.address.trim()) { setError('Address is required.'); return }
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('properties').insert({
      owner_id: user.id, address: newProp.address, city: newProp.city, state: newProp.state, zip: newProp.zip,
    }).select().single()
    if (error) { setError('Failed to add property.'); setSaving(false); return }
    setProperties(prev => [data, ...prev])
    setNewProp({ address: '', city: '', state: 'KS', zip: '' })
    setAdding(false)
    setSuccess('Property added.')
    setTimeout(() => setSuccess(null), 3000)
    setSaving(false)
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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
            <p className="text-[14px] text-muted-foreground mt-1">All properties in your managed portfolio.</p>
          </div>
          <Button onClick={() => setAdding(true)} size="sm" className="h-9 px-4 text-[13px]">
            <Plus className="w-4 h-4 mr-1.5" /> Add Property
          </Button>
        </div>

        {error && <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-5"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}
        {success && <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[13px] text-emerald-700 mb-5"><CheckCircle2 className="h-4 w-4 flex-shrink-0" /><span>{success}</span></div>}

        {adding && (
          <div className="bg-card border border-border rounded-xl p-5 mb-5 space-y-4">
            <p className="text-[13px] font-semibold">Add New Property</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1"><Label className="text-[12px]">Street address *</Label><Input value={newProp.address} onChange={e => setNewProp(p => ({ ...p, address: e.target.value }))} placeholder="123 Commerce Blvd" className="h-9 text-[13px]" /></div>
              <div className="space-y-1"><Label className="text-[12px]">City</Label><Input value={newProp.city} onChange={e => setNewProp(p => ({ ...p, city: e.target.value }))} placeholder="Topeka" className="h-9 text-[13px]" /></div>
              <div className="space-y-1"><Label className="text-[12px]">ZIP</Label><Input value={newProp.zip} onChange={e => setNewProp(p => ({ ...p, zip: e.target.value }))} placeholder="66604" className="h-9 text-[13px]" /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={saving} size="sm" className="h-9 px-4 text-[13px]">
                {saving ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Saving</> : 'Save'}
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)} size="sm" className="h-9 px-4 text-[13px]">Cancel</Button>
            </div>
          </div>
        )}

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <Building2 className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold mb-1">No properties in portfolio</p>
            <p className="text-sm text-muted-foreground mb-5">Add your managed properties to get started.</p>
            <Button onClick={() => setAdding(true)} size="sm" className="h-9 px-4 text-[13px]"><Plus className="w-4 h-4 mr-1.5" /> Add Property</Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            {properties.map(prop => (
              <Link key={prop.id} href={`/dashboard/property-manager/properties/${prop.id}`}
                className="flex items-start gap-3 px-5 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold">{prop.address}</p>
                  <p className="text-[12px] text-muted-foreground">{[prop.city, prop.state, prop.zip].filter(Boolean).join(', ')}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
