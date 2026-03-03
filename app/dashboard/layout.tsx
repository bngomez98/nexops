"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
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
  ArrowUpRight,
} from "lucide-react"

const pageTitles: Record<string, string> = {
  "/dashboard/contractor": "Dashboard",
  "/dashboard/contractor/projects": "Projects",
  "/dashboard/contractor/analytics": "Analytics",
  "/dashboard/contractor/settings": "Settings",
  "/dashboard/homeowner": "Dashboard",
  "/dashboard/homeowner/new": "New Request",
  "/dashboard/homeowner/requests": "My Requests",
  "/dashboard/homeowner/settings": "Settings",
}

const contractorNav = [
  { label: "Dashboard", href: "/dashboard/contractor", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/contractor/projects", icon: FileText },
  { label: "Analytics", href: "/dashboard/contractor/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/contractor/settings", icon: Settings },
]

const homeownerNav = [
  { label: "Dashboard", href: "/dashboard/homeowner", icon: LayoutDashboard },
  { label: "New Request", href: "/dashboard/homeowner/new", icon: PlusCircle },
  { label: "My Requests", href: "/dashboard/homeowner/requests", icon: FileText },
  { label: "Settings", href: "/dashboard/homeowner/settings", icon: Settings },
]

const tierLabel: Record<string, string> = {
  standard: "Standard",
  premium: "Premium",
  elite: "Elite",
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
      <div className="min-h-screen flex items-center justify-center bg-foreground">
        <div className="flex flex-col items-center gap-4">
          {/* Constructivist loading indicator */}
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-background/60 tracking-widest uppercase">Loading…</p>
        </div>
      </div>
    )
  }

  const nav = user.role === "contractor" ? contractorNav : homeownerNav
  const isContractor = user.role === "contractor"
  const portalLabel = isContractor ? "Contractor Portal" : "Homeowner Portal"
  const PortalIcon = isContractor ? Briefcase : Home

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Red rule at top */}
      <div className="h-1 bg-primary w-full shrink-0" />

      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-sidebar-border">
        <Link href="/" onClick={() => setSidebarOpen(false)} className="block mb-4">
          {/* Inverted logo for dark sidebar */}
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
              <rect width="180" height="180" fill="currentColor" className="text-primary" />
              <path d="M40 140V40L90 90L140 40V140L90 90L40 140Z" fill="white" fillOpacity="0.95" />
              <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="140" cy="40" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="40" cy="140" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="140" cy="140" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="90" cy="90" r="10" fill="white" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-black tracking-[0.06em] text-sidebar-foreground">NEXUS</span>
              <span className="text-[8px] font-bold tracking-[0.32em] uppercase text-sidebar-foreground/40">OPERATIONS</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <PortalIcon className="h-3 w-3 text-sidebar-foreground/40 flex-shrink-0" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-sidebar-foreground/40">{portalLabel}</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary border-2 border-primary text-primary-foreground text-sm font-black uppercase flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-sidebar-foreground truncate uppercase tracking-tight">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/40 capitalize font-bold tracking-wide">
              {user.role}{user.subscription ? ` · ${tierLabel[user.subscription] ?? user.subscription}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-foreground font-black"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground font-medium"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                  )}
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-primary" : "text-sidebar-foreground/30 group-hover:text-sidebar-foreground/60"}`} />
                  <span className="flex-1 text-xs font-bold tracking-widest uppercase">{label}</span>
                  {active && <span className="w-1 h-1 bg-primary" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5">
        <ThemeToggle compact />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-widest uppercase text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Back to site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-widest uppercase text-sidebar-foreground/40 hover:bg-destructive/20 hover:text-destructive transition-colors"
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
      <aside className="hidden lg:flex w-60 flex-shrink-0 border-r-2 border-foreground flex-col">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-foreground transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground border-2 border-sidebar-border hover:border-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-4 h-13 border-b-2 border-foreground bg-background sticky top-0 z-30">
          <div className="h-1 absolute top-0 left-0 right-0 bg-primary" />
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground border-2 border-transparent hover:border-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          {/* Compact logo */}
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="180" height="180" fill="currentColor" className="text-primary" />
              <path d="M40 140V40L90 90L140 40V140L90 90L40 140Z" fill="white" fillOpacity="0.95" />
              <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="140" cy="40" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="40" cy="140" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="140" cy="140" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="90" cy="90" r="10" fill="white" />
            </svg>
            <span className="text-sm font-black tracking-wider uppercase">NEXUS</span>
          </div>
        </header>

        {/* Desktop topbar */}
        <header className="hidden lg:flex items-center justify-between gap-4 px-8 h-13 border-b-2 border-foreground bg-background sticky top-0 z-30 flex-shrink-0">
          {/* Red top rule */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground">
            <span>{portalLabel}</span>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-foreground">{pageTitles[pathname] ?? "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-2">
            {!isContractor && pathname !== "/dashboard/homeowner/new" && (
              <Link
                href="/dashboard/homeowner/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-black tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New Request
              </Link>
            )}
            {isContractor && user.subscription !== "elite" && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold tracking-widest uppercase border-2 border-foreground/30 hover:border-foreground hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Upgrade
              </Link>
            )}
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-3 border-l-2 border-foreground/20 ml-1">
              <div className="flex items-center justify-center w-7 h-7 bg-primary border-2 border-foreground text-primary-foreground text-xs font-black uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">{user.name.split(" ")[0]}</span>
            </div>
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
