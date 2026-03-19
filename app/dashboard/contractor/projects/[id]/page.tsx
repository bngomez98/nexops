'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut, ArrowLeft, MessageSquare, MapPin, Calendar, DollarSign, Star, Share2 } from 'lucide-react'

interface ProjectDetails {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  status: string
  homeownerName: string
  homeownerRating: number
  homeownerReviews: number
  createdAt: string
  images: string[]
}

export default function ProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [user, setUser] = useState<any>(null)
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [bidDescription, setBidDescription] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)

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

        // Mock project data - in production, this would come from the API
        setProject({
          id: projectId,
          title: 'Roof Repair - Leaking Shingles',
          description: 'We have a roof leak that started about 2 weeks ago. It\'s coming from the south-facing side near the chimney. We\'ve noticed water stains on the ceiling in our master bedroom. The roof is about 10 years old and this is the first major issue we\'ve had. We\'d like someone who can assess the damage and provide recommendations for repair or replacement.',
          category: 'roofing',
          location: 'Topeka, KS',
          budget: 5000,
          status: 'open',
          homeownerName: 'John Smith',
          homeownerRating: 4.8,
          homeownerReviews: 12,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
        })
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, projectId])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    if (!bidAmount || !bidDescription) return

    setSubmittingBid(true)
    try {
      // In a real app, this would submit to the backend
      console.log('Bid submitted:', { projectId, bidAmount, bidDescription })
      router.push('/dashboard/contractor')
    } catch (error) {
      console.error('Error submitting bid:', error)
    } finally {
      setSubmittingBid(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user || !project) return null

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
              Back to Projects
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Project Details - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold text-foreground">{project.title}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Posted 1 day ago
                </div>
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget: ${project.budget.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Project Images */}
            {project.images.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm">Project images would appear here</div>
                    <div className="text-muted-foreground text-xs mt-2">({project.images.length} images available)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Project Description</h2>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Homeowner Information */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">About the Homeowner</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{project.homeownerName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(project.homeownerRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {project.homeownerRating.toFixed(1)} ({project.homeownerReviews} reviews)
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Homeowner
                </Button>
              </div>
            </div>
          </div>

          {/* Bid Form - Right Column */}
          <div className="sticky top-4 h-fit">
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <h2 className="text-xl font-bold text-foreground mb-6">Submit Your Bid</h2>

              <form onSubmit={submitBid} className="space-y-4">
                {/* Bid Amount */}
                <div className="space-y-2">
                  <label htmlFor="bidAmount" className="text-sm font-semibold text-foreground">
                    Your Bid Amount *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <input
                      id="bidAmount"
                      type="number"
                      step="0.01"
                      placeholder="5000"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                      className="flex-1 px-3 py-2 rounded-md border border-input bg-input text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Bid Description */}
                <div className="space-y-2">
                  <label htmlFor="bidDescription" className="text-sm font-semibold text-foreground">
                    Your Proposal *
                  </label>
                  <textarea
                    id="bidDescription"
                    placeholder="Describe your approach, timeline, and why you're the best fit for this project..."
                    value={bidDescription}
                    onChange={(e) => setBidDescription(e.target.value)}
                    rows={4}
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <label htmlFor="timeline" className="text-sm font-semibold text-foreground">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select timeline</option>
                    <option value="1week">Within 1 week</option>
                    <option value="2weeks">Within 2 weeks</option>
                    <option value="1month">Within 1 month</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={submittingBid}
                    className="w-full"
                  >
                    {submittingBid ? 'Submitting...' : 'Submit Bid'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </form>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">Tips for winning this bid:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>✓ Be specific about your approach</li>
                    <li>✓ Include your experience with similar projects</li>
                    <li>✓ Provide a realistic timeline</li>
                    <li>✓ Respond quickly to homeowner questions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
