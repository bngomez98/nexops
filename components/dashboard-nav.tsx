"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
  Menu,
  X,
  CreditCard,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const ownerNavItems = [
  { href: "/dashboard",           label: "Overview",      icon: LayoutDashboard },
  { href: "/dashboard/requests",  label: "My Requests",   icon: FileText },
  { href: "/dashboard/messages",  label: "Messages",      icon: MessageSquare },
  { href: "/dashboard/billing",   label: "Billing",       icon: CreditCard },
  { href: "/dashboard/settings",  label: "Settings",      icon: Settings },
]

const contractorNavItems = [
  { href: "/dashboard/contractor",          label: "Overview",        icon: LayoutDashboard },
  { href: "/dashboard/contractor/requests", label: "Open Requests",   icon: ListChecks },
  { href: "/dashboard/messages",            label: "Messages",        icon: MessageSquare },
  { href: "/dashboard/contractor/profile",  label: "Profile",         icon: User },
  { href: "/dashboard/contractor/billing",  label: "Billing",         icon: CreditCard },
  { href: "/dashboard/contractor/settings", label: "Settings",        icon: Settings },
]

function NavContent({
  user,
  avatarUrl,
  onSignOut,
  onClose,
}: {
  user: SupabaseUser
  avatarUrl: string | null
  onSignOut: () => void
  onClose?: () => void
}) {
  const pathname = usePathname()
  const role = user.user_metadata?.role || "homeowner"
  const isContractor = role === "contractor"
  const navItems = isContractor ? contractorNavItems : ownerNavItems
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const roleLabel = role === "property_manager" ? "Property Manager" : isContractor ? "Contractor" : "Property Owner"
  const initials = fullName.charAt(0).toUpperCase()

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border px-4 h-14 flex-shrink-0">
        <Link href="/" onClick={onClose}>
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={130}
            height={43}
            style={{ height: "32px", width: "auto" }}
          />
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* CTA */}
      {!isContractor && (
        <div className="px-3 py-3 border-b border-border flex-shrink-0">
          <Link
            href="/dashboard/requests/new"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </Link>
        </div>
      )}

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          {isContractor
            ? <Hammer className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            : <LayoutDashboard className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          }
          <span className="text-[11px] font-medium text-muted-foreground">{roleLabel}</span>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 space-y-0.5 px-2 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && item.href !== "/dashboard/contractor" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-[13px] font-medium transition",
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

      {/* Help */}
      <div className="border-t border-border px-2 py-2 flex-shrink-0">
        <Link
          href="/faq"
          onClick={onClose}
          className="flex items-center gap-3 rounded px-3 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
          FAQ &amp; Help
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2.5 px-2 py-1">
          <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-border bg-primary/10">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-primary">
                {initials}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[12px] font-medium">{fullName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  )
}

export function DashboardNav({ user }: { user: SupabaseUser }) {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url)
      })
  }, [user.id])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex w-60 flex-col border-r border-border bg-card flex-shrink-0"
        aria-label="Dashboard navigation"
      >
        <NavContent user={user} avatarUrl={avatarUrl} onSignOut={handleSignOut} />
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 h-14">
        <Link href="/">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={120}
            height={40}
            style={{ height: "28px", width: "auto" }}
          />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <nav
            className="relative flex w-72 max-w-[85vw] flex-col bg-card border-r border-border z-50"
            aria-label="Mobile navigation"
          >
            <NavContent
              user={user}
              avatarUrl={avatarUrl}
              onSignOut={handleSignOut}
              onClose={() => setMobileOpen(false)}
            />
          </nav>
        </div>
      )}
    </>
  )
}
