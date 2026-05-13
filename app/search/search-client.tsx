'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Search, Building2, ClipboardList, HardHat, ArrowRight, MapPin, BadgeCheck } from 'lucide-react'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/app/lib/auth-context'

interface Request {
  id: string
  title: string
  description: string | null
  status: string
  created_at: string
  property_id: string | null
}

interface Property {
  id: string
  name: string
  address: string
  city: string | null
  state: string | null
  property_type: string | null
}

interface Contractor {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  trade_categories: string[] | null
  bio: string | null
}

const STATUS_COLORS: Record<string, string> = {
  available:   'bg-emerald-100 text-emerald-700',
  claimed:     'bg-sky-100 text-sky-700',
  'in-progress':'bg-violet-100 text-violet-700',
  completed:   'bg-muted text-muted-foreground',
  invoiced:    'bg-amber-100 text-amber-700',
  pending:     'bg-amber-100 text-amber-700',
}

const TABS = [
  { id: 'requests',    label: 'Requests',    icon: ClipboardList },
  { id: 'properties',  label: 'Properties',  icon: Building2 },
  { id: 'contractors', label: 'Contractors', icon: HardHat },
] as const

type TabId = typeof TABS[number]['id']

interface SearchClientProps {
  initialQuery: string
  initialTab: string
  requests: Request[]
  properties: Property[]
  contractors: Contractor[]
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function SearchClient({
  initialQuery,
  initialTab,
  requests,
  properties,
  contractors,
}: SearchClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialQuery)
  const [tab, setTab] = useState<TabId>(
    TABS.some(t => t.id === initialTab) ? (initialTab as TabId) : 'requests'
  )
  const { user, logout } = useAuth()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}&tab=${tab}`)
    })
  }

  function handleTabChange(newTab: TabId) {
    setTab(newTab)
    if (query) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query)}&tab=${newTab}`)
      })
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const currentCount =
    tab === 'requests' ? requests.length :
    tab === 'properties' ? properties.length :
    contractors.length

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        userName={user?.name ?? 'User'}
        role={(user?.role as 'homeowner' | 'contractor' | 'property-manager' | 'admin') ?? 'homeowner'}
        onLogout={handleLogout}
      />
      <main className="md:ml-[260px] p-5 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Search</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Find requests, properties, and contractors across the platform.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search requests, addresses, contractor names…"
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {isPending ? 'Searching…' : 'Search'}
          </button>
        </form>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        {!initialQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">Start searching</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Type at least 2 characters to search across requests, properties, and contractors.
            </p>
          </div>
        ) : currentCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-base font-semibold text-foreground">No results for &ldquo;{initialQuery}&rdquo;</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different keyword or check your spelling.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">{currentCount} result{currentCount !== 1 ? 's' : ''} for &ldquo;{initialQuery}&rdquo;</p>

            {/* Requests */}
            {tab === 'requests' && requests.map(req => (
              <Link
                key={req.id}
                href={`/dashboard/requests/${req.id}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:bg-muted/30 hover:border-primary/30 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="text-sm font-semibold text-foreground truncate">{req.title}</p>
                  </div>
                  {req.description && (
                    <p className="text-[13px] text-muted-foreground line-clamp-2">{req.description}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[req.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {req.status?.replace('-', ' ')}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}

            {/* Properties */}
            {tab === 'properties' && properties.map(prop => (
              <Link
                key={prop.id}
                href={`/dashboard/homeowner/properties/${prop.id}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:bg-muted/30 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{prop.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-[13px] text-muted-foreground truncate">
                        {prop.address}{prop.city ? `, ${prop.city}` : ''}{prop.state ? `, ${prop.state}` : ''}
                      </p>
                    </div>
                    {prop.property_type && (
                      <p className="text-[11px] text-muted-foreground mt-1 capitalize">{prop.property_type.replace('_', ' ')}</p>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}

            {/* Contractors */}
            {tab === 'contractors' && contractors.map(contractor => {
              const initials = getInitials(contractor.full_name || contractor.email)
              const categories = contractor.trade_categories ?? []
              return (
                <Link
                  key={contractor.id}
                  href={`/search/contractor/${contractor.id}`}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:bg-muted/30 hover:border-primary/30 transition-all group"
                >
                  {contractor.photo_url ? (
                    <Image
                      src={contractor.photo_url}
                      alt={contractor.full_name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{contractor.full_name}</p>
                      <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    {contractor.bio && (
                      <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-1">{contractor.bio}</p>
                    )}
                    {categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {categories.slice(0, 4).map(cat => (
                          <span key={cat} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">
                            {cat.replace('-', ' ')}
                          </span>
                        ))}
                        {categories.length > 4 && (
                          <span className="text-[11px] text-muted-foreground">+{categories.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
