'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut, TrendingUp, BarChart3, Award, Target, ArrowLeft } from 'lucide-react'

interface Analytics {
  totalProjects: number
  completedProjects: number
  activeProjects: number
  averageRating: number
  totalReviews: number
  totalEarnings: number
  conversionRate: number
  avgProjectValue: number
}

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [analytics, setAnalytics] = useState<Analytics>({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    averageRating: 0,
    totalReviews: 0,
    totalEarnings: 0,
    conversionRate: 0,
    avgProjectValue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        if (userData.user.role !== 'contractor') {
          router.push('/dashboard/homeowner')
          return
        }
        setUser(userData.user)

        // Mock analytics data - in production, this would come from the backend
        setAnalytics({
          totalProjects: 24,
          completedProjects: 18,
          activeProjects: 3,
          averageRating: 4.8,
          totalReviews: 42,
          totalEarnings: 45320,
          conversionRate: 68,
          avgProjectValue: 1889,
        })
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const successRate = (analytics.completedProjects / Math.max(analytics.totalProjects, 1)) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your business metrics and growth</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Total Projects */}
            <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.totalProjects}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </div>

            {/* Completed Projects */}
            <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.completedProjects}</p>
                </div>
                <Award className="w-8 h-8 text-emerald-500 opacity-50" />
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{successRate.toFixed(1)}% success rate</p>
            </div>

            {/* Average Rating */}
            <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.averageRating.toFixed(1)}/5.0</p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground">Based on {analytics.totalReviews} reviews</p>
            </div>

            {/* Conversion Rate */}
            <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.conversionRate}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground">Bids to projects</p>
            </div>
          </div>

          {/* Revenue Section */}
          <div className="border border-border rounded-lg p-8 bg-muted/30">
            <h2 className="text-2xl font-bold text-foreground mb-6">Revenue Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-primary">${analytics.totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">All completed projects</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Average Project Value</p>
                <p className="text-4xl font-bold text-accent">${analytics.avgProjectValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">Per completed project</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Active Projects</p>
                <p className="text-4xl font-bold text-foreground">{analytics.activeProjects}</p>
                <p className="text-xs text-muted-foreground mt-2">Currently in progress</p>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Performance Insights</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="text-blue-500 mt-1">✓</div>
                <div>
                  <p className="font-semibold text-foreground">Strong Completion Rate</p>
                  <p className="text-sm text-muted-foreground">Your {successRate.toFixed(1)}% completion rate is above average. Keep maintaining this quality!</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900">
                <div className="text-amber-500 mt-1">★</div>
                <div>
                  <p className="font-semibold text-foreground">Excellent Rating</p>
                  <p className="text-sm text-muted-foreground">Your {analytics.averageRating.toFixed(1)}/5 rating puts you in the top 10% of contractors on Nexus Operations.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <div className="text-emerald-500 mt-1">→</div>
                <div>
                  <p className="font-semibold text-foreground">High Conversion Rate</p>
                  <p className="text-sm text-muted-foreground">Your {analytics.conversionRate}% bid-to-project conversion rate is excellent. Consider increasing your bid frequency.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Recommendations */}
          <div className="border border-border rounded-lg p-8 bg-primary/5">
            <h2 className="text-2xl font-bold text-foreground mb-6">Growth Recommendations</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">1</div>
                <div>
                  <p className="font-semibold text-foreground">Optimize Your Profile</p>
                  <p className="text-sm text-muted-foreground">Add more details and photos to your contractor profile to increase visibility to homeowners.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">2</div>
                <div>
                  <p className="font-semibold text-foreground">Expand Service Categories</p>
                  <p className="text-sm text-muted-foreground">Consider adding complementary services to capture more project opportunities in your area.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">3</div>
                <div>
                  <p className="font-semibold text-foreground">Upgrade Membership</p>
                  <p className="text-sm text-muted-foreground">With your strong metrics, consider upgrading to capture more premium projects and increase capacity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
