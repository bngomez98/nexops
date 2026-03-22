'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { NotificationBell } from '@/components/notification-bell'
import {
  LogOut, Menu, LayoutDashboard, FileText,
  Settings, TrendingUp, ChevronRight, Briefcase,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  homeowner: [
    { label: 'Dashboard',   href: '/dashboard/homeowner',             icon: LayoutDashboard, exact: true },
    { label: 'New Request', href: '/dashboard/homeowner/new-request', icon: FileText, exact: true },
    { label: 'Settings',    href: '/dashboard/homeowner/settings',    icon: Settings, exact: true },
  ],
  contractor: [
    { label: 'Dashboard',   href: '/dashboard/contractor',              icon: LayoutDashboard, exact: true },
    { label: 'My Projects', href: '/dashboard/contractor/my-projects',  icon: Briefcase, exact: true },
    { label: 'Analytics',   href: '/dashboard/contractor/analytics',    icon: TrendingUp, exact: true },
    { label: 'Settings',    href: '/dashboard/contractor/settings',     icon: Settings, exact: true },
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

  const initials = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  function active(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[220px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-sidebar-border flex-shrink-0">
          <Logo className="text-sidebar-foreground" compact />
          <p className="mt-2 text-[11px] leading-relaxed text-sidebar-muted">
            {role === 'homeowner'
              ? 'Homeowner portal for requests, billing, and project updates.'
              : 'Contractor portal for projects, analytics, and billing.'}
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted px-2 mb-3">
            {role === 'homeowner' ? 'Homeowner' : 'Contractor'}
          </p>
          {navItems.map(item => {
            const isActiveItem = active(item)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                  isActiveItem
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActiveItem ? '' : 'text-sidebar-muted group-hover:text-sidebar-foreground'}`} />
                {item.label}
                {isActiveItem && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-sidebar-foreground truncate">{userName}</p>
              <p className="text-[10px] text-sidebar-muted capitalize">{role}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-sidebar-muted hover:text-sidebar-foreground transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Top bar (mobile trigger + notification) */}
      <header className="sticky top-0 z-30 md:ml-[220px] h-14 bg-card border-b border-border flex items-center px-4 gap-4">
        <button
          className="md:hidden text-muted-foreground hover:text-foreground p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <p className="text-[12.5px] font-medium text-foreground">
            {navItems.find(i => active(i))?.label ?? 'Dashboard'}
          </p>
          <p className="hidden sm:block text-[11px] text-muted-foreground">
            {role === 'homeowner'
              ? 'Manage your service requests, billing, and account details in one place.'
              : 'Manage projects, earnings, billing, and account settings in one place.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'contractor' && <NotificationBell />}
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
              {initials}
            </div>
            <span className="hidden sm:block text-[12.5px] font-medium text-foreground">{userName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="hidden md:flex gap-1.5 text-muted-foreground h-8 px-2">
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[12px]">Logout</span>
          </Button>
        </div>
      </header>
    </>
  )
}
