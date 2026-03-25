'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, ShieldAlert, ShieldCheck, ShieldX, User, CheckCircle2, XCircle } from 'lucide-react'

interface Contractor {
  user_id: string
  is_verified: boolean
  trade_categories: string[]
  bio: string | null
  profiles?: { full_name: string; phone: string; photo_url: string }
  documents?: { type: string; verified: boolean; file_url: string }[]
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function AdminContractorsPage() {
  const router = useRouter()
  const [user, setUser]             = useState<any>(null)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading]       = useState(true)
  const [tab, setTab]               = useState<'pending' | 'verified' | 'all'>('pending')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      if (u.user_metadata?.role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })

      const { data } = await supabase
        .from('contractor_profiles')
        .select('*, profiles!inner(full_name, phone, photo_url), documents(type, verified, file_url)')
        .order('user_id')
      setContractors(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleVerify(contractorId: string, approve: boolean) {
    setProcessing(contractorId)
    const supabase = createClient()
    await supabase.from('contractor_profiles').update({ is_verified: approve }).eq('user_id', contractorId)
    setContractors(prev => prev.map(c => c.user_id === contractorId ? { ...c, is_verified: approve } : c))
    setProcessing(null)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  const displayed = tab === 'pending' ? contractors.filter(c => !c.is_verified)
    : tab === 'verified' ? contractors.filter(c => c.is_verified)
    : contractors

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Contractor Management</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Review and verify contractor applications.</p>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit mb-5">
          {(['pending', 'verified', 'all'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-md transition-all capitalize ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'pending' ? `Pending (${contractors.filter(c => !c.is_verified).length})` :
               t === 'verified' ? `Verified (${contractors.filter(c => c.is_verified).length})` : 'All'}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center">
            <ShieldAlert className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold mb-1">No contractors in this view</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(ct => (
              <div key={ct.user_id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-[12px] font-bold text-primary flex-shrink-0">
                      {ct.profiles?.full_name?.[0]?.toUpperCase() ?? 'C'}
                    </div>
                    <div>
                      <p className="font-semibold text-[14px]">{ct.profiles?.full_name ?? 'Unknown'}</p>
                      <p className="text-[12px] text-muted-foreground">{ct.profiles?.phone ?? 'No phone'}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(ct.trade_categories ?? []).map(cat => (
                          <span key={cat} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-foreground/70">{fmt(cat)}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${ct.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ct.is_verified ? <><ShieldCheck className="w-3 h-3" /> Verified</> : <><ShieldAlert className="w-3 h-3" /> Pending</>}
                    </span>
                  </div>
                </div>

                {ct.bio && <p className="text-[12.5px] text-muted-foreground mt-3 line-clamp-2">{ct.bio}</p>}

                {/* Documents */}
                {ct.documents && ct.documents.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ct.documents.map((doc: any, i: number) => (
                      <a key={i} href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-lg border border-border bg-secondary hover:bg-muted transition-colors"
                      >
                        {fmt(doc.type)} {doc.verified ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <ShieldAlert className="w-3 h-3 text-amber-500" />}
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  {!ct.is_verified ? (
                    <Button onClick={() => handleVerify(ct.user_id, true)} disabled={processing === ct.user_id} size="sm" className="h-8 px-3 text-[12px] bg-emerald-600 hover:bg-emerald-700">
                      {processing === ct.user_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve</>}
                    </Button>
                  ) : (
                    <Button onClick={() => handleVerify(ct.user_id, false)} disabled={processing === ct.user_id} size="sm" variant="outline" className="h-8 px-3 text-[12px] border-red-200 text-red-600 hover:bg-red-50">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
