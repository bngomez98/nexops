'use client'

import Link from '@/components/link'
import { usePathname } from '@/lib/router'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'
import {
  LogOut, Menu, X, LayoutDashboard,
  Settings, TrendingUp, ChevronRight, Briefcase,
  PlusCircle, ShieldCheck, User, Building2,
  ClipboardList, Receipt, Wallet, Home, FolderOpen,
  Users, ShieldAlert, BarChart3, HelpCircle, MessageSquare, Workflow, Zap, Search,
} from 'lucide-react'
import { useBranding } from '@/components/branding-provider'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
  badge?: number
}

interface NavGroup {
  section: string
  items: NavItem[]
}

const NAV_GROUPS: Record<string, NavGroup[]> = {
  homeowner: [
    {
      section: 'Core',
      items: [
        { label: 'Dashboard',    href: '/dashboard/homeowner',             icon: LayoutDashboard, exact: true },
        { label: 'New Request',  href: '/dashboard/homeowner/new-request', icon: PlusCircle,      exact: true },
        { label: 'Requests',     href: '/dashboard/homeowner/requests',    icon: ClipboardList },
        { label: 'Pipeline',     href: '/dashboard/homeowner/pipeline',    icon: Workflow,        exact: true },
        { label: 'Messages',     href: '/dashboard/messages',              icon: MessageSquare },
        { label: 'Search',       href: '/search',                          icon: Search,          exact: true },
      ],
    },
    {
      section: 'Manage',
      items: [
        { label: 'Properties',   href: '/dashboard/homeowner/properties',  icon: Home },
        { label: 'Invoices',     href: '/dashboard/homeowner/invoices',    icon: Receipt },
        { label: 'Payments',     href: '/dashboard/homeowner/payments',    icon: Wallet },
        { label: 'Documents',    href: '/dashboard/homeowner/documents',   icon: FolderOpen },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile',      href: '/dashboard/homeowner/profile',     icon: User },
        { label: 'Settings',     href: '/dashboard/homeowner/settings',    icon: Settings,        exact: true },
      ],
    },
  ],
  contractor: [
    {
      section: 'Core',
      items: [
        { label: 'Dashboard',       href: '/dashboard/contractor',                icon: LayoutDashboard, exact: true },
        { label: 'Available Work',  href: '/dashboard/contractor/available-work', icon: Zap,             exact: true },
        { label: 'Service Queue',   href: '/dashboard/contractor/jobs',           icon: Briefcase },
        { label: 'Messages',        href: '/dashboard/messages',                  icon: MessageSquare },
        { label: 'Search',          href: '/search',                              icon: Search,          exact: true },
      ],
    },
    {
      section: 'Manage',
      items: [
        { label: 'Assignments',     href: '/dashboard/contractor/my-projects',    icon: ClipboardList,   exact: true },
        { label: 'Invoices',        href: '/dashboard/contractor/invoices',       icon: Receipt },
        { label: 'Payments',        href: '/dashboard/contractor/payments',       icon: Wallet },
        { label: 'Documents',       href: '/dashboard/contractor/documents',      icon: FolderOpen },
        { label: 'Performance',     href: '/dashboard/contractor/analytics',      icon: TrendingUp,      exact: true },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile',         href: '/dashboard/contractor/profile',        icon: User },
        { label: 'Settings',        href: '/dashboard/contractor/settings',       icon: Settings,        exact: true },
      ],
    },
  ],
  'property-manager': [
    {
      section: 'Core',
      items: [
        { label: 'Dashboard',    href: '/dashboard/property-manager',              icon: LayoutDashboard, exact: true },
        { label: 'Properties',   href: '/dashboard/property-manager/properties',   icon: Building2 },
        { label: 'Requests',     href: '/dashboard/property-manager/requests',     icon: ClipboardList },
        { label: 'Messages',     href: '/dashboard/messages',                      icon: MessageSquare },
        { label: 'Search',       href: '/search',                                  icon: Search,          exact: true },
      ],
    },
    {
      section: 'Manage',
      items: [
        { label: 'Invoices',     href: '/dashboard/property-manager/invoices',     icon: Receipt },
        { label: 'Payments',     href: '/dashboard/property-manager/payments',     icon: Wallet },
        { label: 'Documents',    href: '/dashboard/property-manager/documents',    icon: FolderOpen },
      ],
    },
    {
      section: 'Account',
      items: [
        { label: 'Settings',     href: '/dashboard/property-manager/settings',     icon: Settings,        exact: true },
      ],
    },
  ],
  admin: [
    {
      section: 'Operations',
      items: [
        { label: 'Hub',          href: '/dashboard/admin',             icon: LayoutDashboard, exact: true },
        { label: 'Contractors',  href: '/dashboard/admin/contractors', icon: ShieldAlert },
        { label: 'Jobs',         href: '/dashboard/admin/jobs',        icon: Briefcase },
        { label: 'Matching',     href: '/dashboard/admin/matches',     icon: BarChart3 },
        { label: 'Search',       href: '/search',                      icon: Search,          exact: true },
      ],
    },
    {
      section: 'Manage',
      items: [
        { label: 'Users',        href: '/dashboard/admin/users',       icon: Users },
        { label: 'Invoices',     href: '/dashboard/admin/invoices',    icon: Receipt },
        { label: 'Documents',    href: '/dashboard/admin/documents',   icon: FolderOpen },
      ],
    },
  ],
}

const ROLE_LABELS: Record<string, string> = {
  homeowner: 'Homeowner',
  contractor: 'Contractor',
  'property-manager': 'Property Manager',
  admin: 'Administrator',
}

