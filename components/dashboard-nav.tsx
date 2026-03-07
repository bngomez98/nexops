"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Hammer,
  User,
  ListChecks,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const ownerNavItems = [
  { href: "/dashboard",           label: "Overview",      icon: LayoutDashboard },
  { href: "/dashboard/requests",  label: "My Requests",   icon: FileText },
  { href: "/dashboard/messages",  label: "Messages",      icon: MessageSquare },
  { href: "/dashboard/settings",  label: "Settings",      icon: Settings },
]

const contractorNavItems = [
  { href: "/dashboard/contractor",          label: "Overview",        icon: LayoutDashboard },
  { href: "/dashboard/contractor/requests", label: "Open Requests",   icon: ListChecks },
  { href: "/dashboard/messages",            label: "Messages",        icon: MessageSquare },
  { href: "/dashboard/contractor/profile",  label: "Profile",         icon: User },
  { href: "/dashboard/contractor/settings", label: "Settings",        icon: Settings },
]

export function DashboardNav({ user }: { user: SupabaseUser }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const { resolvedTheme, setTheme } = useTheme()
  
  const role = user.user_metadata?.role || "homeowner"
  const isContractor = role === "contractor"
  const navItems = isContractor ? contractorNavItems : ownerNavItems
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const roleLabel = role === "property_manager" ? "Property Manager" : isContractor ? "Contractor" : "Property Owner"

  return (
    <nav className="flex w-[220px] flex-col border-r border-border bg-card flex-shrink-0" aria-label="Dashboard navigation">
      {/* Logo */}
      <div className="flex items-center border-b border-border px-5 h-[52px]">
        <Link href="/">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={120} height={40}
            style={{ height: "26px", width: "auto" }} />
        </Link>
      </div>

      {/* CTA */}
      {!isContractor && (
        <div className="px-3 py-3 border-b border-border">
          <Link href="/dashboard/requests/new"
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-3 py-2 text-[11.5px] font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </Link>
        </div>
      )}

      {/* Role badge */}
      <div className="px-5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          {isContractor
            ? <Hammer className="h-2.5 w-2.5 text-primary flex-shrink-0" />
            : <LayoutDashboard className="h-2.5 w-2.5 text-primary flex-shrink-0" />
          }
          <span className="text-[10.5px] font-medium text-muted-foreground tracking-wide uppercase">{roleLabel}</span>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && item.href !== "/dashboard/contractor" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-[12.5px] font-medium transition",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Help & Theme */}
      <div className="border-t border-border px-2 py-2 space-y-0.5">
        <a
          href="https://nexusoperations.zendesk.com/hc/en-us"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-sm px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
          Help Center
        </a>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <Moon className="h-3.5 w-3.5 flex-shrink-0" />
          )}
          {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-primary/15 text-[10px] font-bold text-primary">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[11.5px] font-medium">{fullName}</p>
            <p className="truncate text-[10.5px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
