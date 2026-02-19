"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { getStoredUser, clearUser, type AuthUser } from "@/lib/auth"
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Briefcase,
  ExternalLink,
} from "lucide-react"

const contractorNav = [
  { label: "Dashboard", href: "/dashboard/contractor", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/contractor/leads", icon: FileText },
  { label: "Analytics", href: "/dashboard/contractor/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/contractor/settings", icon: Settings },
]

const homeownerNav = [
  { label: "Dashboard", href: "/dashboard/homeowner", icon: LayoutDashboard },
  { label: "New Request", href: "/dashboard/homeowner/new", icon: PlusCircle },
  { label: "My Requests", href: "/dashboard/homeowner/requests", icon: FileText },
  { label: "Settings", href: "/dashboard/homeowner/settings", icon: Settings },
]

const tierColors: Record<string, string> = {
  standard: "text-muted-foreground border-border/40 bg-secondary/60",
  premium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  elite: "text-violet-400 border-violet-500/30 bg-violet-500/10",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) {
      router.replace("/login")
      return
    }
    setUser(stored)
  }, [router])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    clearUser()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading your portal…</p>
        </div>
      </div>
    )
  }

  const nav = user.role === "contractor" ? contractorNav : homeownerNav
  const isContractor = user.role === "contractor"
  const portalLabel = isContractor ? "Contractor Portal" : "Homeowner Portal"
  const PortalIcon = isContractor ? Briefcase : Home

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand strip */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/20 flex-shrink-0" />

      {/* Logo + portal label */}
      <div className="px-5 pt-5 pb-4 border-b border-border/40">
        <Link href="/" onClick={() => setSidebarOpen(false)} className="block mb-3">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <PortalIcon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <span className="text-xs font-semibold text-primary tracking-wide">{portalLabel}</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-secondary/60 border border-border/30">
          <div className="relative flex-shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-bold uppercase">
              {user.name.charAt(0)}
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              {user.subscription && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold capitalize ${tierColors[user.subscription] ?? tierColors.standard}`}>
                  {user.subscription}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted-foreground/60 px-3 mb-2.5 uppercase tracking-widest">Navigation</p>
        <ul className="flex flex-col gap-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {/* Active left border indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
                  )}
                  <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"}`} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-primary/60" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-4 py-4 border-t border-border/40 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Back to site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-border/40 bg-sidebar flex-col">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-border/40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-4 h-14 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-primary font-medium">{portalLabel}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
