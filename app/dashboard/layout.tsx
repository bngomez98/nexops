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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading…</p>
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
      {/* Logo */}
      <div className="px-5 pt-5 pb-5 border-b border-border">
        <Link href="/" onClick={() => setSidebarOpen(false)} className="block mb-4">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <PortalIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">{portalLabel}</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
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
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
                  )}
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground"}`} />
                  <span className="flex-1">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <ThemeToggle compact />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Back to site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
      <aside className="hidden lg:flex w-60 flex-shrink-0 border-r border-border bg-sidebar flex-col">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-4 h-13 border-b border-border bg-background sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo compact />
        </header>

        {/* Desktop topbar */}
        <header className="hidden lg:flex items-center justify-between gap-4 px-8 h-13 border-b border-border bg-background sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{portalLabel}</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
            <span className="text-foreground font-medium">{pageTitles[pathname] ?? "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-2">
            {!isContractor && pathname !== "/dashboard/homeowner/new" && (
              <Link
                href="/dashboard/homeowner/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New Request
              </Link>
            )}
            {isContractor && user.subscription !== "elite" && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Upgrade
              </Link>
            )}
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-3 border-l border-border ml-1">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
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
