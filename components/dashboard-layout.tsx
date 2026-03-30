'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Briefcase, TrendingUp, Users,
  Settings, LogOut, Menu, X, Bell, ChevronRight,
  Search, ChevronDown, Shield, User as UserIcon
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
  badge?: number
}

const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  client: [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Active Requests', href: '/dashboard/requests', icon: FileText },
    { label: 'Messages', href: '/dashboard/messages', icon: Briefcase },
    { label: 'Payments', href: '/dashboard/earnings', icon: TrendingUp },
    { label: 'My Team', href: '/dashboard/team', icon: Users },
  ],
  contractor: [
    { label: 'Command Center', href: '/dashboard/contractor', icon: LayoutDashboard, exact: true },
    { label: 'Job Board', href: '/dashboard/contractor/jobs', icon: Briefcase },
    { label: 'Performance Analytics', href: '/dashboard/contractor/analytics', icon: TrendingUp, exact: true },
  ],
  homeowner: [
    { label: 'Property Overview', href: '/dashboard/homeowner', icon: LayoutDashboard, exact: true },
    { label: 'Dispatch Request', href: '/dashboard/homeowner/new-request', icon: FileText, exact: true },
    { label: 'Property Settings', href: '/dashboard/homeowner/settings', icon: Settings, exact: true },
  ],
  admin: [
    { label: 'System Operations', href: '/dashboard/admin', icon: Shield, exact: true },
    { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { label: 'Financial Oversight', href: '/dashboard/admin/invoices', icon: TrendingUp },
  ],
}

function resolveNavigation(role: string, pathname: string): NavItem[] {
  if (pathname.startsWith('/dashboard/contractor')) return NAVIGATION_CONFIG.contractor
  if (pathname.startsWith('/dashboard/homeowner')) return NAVIGATION_CONFIG.homeowner
  if (pathname.startsWith('/dashboard/admin')) return NAVIGATION_CONFIG.admin
  return NAVIGATION_CONFIG[role] ?? NAVIGATION_CONFIG.client
}

function checkIsActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userRole?: string
  userEmail?: string
  onLogout?: () => void
}

export function DashboardLayout({
  children,
  userName = 'System User',
  userRole = 'client',
  userEmail = 'user@nexusops.com',
  onLogout,
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [navSearchTerm, setNavSearchTerm] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navItems = resolveNavigation(userRole, pathname)
  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(navSearchTerm.toLowerCase().trim())
  )
  const currentActiveItem = navItems.find(item => checkIsActive(item, pathname))
  const pageTitle = currentActiveItem?.label ?? 'Dashboard'
  const accountSettingsHref =
    userRole === 'contractor'
      ? '/dashboard/contractor/settings'
      : userRole === 'admin'
        ? '/dashboard/admin/users'
        : (userRole === 'homeowner' || userRole === 'client')
          ? '/dashboard/homeowner/settings'
          : '/dashboard/requests'

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onShortcut)
    return () => document.removeEventListener('keydown', onShortcut)
  }, [])

  const userInitials = userName.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans">

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: isDesktopCollapsed ? '72px' : '256px', transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1)' }}
        className={`fixed lg:relative top-0 left-0 h-screen z-50 flex flex-col bg-sidebar border-r border-sidebar-border shadow-xl lg:shadow-none overflow-hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden min-w-0">
            <svg width="28" height="28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
              <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="5.5" strokeLinecap="round"/>
              <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="5.5" strokeLinecap="round"/>
              <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
              <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="oklch(0.618 0.228 264)" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
              <line x1="60" y1="47" x2="60" y2="73" stroke="oklch(0.618 0.228 264)" strokeWidth="5" strokeLinecap="round"/>
              <line x1="47" y1="60" x2="73" y2="60" stroke="oklch(0.618 0.228 264)" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <div className="overflow-hidden" style={{ opacity: isDesktopCollapsed ? 0 : 1, transition: 'opacity 0.2s ease', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>NEXUS</div>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: 'oklch(0.618 0.228 264)', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 1 }}>OPERATIONS</div>
            </div>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1.5 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 scrollbar-thin flex flex-col gap-0.5">
          <p
            className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted overflow-hidden whitespace-nowrap"
            style={{ opacity: isDesktopCollapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}
          >
            Navigation
          </p>

          {filteredNavItems.length === 0 && (
            <div className="px-3 py-4 text-xs text-sidebar-muted">No navigation matches your search.</div>
          )}

          {filteredNavItems.map((item) => {
            const isActive = checkIsActive(item, pathname)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isDesktopCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-2.5 py-2.5 text-[13px] font-medium transition-all group relative overflow-hidden ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span
                  className="flex-1 whitespace-nowrap overflow-hidden"
                  style={{ opacity: isDesktopCollapsed ? 0 : 1, width: isDesktopCollapsed ? 0 : 'auto', transition: 'opacity 0.15s ease, width 0.25s ease' }}
                >
                  {item.label}
                </span>
                {!isDesktopCollapsed && item.badge && (
                  <span className="bg-primary/20 text-primary-foreground py-0.5 px-2 rounded-full text-[10px] font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
                {isActive && !isDesktopCollapsed && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60 shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden lg:flex w-full items-center justify-center py-2 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isDesktopCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Portal</p>
              <h1 className="text-[13px] font-semibold text-foreground leading-tight hidden sm:block">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary border-b border-border text-muted-foreground w-56 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={navSearchTerm}
                onChange={(e) => setNavSearchTerm(e.target.value)}
                placeholder="Search navigation..."
                className="bg-transparent border-none outline-none text-[12.5px] w-full placeholder:text-muted-foreground text-foreground"
              />
              <div className="flex items-center gap-0.5 text-[9px] font-medium opacity-40 shrink-0">
                <kbd className="bg-background px-1 py-0.5 rounded border border-border">⌘K</kbd>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-card" />
            </button>

            <div className="h-5 w-px bg-border" />

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-2 hover:bg-secondary transition-colors"
              >
                <div className="w-7 h-7 bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center text-[10px] font-bold shrink-0">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[12.5px] font-semibold text-foreground">{userName}</span>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{userRole}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card border border-border shadow-xl overflow-hidden z-50 animate-fade-up origin-top-right">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-[13px] font-semibold text-foreground truncate">{userName}</p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{userEmail}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href={accountSettingsHref}
                      className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Account Settings
                    </Link>
                    <button
                        onClick={() => {
                          if (onLogout) {
                            onLogout()
                            return
                          }
                          router.push('/api/auth/logout')
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-destructive hover:bg-destructive/10 transition-colors mt-0.5"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-background p-4 lg:p-6 animate-fade-up">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

