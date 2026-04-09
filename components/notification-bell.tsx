'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Bell, X, CheckCheck, Inbox } from 'lucide-react'

interface Notification {
  id: string
  title: string
  body: string | null
  type: string | null
  read: boolean
  link: string | null
  created_at: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications ?? [])
      }
    } catch {
      // Swallow network errors — keep existing state.
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + 60s polling.
  useEffect(() => {
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [load])

  // Close on outside click.
  useEffect(() => {
    if (!showPanel) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPanel])

  async function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function markAllRead() {
    if (unreadCount === 0) return
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    })
  }

  async function removeNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })
  }

  function formatTime(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime()
    const diffMins = Math.floor(diffMs / 60_000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMs / 3_600_000)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffMs / 86_400_000)
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-[18px] h-[18px] text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold text-white bg-red-500 rounded-full px-1 border-2 border-card">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-card border border-border rounded-xl shadow-2xl shadow-black/10 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-[13.5px]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all
                </button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 hover:bg-muted rounded-md"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center text-[12px] text-muted-foreground">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Inbox className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-[13px] font-semibold text-foreground mb-1">You&apos;re all caught up</p>
                <p className="text-[11.5px] text-muted-foreground max-w-[220px] leading-relaxed">
                  We&apos;ll let you know when there&apos;s an update on your requests or account.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map(n => {
                  const content = (
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12.5px] leading-snug ${n.read ? 'text-foreground/80 font-medium' : 'text-foreground font-semibold'}`}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-[11.5px] text-muted-foreground mt-0.5 line-clamp-2">
                            {n.body}
                          </p>
                        )}
                        <p className="text-[10.5px] text-muted-foreground mt-1.5">
                          {formatTime(n.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={e => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeNotification(n.id)
                        }}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        aria-label="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )

                  const rowClass = `block px-4 py-3 group transition-colors cursor-pointer ${n.read ? 'hover:bg-muted/40' : 'bg-primary/[0.04] hover:bg-primary/[0.08]'}`

                  return (
                    <li key={n.id}>
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => {
                            markAsRead(n.id)
                            setShowPanel(false)
                          }}
                          className={rowClass}
                        >
                          {content}
                        </Link>
                      ) : (
                        <div
                          onClick={() => markAsRead(n.id)}
                          className={rowClass}
                        >
                          {content}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
