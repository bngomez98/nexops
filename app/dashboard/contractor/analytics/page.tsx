'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { BarChart3, Award, TrendingUp, Target, Briefcase, Star } from 'lucide-react'

interface ContractorProfile {
  companyName: string
  membershipTier: string
  currentActiveProjects: number
  maxActiveProjects: number
  averageRating: number
  totalReviews: number
  yearsInBusiness: number
  serviceCategories: string[]
}

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const data = await res.json()
        if (data.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
        setUser(data.user)
        setProfile(data.contractorProfile)
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    )
  }

  if (!user) return null

  const capacityPct = profile
    ? Math.min(100, Math.round((profile.currentActiveProjects / Math.max(profile.maxActiveProjects, 1)) * 100))
    : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.companyName || user.name} — your live account metrics
          </p>
        </div>

        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Projects</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {profile?.currentActiveProjects ?? 0}
                  </p>
                </div>
                <Briefcase className="w-7 h-7 text-primary opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">of {profile?.maxActiveProjects ?? 0} capacity</p>
            </div>

            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rating</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {profile?.averageRating ? `${profile.averageRating.toFixed(1)}/5` : '—'}
                  </p>
                </div>
                <Star className="w-7 h-7 text-muted-foreground opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">
                {profile?.totalReviews ?? 0} review{profile?.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Membership</p>
                  <p className="text-3xl font-bold text-foreground mt-1 capitalize">
                    {profile?.membershipTier || 'Starter'}
                  </p>
                </div>
                <Award className="w-7 h-7 text-primary opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">Current plan</p>
            </div>

            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Categories</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {profile?.serviceCategories?.length ?? 0}
                  </p>
                </div>
                <Target className="w-7 h-7 text-primary opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">Service areas</p>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Project Capacity</h2>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {profile?.currentActiveProjects ?? 0} of {profile?.maxActiveProjects ?? 0} slots used
              </span>
              <span className="font-semibold text-foreground">{capacityPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  capacityPct >= 100
                    ? 'bg-red-500'
                    : capacityPct >= 75
                    ? 'bg-amber-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {capacityPct >= 100
                ? 'At full capacity — upgrade your plan to take on more projects.'
                : `${(profile?.maxActiveProjects ?? 0) - (profile?.currentActiveProjects ?? 0)} slot${
                    (profile?.maxActiveProjects ?? 0) - (profile?.currentActiveProjects ?? 0) !== 1 ? 's' : ''
                  } available.`}
            </p>
          </div>

          {/* Service categories */}
          {profile?.serviceCategories && profile.serviceCategories.length > 0 && (
            <div className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Service Categories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.serviceCategories.map(cat => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium capitalize"
                  >
                    {cat.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating breakdown */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Profile Overview</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Average Rating</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-foreground">
                    {profile?.averageRating ? profile.averageRating.toFixed(1) : '—'}
                  </p>
                  {profile?.averageRating ? (
                    <p className="text-sm text-muted-foreground mb-1">/5.0</p>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile?.totalReviews ?? 0} total review{profile?.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Experience</p>
                <p className="text-4xl font-bold text-foreground">
                  {profile?.yearsInBusiness ?? '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile?.yearsInBusiness ? 'year' + (profile.yearsInBusiness !== 1 ? 's' : '') + ' in business' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Plan Capacity</p>
                <p className="text-4xl font-bold text-foreground">
                  {profile?.maxActiveProjects ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">max active projects</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
