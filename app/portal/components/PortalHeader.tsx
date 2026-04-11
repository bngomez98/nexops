'use client'

import { Bell, ChevronDown, LogOut } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatRelative } from '../lib/portal-utils'
import { usePortal } from '../lib/portal-context'
import { Avatar } from './Avatar'

export function PortalHeader() {
  const {
    currentUser,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    refreshNotifications,
  } = usePortal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const roleLabel: Record<string, string> = {
    admin: 'Operations admin',
    homeowner: 'Homeowner',
    contractor: 'Contractor',
    manager: 'Property manager',
    'property-manager': 'Property manager',
  }

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  if (!currentUser) return null

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/auth/login'
  }

  return (
    <header className="flex items-center justify-between mb-6 rise">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-sky-400 shadow-lg shadow-indigo-500/40 border border-white/15">
          <span className="text-white font-bold tracking-tighter">N</span>
        </div>
        <div>
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
            Nexus Operations
          </div>
          <div className="text-sm font-semibold text-white tracking-tight">
            {greet()}, {currentUser.name.split(' ')[0]}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            setNotifOpen((prev) => !prev)
            void refreshNotifications()
          }}
          className="relative h-10 w-10 rounded-full glass-soft flex items-center justify-center text-indigo-100 hover:bg-white/10 transition"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-0.5 text-[9px] font-semibold bg-indigo-500 text-white rounded-full px-1.5 py-0.5 shadow">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 glass-soft pl-1.5 pr-3 py-1 rounded-full hover:bg-white/10 transition"
          >
            <Avatar user={currentUser} size={32} />
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-semibold text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[9.5px] uppercase tracking-wider text-indigo-200/60">
                {roleLabel[currentUser.role]}
              </div>
            </div>
            <ChevronDown size={14} className="text-indigo-200/70" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-60 glass p-2 z-30 rise">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60 px-3 py-2">
                Account
              </div>
              <div className="px-3 pb-2 text-xs text-indigo-200/70">
                Use the Profile tab to update your details.
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition hover:bg-white/10 text-xs text-indigo-100"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {notifOpen && (
        <div className="absolute right-6 top-[92px] w-[340px] glass p-3 z-30 rise">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
              Notifications
            </div>
            <button
              type="button"
              onClick={() => void markAllNotificationsRead()}
              className="text-[10px] uppercase tracking-wider text-indigo-200/60 hover:text-white"
            >
              Mark all read
            </button>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto px-1">
            {notifications.length === 0 && (
              <div className="text-xs text-indigo-200/60 px-2 py-4 text-center">
                No notifications yet.
              </div>
            )}
            {notifications.map((notif) => (
              <button
                key={notif.id}
                type="button"
                onClick={() => void markNotificationRead(notif.id)}
                className={`w-full text-left glass-soft p-3 transition ${
                  notif.read ? 'opacity-70' : 'hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-semibold text-white mb-1">{notif.title}</div>
                {notif.body && (
                  <div className="text-[11px] text-indigo-200/70">{notif.body}</div>
                )}
                <div className="text-[10px] text-indigo-200/40 mt-1">
                  {formatRelative(notif.created_at)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function greet(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
