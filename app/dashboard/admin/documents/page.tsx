'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, FolderOpen, CheckCircle2, AlertTriangle } from 'lucide-react'

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [user, setUser]   = useState<{ id: string; name: string; role: string } | null>(null)
  const [docs, setDocs]   = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]   = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      if (u.user_metadata?.role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })

      const { data } = await supabase
        .from('documents')
        .select('*, profiles!documents_user_id_fkey(full_name, role)')
        .order('created_at', { ascending: false })
      setDocs(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleVerify(docId: string, verified: boolean) {
    setProcessing(docId)
    const supabase = createClient()
    await supabase.from('documents').update({ verified }).eq('id', docId)
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, verified } : d))
    setProcessing(null)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  const pending   = docs.filter(d => !d.verified)
  const verified  = docs.filter(d => d.verified)

  const expiringSoon = docs.filter(d => {
    if (!d.expires_at) return false
    const days = Math.floor((new Date(d.expires_at).getTime() - Date.now()) / 86400000)
    return days >= 0 && days <= 30
  })

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Document Review</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Verify compliance documents across all contractors.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending',       value: pending.length,      color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Verified',      value: verified.length,     color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Expiring Soon', value: expiringSoon.length, color: 'text-red-500',     bg: 'bg-red-500/10' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {expiringSoon.length > 0 && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-[13px] font-semibold text-amber-700">{expiringSoon.length} documents expiring within 30 days</p>
            </div>
            <div className="space-y-1">
              {expiringSoon.map((d: Record<string, unknown>) => (
                <p key={d.id} className="text-[12px] text-amber-700">
                  {d.profiles?.full_name ?? 'Unknown'} — {fmt(d.type)} — expires {new Date(d.expires_at).toLocaleDateString()}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center p-6">
              <FolderOpen className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="font-semibold mb-1">No documents uploaded yet</p>
            </div>
          ) : docs.map((doc: Record<string, unknown>) => (
            <div key={doc.id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[13.5px]">{fmt(doc.type)}</p>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${doc.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {doc.verified ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {doc.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {doc.profiles?.full_name ?? 'Unknown'} · {fmt(doc.profiles?.role ?? 'unknown')}
                  {doc.expires_at && <> · Exp. {new Date(doc.expires_at).toLocaleDateString()}</>}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!doc.verified ? (
                  <Button onClick={() => handleVerify(doc.id, true)} disabled={processing === doc.id} size="sm" className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700">
                    {processing === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                  </Button>
                ) : (
                  <Button onClick={() => handleVerify(doc.id, false)} disabled={processing === doc.id} size="sm" variant="outline" className="h-7 px-2 text-[11px] border-red-200 text-red-600 hover:bg-red-50">
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
