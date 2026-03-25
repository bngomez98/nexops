'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ClipboardList, MapPin, Clock, ChevronRight, Plus } from 'lucide-react'

interface Request {
  id: string
  service_type: string
  urgency: string
  status: string
  created_at: string
  properties?: { address: string; city: string; state: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Submitted',   color: 'text-foreground/70', bg: 'bg-muted' },
  matched:     { label: 'Assigned',    color: 'text-primary', bg: 'bg-primary/10' },
  in_progress: { label: 'In Progress', color: 'text-primary',     bg: 'bg-primary/10' },
  completed:   { label: 'Complete',    color: 'text-foreground', bg: 'bg-muted' },
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function PMRequestsPage() {
  const router = useRouter()
  const [user, setUser]     = useState<any>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { data } = await supabase
        .from('jobs')
        .select('*, properties(address, city, state)')
        .eq('client_id', u.id)
        .order('created_at', { ascending: false })
      setRequests(data ?? [])
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
            <p className="text-[14px] text-muted-foreground mt-1">All requests across your portfolio.</p>
          </div>
          <Link href="/dashboard/property-manager/requests/new">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:opacity-90">
              <Plus className="w-4 h-4" /> New Request
            </button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center px-6">
            <ClipboardList className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold mb-1">No requests yet</p>
            <p className="text-sm text-muted-foreground mb-5">Submit requests for any property in your portfolio.</p>
            <Link href="/dashboard/property-manager/requests/new">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:opacity-90">
                <Plus className="w-4 h-4" /> New Request
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {requests.map(req => {
              const st = STATUS_MAP[req.status] ?? { label: fmt(req.status), color: 'text-muted-foreground', bg: 'bg-muted' }
              return (
                <div key={req.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[13.5px]">{fmt(req.service_type)}</p>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                      {req.properties && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.properties.city}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
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
