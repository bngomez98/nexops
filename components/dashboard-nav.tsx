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
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

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

  const role = user.user_metadata?.role || "homeowner"
  const isContractor = role === "contractor"
  const navItems = isContractor ? contractorNavItems : ownerNavItems
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const roleLabel = role === "property_manager" ? "Property Manager" : isContractor ? "Contractor" : "Property Owner"
  const initials = fullName.charAt(0).toUpperCase()

  return (
    <nav className="flex w-60 flex-col border-r border-border bg-card flex-shrink-0" aria-label="Dashboard navigation">
      {/* Logo */}
      <div className="flex items-center border-b border-border px-4 h-14">
        <Link href="/">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={130}
            height={43}
            style={{ height: "32px", width: "auto" }}
          />
        </Link>
      </div>

      {/* CTA */}
      {!isContractor && (
        <div className="px-3 py-3 border-b border-border">
          <Link
            href="/dashboard/requests/new"
            className="flex w-full items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </Link>
        </div>
      )}

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          {isContractor
            ? <Hammer className="h-3 w-3 text-primary flex-shrink-0" />
            : <LayoutDashboard className="h-3 w-3 text-primary flex-shrink-0" />
          }
          <span className="text-[11px] font-medium text-muted-foreground">{roleLabel}</span>
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
      <div className="border-t border-border px-2 py-2">
        <Link
          href="/faq"
          className="flex items-center gap-3 rounded px-3 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
          FAQ &amp; Help
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-[11px] text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
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
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
