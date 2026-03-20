'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'
import { LogOut, Menu, X } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  exact?: boolean
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  homeowner: [
    { label: 'Dashboard', href: '/dashboard/homeowner', exact: true },
    { label: 'New Request', href: '/dashboard/homeowner/new-request', exact: true },
    { label: 'Settings', href: '/dashboard/homeowner/settings', exact: true },
  ],
  contractor: [
    { label: 'Dashboard', href: '/dashboard/contractor', exact: true },
    { label: 'Analytics', href: '/dashboard/contractor/analytics', exact: true },
    { label: 'Settings', href: '/dashboard/contractor/settings', exact: true },
  ],
}

interface DashboardNavProps {
  userName: string
  role: 'homeowner' | 'contractor'
  onLogout: () => void
}

export function DashboardNav({ userName, role, onLogout }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = NAV_ITEMS[role] ?? []

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/dashboard/${role}`} className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {role === 'contractor' && <NotificationBell />}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground font-medium">
              {userName}
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="hidden md:flex gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <button
              className="md:hidden text-muted-foreground hover:text-foreground p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2 px-3">
              <p className="text-sm text-muted-foreground py-1">{userName}</p>
              <button
                onClick={() => { onLogout(); setMobileOpen(false) }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
