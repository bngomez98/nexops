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
  admin: 'Admin',
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
  const { branding } = useBranding()
  const navGroups = NAV_GROUPS[role] ?? []
  const allNavItems = useMemo(() => navGroups.flatMap(g => g.items), [navGroups])

  const initials = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const operationsFocus = useMemo(() => {
    if (role === 'homeowner') return 'Track requests, messages, properties, and costs in one workspace.'
    if (role === 'contractor') return 'Manage your queue, active jobs, payouts, and customer communication.'
    if (role === 'property-manager') return 'Monitor portfolio health, requests, and spend across properties.'
    return 'Oversee platform performance, users, and governance.'
  }, [role])

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

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            {branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logoUrl} alt={branding.brandName ?? 'Logo'} className="h-8 w-auto max-w-[140px] object-contain" />
            ) : (
              <>
                <svg width="28" height="28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" className="text-primary"/>
                  <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" className="text-primary"/>
                  <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary/80"/>
                  <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary/80"/>
                  <line x1="60" y1="47" x2="60" y2="73" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-primary"/>
                  <line x1="47" y1="60" x2="73" y2="60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-primary"/>
                </svg>
                <div className="leading-none">
                  <div className="text-sm font-bold text-sidebar-foreground tracking-tight">{branding.brandName ?? 'NEXUS'}</div>
                  {!branding.brandName && <div className="text-[8px] font-semibold text-primary tracking-[0.12em] uppercase">OPERATIONS</div>}
                </div>
              </>
            )}
          </Link>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User workspace */}
        <div className="px-4 pt-5 pb-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">{userName}</p>
                <p className="text-xs text-sidebar-muted">{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
          <div className="space-y-5">
            {navGroups.map(group => (
              <div key={group.section}>
                <p className="px-3 mb-1.5 font-mono-label text-sidebar-muted">{group.section}</p>
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActiveItem = active(item)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActiveItem
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActiveItem ? '' : 'text-sidebar-muted'}`} />
                        <span className="flex-1">{item.label}</span>
                        {isActiveItem && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/30 px-3.5 py-3.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-sidebar-muted font-semibold">Operations Focus</p>
              <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/85">{operationsFocus}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-sidebar-muted">
                <kbd className="rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5">⌘</kbd>
                <kbd className="rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5">K</kbd>
                <span>Search workspace</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <a
            href="https://nexusoperations.zendesk.com/hc/en-us"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <HelpCircle className="w-4 h-4" />
            Operations Help Center
          </a>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Top header */}
      <header className="sticky top-0 z-30 lg:ml-[260px] h-16 bg-card/95 backdrop-blur-md border-b border-border flex items-center px-4 sm:px-6 gap-4">
        <button
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-mono-label text-muted-foreground">Nexus Operations · {ROLE_LABELS[role]} Workspace</p>
          <h1 className="text-lg font-semibold text-foreground truncate">{currentLabel}</h1>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground rounded-full border border-border bg-background px-3 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Secure session</span>
        </div>

        <div className="flex items-center gap-3">
          {role !== 'admin' && <NotificationBell />}
          
          <div className="h-6 w-px bg-border hidden sm:block" />
          
          <Link href={profileHref} className="flex items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-muted transition-colors">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-foreground">{userName}</span>
              <p className="text-[11px] text-muted-foreground leading-tight">View profile</p>
            </div>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout} 
            className="hidden lg:flex gap-1.5 text-muted-foreground h-9 px-3"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </header>
    </>
  )
}
