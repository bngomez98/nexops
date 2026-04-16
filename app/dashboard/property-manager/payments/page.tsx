'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CreditCard, CheckCircle2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function PMPaymentsPage() {
  const router = useRouter()
  const [user, setUser]         = useState<{ id: string; name: string; role: string } | null>(null)
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]   = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { data } = await supabase.from('invoices').select('*, jobs(service_type, properties(address))').eq('client_id', u.id).order('created_at', { ascending: false })
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

  async function handlePay(invoiceId: string) {
    setPayingId(invoiceId)
    try {
      const res = await fetch('/api/stripe/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to initiate payment')
        return
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPayingId(null)
    }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  const due  = invoices.filter((i: Record<string, unknown>) => i.status === 'sent')
  const paid = invoices.filter((i: Record<string, unknown>) => i.status === 'paid')

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Pay outstanding invoices and view payment history.</p>
        </div>

        {due.length > 0 && (
          <div className="mb-6">
            <p className="text-[13px] font-semibold mb-3">Outstanding ({due.length})</p>
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {due.map((inv: Record<string, unknown>) => (
                <div key={inv.id as string} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt((inv.jobs as Record<string, unknown>).service_type as string) : 'Invoice'}</p>
                    {(inv.jobs as any)?.properties && <p className="text-[12px] text-muted-foreground">{((inv.jobs as any).properties as Record<string, unknown>).address as string}</p>}
                  </div>
                  <p className="text-[14px] font-bold flex-shrink-0">${(inv.total as number)?.toLocaleString()}</p>
                  {inv.stripe_payment_url ? (
                    <a href={inv.stripe_payment_url as string} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="h-9 px-4 text-[13px] flex-shrink-0">
                        Pay <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      className="h-9 px-4 text-[13px] flex-shrink-0"
                      disabled={payingId === (inv.id as string)}
                      onClick={() => handlePay(inv.id as string)}
                    >
                      {payingId === (inv.id as string)
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <><CreditCard className="w-3.5 h-3.5 mr-1.5" /> Pay</>
                      }
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[13px] font-semibold mb-3">Payment History ({paid.length})</p>
          {paid.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-2xl text-center">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="font-semibold mb-1">No payment history</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {paid.map((inv: Record<string, unknown>) => (
                <div key={inv.id as string} className="flex items-center gap-4 px-5 py-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{inv.jobs ? fmt((inv.jobs as Record<string, unknown>).service_type as string) : 'Invoice'}</p>
                    {(inv.jobs as any)?.properties && <p className="text-[12px] text-muted-foreground">{((inv.jobs as any).properties as Record<string, unknown>).address as string}</p>}
                  </div>
                  <p className="text-[14px] font-bold text-emerald-600">${(inv.total as number)?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
