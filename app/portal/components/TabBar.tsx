'use client'

import { Briefcase, Layout, Search, Shield, User } from 'lucide-react'
import type { Role } from '../lib/mock-data'

export type Tab = 'dashboard' | 'jobs' | 'search' | 'profile' | 'admin'

interface TabBarProps {
  active: Tab
  onChange: (tab: Tab) => void
  role: Role
}

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Home', Icon: Layout },
  { id: 'jobs', label: 'Jobs', Icon: Briefcase },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'profile', label: 'Profile', Icon: User },
]

export function TabBar({ active, onChange, role }: TabBarProps) {
  const tabs = role === 'admin' ? [...TABS, { id: 'admin' as Tab, label: 'Admin', Icon: Shield }] : TABS
  return (
    <nav className="tab-bar" aria-label="Primary">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className="tab-button"
          data-active={active === id}
          onClick={() => onChange(id)}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
