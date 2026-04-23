'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  job_id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read_at: string | null
}

interface User {
  id: string
  name: string
  email: string
  role: 'homeowner' | 'contractor' | 'property-manager' | 'admin'
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function ConversationPage() {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [jobTitle, setJobTitle] = useState('Project')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')
  const [recipientId, setRecipientId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/${jobId}`)
      if (!res.ok) return
      const data = await res.json() as { messages: Message[]; jobTitle: string }
      setMessages(data.messages ?? [])
      setJobTitle(data.jobTitle ?? 'Project')
    } catch (err) {
      console.error(err)
      // network error — keep existing state
    }
  }, [jobId])

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const { user: me } = await res.json() as { user: User }
        setUser(me)
        const msgRes = await fetch(`/api/messages/${jobId}`)
        if (msgRes.ok) {
          const data = await msgRes.json() as { messages: Message[]; jobTitle: string }
          const msgs = data.messages ?? []
          setMessages(msgs)
          setJobTitle(data.jobTitle ?? 'Project')
          // Determine recipient: pick the other participant from the first message
          const first = msgs[0]
          if (first) {
            setRecipientId(first.sender_id === me.id ? first.recipient_id : first.sender_id)
          }
        }
      } catch (err) {
        console.error(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, jobId])

  // Auto-scroll when messages load
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Poll every 10s for new messages
  useEffect(() => {
    if (!user) return
    const interval = setInterval(loadMessages, 10_000)
    return () => clearInterval(interval)
  }, [user, loadMessages])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function sendMessage() {
    if (!content.trim() || !recipientId || sending) return
    setSending(true)
    const text = content.trim()
    setContent('')
    try {
      const res = await fetch(`/api/messages/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, recipient_id: recipientId }),
      })
      if (res.ok) {
        const data = await res.json() as { message: Message }
        setMessages(prev => [...prev, data.message])
      }
    } catch (err) {
      console.error(err)
      setContent(text) // restore on failure
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  // Group messages by date for display dividers
  const grouped: Array<{ date: string; msgs: Message[] }> = []
  for (const msg of messages) {
    const label = formatDate(msg.created_at)
    const last = grouped[grouped.length - 1]
    if (last?.date === label) {
      last.msgs.push(msg)
    } else {
      grouped.push({ date: label, msgs: [msg] })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav userName={user.name} role={user.role} onLogout={handleLogout} />
      <div className="md:ml-[240px] flex flex-col flex-1" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-card flex-shrink-0">
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-border" />
          <div>
            <p className="text-sm font-semibold text-foreground">{jobTitle}</p>
            <p className="text-[11px] text-muted-foreground">Project conversation</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-muted-foreground">No messages yet. Start the conversation below.</p>
            </div>
          ) : (
            grouped.map(group => (
              <div key={group.date}>
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-muted-foreground font-medium">{group.date}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-2">
                  {group.msgs.map(msg => {
                    const isMine = msg.sender_id === user.id
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${
                            isMine
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted text-foreground rounded-bl-sm'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-border bg-card px-5 py-3">
          {!recipientId ? (
            <p className="text-sm text-muted-foreground text-center py-1">
              No recipient found for this conversation.
            </p>
          ) : (
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[42px] max-h-[120px] overflow-y-auto"
              />
              <Button
                onClick={sendMessage}
                disabled={!content.trim() || sending}
                size="sm"
                className="h-[42px] px-4 rounded-xl flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="ml-1.5 hidden sm:inline">Send</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
