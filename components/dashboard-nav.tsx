'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'
import {
  LogOut, Menu, LayoutDashboard,
  Settings, TrendingUp, ChevronRight, Briefcase,
  PlusCircle, CreditCard, ShieldCheck, User, Building2,
  ClipboardList, Receipt, Wallet, Home, FolderOpen,
  Users, ShieldAlert, BarChart3, HelpCircle, MessageSquare,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  homeowner: [
    { label: 'Dashboard',   href: '/dashboard/homeowner',            icon: LayoutDashboard, exact: true },
    { label: 'Requests',    href: '/dashboard/homeowner/requests',   icon: ClipboardList },
    { label: 'Messages',    href: '/dashboard/messages',             icon: MessageSquare },
    { label: 'New Request', href: '/dashboard/homeowner/new-request',icon: PlusCircle, exact: true },
    { label: 'Properties',  href: '/dashboard/homeowner/properties', icon: Home },
    { label: 'Documents',   href: '/dashboard/homeowner/documents',  icon: FolderOpen },
    { label: 'Invoices',    href: '/dashboard/homeowner/invoices',   icon: Receipt },
    { label: 'Payments',    href: '/dashboard/homeowner/payments',   icon: Wallet },
    { label: 'Profile',     href: '/dashboard/homeowner/profile',    icon: User },
    { label: 'Settings',    href: '/dashboard/homeowner/settings',   icon: Settings, exact: true },
  ],
  contractor: [
    { label: 'Dashboard',   href: '/dashboard/contractor',              icon: LayoutDashboard, exact: true },
    { label: 'Jobs',        href: '/dashboard/contractor/jobs',         icon: Briefcase },
    { label: 'Messages',    href: '/dashboard/messages',                icon: MessageSquare },
    { label: 'My Projects', href: '/dashboard/contractor/my-projects',  icon: ClipboardList, exact: true },
    { label: 'Invoices',    href: '/dashboard/contractor/invoices',     icon: Receipt },
    { label: 'Payments',    href: '/dashboard/contractor/payments',     icon: Wallet },
    { label: 'Documents',   href: '/dashboard/contractor/documents',    icon: FolderOpen },
    { label: 'Analytics',   href: '/dashboard/contractor/analytics',    icon: TrendingUp, exact: true },
    { label: 'Profile',     href: '/dashboard/contractor/profile',      icon: User },
    { label: 'Settings',    href: '/dashboard/contractor/settings',     icon: Settings, exact: true },
  ],
  'property-manager': [
    { label: 'Dashboard',   href: '/dashboard/property-manager',                  icon: LayoutDashboard, exact: true },
    { label: 'Properties',  href: '/dashboard/property-manager/properties',       icon: Building2 },
    { label: 'Requests',    href: '/dashboard/property-manager/requests',         icon: ClipboardList },
    { label: 'Invoices',    href: '/dashboard/property-manager/invoices',         icon: Receipt },
    { label: 'Payments',    href: '/dashboard/property-manager/payments',         icon: Wallet },
    { label: 'Documents',   href: '/dashboard/property-manager/documents',        icon: FolderOpen },
    { label: 'Settings',    href: '/dashboard/property-manager/settings',        icon: Settings, exact: true },
  ],
  admin: [
    { label: 'Overview',     href: '/dashboard/admin',             icon: LayoutDashboard, exact: true },
    { label: 'Contractors',  href: '/dashboard/admin/contractors', icon: ShieldAlert },
    { label: 'Jobs',         href: '/dashboard/admin/jobs',        icon: Briefcase },
    { label: 'Matches',      href: '/dashboard/admin/matches',     icon: BarChart3 },
    { label: 'Users',        href: '/dashboard/admin/users',       icon: Users },
    { label: 'Invoices',     href: '/dashboard/admin/invoices',    icon: Receipt },
    { label: 'Documents',    href: '/dashboard/admin/documents',   icon: FolderOpen },
  ],
}

interface DashboardNavProps {
  userName: string
  role: 'homeowner' | 'contractor' | 'property-manager' | 'admin'
  onLogout: () => void
}

export function DashboardNav({ userName, role, onLogout }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = NAV_ITEMS[role] ?? []

  const initials = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const quickActions = useMemo(() => {
    if (role === 'homeowner') {
      return [
        { label: 'Submit request', href: '/dashboard/homeowner/new-request', icon: PlusCircle },
        { label: 'Billing', href: '/dashboard/homeowner/billing', icon: CreditCard },
      ]
    }
    if (role === 'contractor') {
      return [
        { label: 'Browse leads', href: '/dashboard/contractor', icon: PlusCircle },
        { label: 'Analytics', href: '/dashboard/contractor/analytics', icon: TrendingUp },
      ]
    }
    if (role === 'property-manager') {
      return [
        { label: 'New request', href: '/dashboard/property-manager/requests/new', icon: PlusCircle },
        { label: 'Properties', href: '/dashboard/property-manager/properties', icon: Building2 },
      ]
    }
    return []
  }, [role])

  function active(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  const currentLabel = navItems.find(i => active(i))?.label ?? 'Dashboard'

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[240px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border flex-shrink-0">
          <Link href="/" aria-label="Nexus Operations home" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="#3aad58" strokeWidth="5.5" strokeLinecap="round"/>
              <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="#3aad58" strokeWidth="5.5" strokeLinecap="round"/>
              <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="#3aad58" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
              <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="#3aad58" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
              <line x1="60" y1="47" x2="60" y2="73" stroke="#3aad58" strokeWidth="5" strokeLinecap="round"/>
              <line x1="47" y1="60" x2="73" y2="60" stroke="#3aad58" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>NEXUS</div>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#3aad58', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 1 }}>OPERATIONS</div>
            </div>
          </Link>
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">Workspace</p>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-[12px] font-bold text-primary">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-sidebar-foreground">{userName}</p>
                <p className="text-[10px] capitalize text-sidebar-muted">{role}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-2.5 py-2 text-[11px] text-sidebar-foreground/90">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Secure project operations
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted px-2 mb-3">
              {role === 'homeowner' ? 'Homeowner' : role === 'contractor' ? 'Contractor' : role === 'property-manager' ? 'Prop. Manager' : 'Admin'}
            </p>
            <div className="space-y-0.5">
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
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/10'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActiveItem ? '' : 'text-sidebar-muted group-hover:text-sidebar-foreground'}`} />
                    {item.label}
                    {isActiveItem && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted mb-3">Quick actions</p>
            <div className="space-y-2">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[12px] text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {action.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <a
            href="https://nexusoperations.zendesk.com/hc/en-us"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[12px] font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </a>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[12px] font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 md:ml-[240px] h-14 bg-card/95 backdrop-blur border-b border-border flex items-center px-4 gap-4">
        <button
          className="md:hidden text-muted-foreground hover:text-foreground p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Portal</div>
          <div className="truncate text-[13px] font-semibold text-foreground">{currentLabel}</div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-muted-foreground rounded-full border border-border bg-background px-3 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Live project status and secure account access
        </div>

        <div className="flex items-center gap-2">
          {role === 'contractor' && <NotificationBell />}
          {role === 'property-manager' && <NotificationBell />}
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
