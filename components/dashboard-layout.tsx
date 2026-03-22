'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Briefcase, TrendingUp, Users,
  Settings, LogOut, Menu, X, Bell, ChevronRight, Wrench,
  Search, Moon, Sun, ChevronDown, Shield, User as UserIcon
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
  badge?: number
}

const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  client: [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Active Requests', href: '/dashboard/requests', icon: FileText, badge: 3 },
    { label: 'Service History', href: '/dashboard/history', icon: Briefcase },
    { label: 'My Team', href: '/dashboard/team', icon: Users },
  ],
  contractor: [
    { label: 'Command Center', href: '/dashboard/contractor', icon: LayoutDashboard, exact: true },
    { label: 'Job Board', href: '/dashboard/contractor/jobs', icon: Briefcase, badge: 12 },
    { label: 'Financials', href: '/dashboard/contractor/earnings', icon: TrendingUp },
    { label: 'Performance Analytics', href: '/dashboard/contractor/analytics', icon: TrendingUp, exact: true },
  ],
  homeowner: [
    { label: 'Property Overview', href: '/dashboard/homeowner', icon: LayoutDashboard, exact: true },
    { label: 'Dispatch Request', href: '/dashboard/homeowner/new-request', icon: FileText, exact: true },
    { label: 'Property Settings', href: '/dashboard/homeowner/settings', icon: Settings, exact: true },
  ],
  admin: [
    { label: 'System Operations', href: '/dashboard/admin', icon: Shield, exact: true },
    { label: 'Global Requests', href: '/dashboard/admin/requests', icon: FileText, badge: 89 },
    { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { label: 'Financial Oversight', href: '/dashboard/admin/financials', icon: TrendingUp },
  ],
}

function resolveNavigation(role: string, pathname: string): NavItem[] {
  if (pathname.startsWith('/dashboard/contractor')) return NAVIGATION_CONFIG.contractor
  if (pathname.startsWith('/dashboard/homeowner')) return NAVIGATION_CONFIG.homeowner
  if (pathname.startsWith('/dashboard/admin')) return NAVIGATION_CONFIG.admin
  return NAVIGATION_CONFIG[role] ?? NAVIGATION_CONFIG.client
}

function checkIsActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userRole?: string
  userEmail?: string
  onLogout?: () => void
}

export function DashboardLayout({
  children,
  userName = 'System User',
  userRole = 'client',
  userEmail = 'user@nexusops.com',
  onLogout,
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navItems = resolveNavigation(userRole, pathname)
  const currentActiveItem = navItems.find(item => checkIsActive(item, pathname))
  const pageTitle = currentActiveItem?.label ?? 'Dashboard'

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userInitials = userName.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={`min-h-screen w-full flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isDesktopCollapsed ? '80px' : '280px',
          x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? '-100%' : 0)
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed lg:relative top-0 left-0 h-screen z-50 flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl lg:shadow-none"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <motion.span 
              animate={{ opacity: isDesktopCollapsed ? 0 : 1, display: isDesktopCollapsed ? 'none' : 'block' }}
              className="text-sm font-bold tracking-wide whitespace-nowrap"
            >
              NEXUS OPS
            </motion.span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar flex flex-col gap-1">
          <motion.div 
            animate={{ opacity: isDesktopCollapsed ? 0 : 1 }}
            className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            {!isDesktopCollapsed && 'Menu'}
          </motion.div>
          
          {navItems.map((item) => {
            const isActive = checkIsActive(item, pathname)
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="relative group">
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <div className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100'}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'}`} />
                    <motion.span animate={{ opacity: isDesktopCollapsed ? 0 : 1, width: isDesktopCollapsed ? 0 : 'auto' }} className="text-sm whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  </div>
                  {!isDesktopCollapsed && item.badge && (
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 py-0.5 px-2 rounded-full text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <button 
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden lg:flex w-full items-center justify-center py-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isDesktopCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-white hidden sm:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 w-64 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-white" />
              <div className="flex items-center gap-1 text-[10px] font-medium opacity-50">
                <kbd className="bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded shadow-sm border border-neutral-200 dark:border-neutral-600">⌘</kbd>
                <kbd className="bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded shadow-sm border border-neutral-200 dark:border-neutral-600">K</kbd>
              </div>
            </div>

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900" />
            </button>

            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold leading-none">{userName}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">{userRole}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-sm font-semibold truncate">{userName}</p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">{userEmail}</p>
                    </div>
                    <div className="p-1.5">
                      <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors">
                        <UserIcon className="w-4 h-4" /> Account Settings
                      </Link>
                      {onLogout && (
                        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors mt-1">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
