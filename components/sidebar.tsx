'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield, LayoutDashboard, Briefcase, User, LogOut,
  Home, Building2, HardHat, ChevronRight,
} from 'lucide-react'
import { signOut } from '@/app/auth/actions'
import { cn, getRoleLabel } from '@/lib/utils'
import type { Profile } from '@/lib/types'

const roleIcon = {
  homeowner: Home,
  property_manager: Building2,
  contractor: HardHat,
}

const navItems = {
  homeowner: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/jobs', label: 'My Requests', icon: Briefcase },
    { href: '/profile', label: 'My Profile', icon: User },
  ],
  property_manager: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/jobs', label: 'Work Orders', icon: Briefcase },
    { href: '/profile', label: 'My Profile', icon: User },
  ],
  contractor: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/jobs', label: 'Assigned Jobs', icon: Briefcase },
    { href: '/profile', label: 'My Profile', icon: User },
  ],
}

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const role = profile?.role ?? 'homeowner'
  const items = navItems[role] ?? navItems.homeowner
  const RoleIcon = roleIcon[role] ?? Home
  const avatarUrl = profile?.avatar_url

  return (
    <aside className="flex flex-col w-64 h-full bg-[#0f1e36] text-white flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <Shield className="w-6 h-6 text-[#3b82f6]" />
        <span className="font-bold text-base tracking-tight">Nexus Operations</span>
      </div>

      {/* User pill */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-9 h-9 rounded-full bg-[#1e3a8a] flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-[#3b82f6]/40">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={profile?.full_name ?? 'Avatar'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[#93c5fd]">
                {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile?.full_name ?? 'Your Profile'}</p>
            <p className="text-xs text-slate-400 truncate">{getRoleLabel(role)}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-semibold">
          <RoleIcon className="w-3.5 h-3.5" />
          <span>{getRoleLabel(role)}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#1e40af] text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
