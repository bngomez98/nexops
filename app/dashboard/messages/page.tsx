'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { MessageSquare } from 'lucide-react'

interface Conversation {
  job_id: string
  job_title: string
  other_user_name: string
  last_message: string
  last_message_at: string
  unread_count: number
}

interface User {
  id: string
  name: string
  email: string
  role: 'homeowner' | 'contractor' | 'property-manager' | 'admin'
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      if (!res.ok) return
      const data = await res.json() as { conversations: Conversation[] }
      setConversations(data.conversations ?? [])
    } catch (err) {
      console.error(err)
      // network error — keep existing state
    }
  }, [])

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const { user: me } = await res.json() as { user: User }
        setUser(me)
        await loadConversations()
      } catch (err) {
        console.error(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, loadConversations])

  // Poll every 30s for new messages
  useEffect(() => {
    if (!user) return
    const interval = setInterval(loadConversations, 30_000)
    return () => clearInterval(interval)
  }, [user, loadConversations])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role={user.role} onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your conversations about active projects</p>
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Messages between homeowners and contractors will appear here once a project is claimed.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            {conversations.map(conv => (
              <Link
                key={conv.job_id}
                href={`/dashboard/messages/${conv.job_id}`}
                className="flex items-start gap-4 px-5 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{conv.other_user_name}</p>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {timeAgo(conv.last_message_at)}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{conv.job_title}</p>
                  <p className="text-[13px] text-foreground/70 truncate mt-1">{conv.last_message}</p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="flex-shrink-0 mt-1 min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1.5">
                    {conv.unread_count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
