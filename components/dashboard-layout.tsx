'use client'

import React from "react"

import Link from 'next/link'
import { useAuth } from '@/app/lib/auth-context'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) {
    return null
  }

  const navItems = {
    client: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Requests', href: '/dashboard/requests' },
      { label: 'Contractors', href: '/dashboard/contractors' },
      { label: 'Invoices', href: '/dashboard/invoices' },
    ],
    contractor: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Available Jobs', href: '/dashboard/jobs' },
      { label: 'My Work', href: '/dashboard/work' },
      { label: 'Earnings', href: '/dashboard/earnings' },
    ],
    admin: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'All Requests', href: '/dashboard/all-requests' },
      { label: 'Team', href: '/dashboard/team' },
      { label: 'Reports', href: '/dashboard/reports' },
    ],
  }

  const currentNav = navItems[user.role]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">Nexus</h1>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground px-2 py-1 bg-secondary rounded">
                {user.role}
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {currentNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 border-l border-border pl-4">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-muted-foreground hover:text-foreground"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="mt-4 flex flex-col gap-1 border-t border-border pt-4 md:hidden">
              {currentNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
