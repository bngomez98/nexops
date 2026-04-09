'use client'

import { Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { usePortal } from '../lib/portal-context'
import { Avatar } from './Avatar'

export function PortalHeader() {
  const { currentUser, users, setCurrentUserId } = usePortal()
  const [open, setOpen] = useState(false)

  const roleLabel: Record<string, string> = {
    admin: 'Operations admin',
    homeowner: 'Homeowner',
    contractor: 'Contractor',
    manager: 'Property manager',
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
          className="relative h-10 w-10 rounded-full glass-soft flex items-center justify-center text-indigo-100 hover:bg-white/10 transition"
        >
          <Bell size={17} />
          <span className="dot-pulse" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
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

          {open && (
            <div className="absolute right-0 top-12 w-60 glass p-2 z-30 rise">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60 px-3 py-2">
                Switch view
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setCurrentUserId(u.id)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                    u.id === currentUser.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <Avatar user={u} size={32} />
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{u.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-indigo-200/60">
                      {roleLabel[u.role]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function greet(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
