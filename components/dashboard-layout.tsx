'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Briefcase, TrendingUp, Users,
  Settings, LogOut, Menu, X, Bell, ChevronRight, Wrench,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
}

const NAV: Record<string, NavItem[]> = {
  client: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Requests',  href: '/dashboard/requests',  icon: FileText },
    { label: 'All Jobs',  href: '/dashboard/all-requests', icon: Briefcase },
    { label: 'Team',      href: '/dashboard/team',      icon: Users },
  ],
  contractor: [
    { label: 'Dashboard',      href: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Available Jobs', href: '/dashboard/jobs',     icon: Briefcase },
    { label: 'Earnings',       href: '/dashboard/earnings', icon: TrendingUp },
  ],
  homeowner: [
    { label: 'Dashboard',    href: '/dashboard/homeowner',              icon: LayoutDashboard, exact: true },
    { label: 'New Request',  href: '/dashboard/homeowner/new-request',  icon: FileText, exact: true },
    { label: 'Settings',     href: '/dashboard/homeowner/settings',     icon: Settings, exact: true },
  ],
  admin: [
    { label: 'Overview',  href: '/dashboard',              icon: LayoutDashboard, exact: true },
    { label: 'Requests',  href: '/dashboard/all-requests', icon: FileText },
    { label: 'Team',      href: '/dashboard/team',         icon: Users },
  ],
}

// Second nav for contractor role on /dashboard/contractor/* path
const CONTRACTOR_NAV: NavItem[] = [
  { label: 'Dashboard',  href: '/dashboard/contractor',            icon: LayoutDashboard, exact: true },
  { label: 'Analytics',  href: '/dashboard/contractor/analytics',  icon: TrendingUp, exact: true },
  { label: 'Settings',   href: '/dashboard/contractor/settings',   icon: Settings, exact: true },
]

function resolveNav(role: string, pathname: string): NavItem[] {
  if (pathname.startsWith('/dashboard/contractor')) return CONTRACTOR_NAV
  if (pathname.startsWith('/dashboard/homeowner'))  return NAV.homeowner
  return NAV[role] ?? NAV.client
}

function isActive(item: NavItem, pathname: string) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

interface Props {
  children: React.ReactNode
  /** Pass user info to avoid re-fetching */
  userName?: string
  userRole?: string
  userEmail?: string
  onLogout?: () => void
}

export function DashboardLayout({
  children,
  userName = 'User',
  userRole = 'client',
  userEmail = '',
  onLogout,
}: Props) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = resolveNav(userRole, pathname)

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="sidebar-layout bg-background">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Wrench className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight">
            Nexus Ops
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted px-2 mb-3">
            Menu
          </p>
          {navItems.map(item => {
            const active = isActive(item, pathname)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-sidebar-primary-foreground' : 'text-sidebar-muted group-hover:text-sidebar-foreground'}`} />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-sidebar-foreground truncate">{userName}</p>
              <p className="text-[10px] text-sidebar-muted capitalize truncate">{userRole}</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sidebar-muted hover:text-sidebar-foreground transition-colors flex-shrink-0"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="sidebar-content">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground p-1"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground flex-1">
            <span className="font-semibold text-foreground">
              {navItems.find(i => isActive(i, pathname))?.label ?? 'Dashboard'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary">
              <Bell className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
              <span className="hidden sm:block text-[12.5px] font-medium text-foreground">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