const ROLE_COLORS: Record<string, string> = {
  homeowner:         'bg-sky-500/15 text-sky-400 border-sky-500/25',
  contractor:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'property-manager':'bg-violet-500/15 text-violet-400 border-violet-500/25',
  admin:             'bg-amber-500/15 text-amber-400 border-amber-500/25',
}

const PRIMARY_ACTIONS: Record<string, { label: string; href: string; icon: React.ElementType } | null> = {
  homeowner: { label: 'New Request', href: '/dashboard/homeowner/new-request', icon: PlusCircle },
  contractor: null,
  'property-manager': null,
  admin: null,
}

interface DashboardNavProps {
  userName: string
  role: 'homeowner' | 'contractor' | 'property-manager' | 'admin'
  onLogout: () => void
  avatarUrl?: string | null
}

export function DashboardNav({ userName, role, onLogout, avatarUrl }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navGroups = useMemo(() => NAV_GROUPS[role] ?? [], [role])
  const { branding } = useBranding()
  const allNavItems = useMemo(() => navGroups.flatMap(g => g.items), [navGroups])

  const initials = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const profileHref = useMemo(() => {
    if (role === 'homeowner') return '/dashboard/homeowner/profile'
    if (role === 'contractor') return '/dashboard/contractor/profile'
    if (role === 'property-manager') return '/dashboard/property-manager/settings'
    return '/dashboard/admin/users'
  }, [role])

  function active(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  const currentLabel = allNavItems.find(i => active(i))?.label ?? 'Dashboard'
  const primaryAction = PRIMARY_ACTIONS[role]
  const roleColor = ROLE_COLORS[role] ?? ROLE_COLORS.homeowner

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}
      >

        {/* Logo row */}
        <div
          className="flex items-center justify-between px-5 h-[60px] flex-shrink-0"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            {branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logoUrl} alt={branding.brandName ?? 'Logo'} className="h-7 w-auto max-w-[130px] object-contain" />
            ) : (
              <>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="#22c55e" strokeWidth="7" strokeLinecap="round"/>
                    <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="#22c55e" strokeWidth="7" strokeLinecap="round"/>
                    <line x1="60" y1="47" x2="60" y2="73" stroke="#22c55e" strokeWidth="6" strokeLinecap="round"/>
                    <line x1="47" y1="60" x2="73" y2="60" stroke="#22c55e" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="leading-none min-w-0">
                  <div className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--sidebar-foreground)' }}>
                    {branding.brandName ?? 'NEXUS'}
                  </div>
                  {!branding.brandName && (
                    <div className="text-[8px] font-bold tracking-[0.16em] uppercase text-emerald-500 mt-0.5">OPERATIONS</div>
                  )}
                </div>
              </>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 flex-shrink-0">
          <Link
            href={profileHref}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors group"
            style={{ background: 'var(--sidebar-accent)', border: '1px solid var(--sidebar-border)' }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500/30 flex-shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--sidebar-foreground)' }}>
                {userName}
              </p>
              <span
                className={`inline-flex items-center mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${roleColor}`}
              >
                {ROLE_LABELS[role]}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" style={{ color: 'var(--sidebar-foreground)' }} />
          </Link>
        </div>

        {/* Primary CTA */}
        {primaryAction && (
          <div className="px-4 pb-3 flex-shrink-0">
            <Link
              href={primaryAction.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full h-9 rounded-lg bg-primary text-primary-foreground text-[12.5px] font-semibold hover:opacity-95 transition-opacity"
            >
              <primaryAction.icon className="w-3.5 h-3.5" />
              {primaryAction.label}
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
          <div className="space-y-5">
            {navGroups.map(group => (
              <div key={group.section}>
                <p
                  className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.13em]"
                  style={{ color: 'var(--sidebar-muted)' }}
                >
                  {group.section}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActiveItem = active(item)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group ${
                          isActiveItem
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                            : 'hover:bg-sidebar-accent'
                        }`}
                        style={isActiveItem ? {} : { color: 'rgba(var(--sidebar-foreground-rgb, 244,244,245), 0.65)' }}
                      >
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isActiveItem ? '' : 'opacity-60 group-hover:opacity-90'
                          }`}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge != null && (
                          <span className="text-[10px] font-bold bg-primary/20 text-primary-foreground/90 px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {isActiveItem && (
                          <ChevronRight className="w-3 h-3 opacity-50 flex-shrink-0" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div
          className="px-3 py-4 flex-shrink-0 space-y-1.5"
          style={{ borderTop: '1px solid var(--sidebar-border)' }}
        >
          <a
            href="https://nexusoperations.zendesk.com/hc/en-us"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition-colors hover:bg-sidebar-accent"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            Help &amp; Support
          </a>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition-colors hover:bg-sidebar-accent"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Top header ── */}
      <header
        className="sticky top-0 z-30 lg:ml-[260px] h-[60px] flex items-center px-4 sm:px-6 gap-4"
        style={{
          background: 'color-mix(in srgb, var(--card) 96%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Mobile menu trigger */}
        <button
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors flex-shrink-0"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold leading-none mb-0.5">
            {ROLE_LABELS[role]} Workspace
          </p>
          <h1 className="text-[14px] font-semibold text-foreground truncate leading-tight">{currentLabel}</h1>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Secure badge (desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted-foreground rounded-full border border-border bg-background/60 px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>Secure session</span>
          </div>

          {role !== 'admin' && <NotificationBell />}

          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* User avatar link */}
          <Link
            href={profileHref}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-[13px] font-medium text-foreground block leading-none">{userName}</span>
              <span className="text-[10.5px] text-muted-foreground leading-none mt-0.5 block">View profile</span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="hidden lg:flex gap-1.5 text-muted-foreground h-8 px-3 text-[12.5px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>
      </header>
    </>
  )
}
