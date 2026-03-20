'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormError } from '@/components/form-error'
import { ImageUpload } from '@/components/image-upload'
import { DashboardNav } from '@/components/dashboard-nav'
import { projectRequestSchema } from '@/lib/validators'
import { ZodError } from 'zod'

const SERVICE_CATEGORIES = [
  { value: 'tree-removal', label: 'Tree Removal' },
  { value: 'concrete-work', label: 'Concrete Work' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'fencing', label: 'Fencing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'excavation', label: 'Excavation' },
]

export default function NewProjectRequest() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    budget: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [uploadedImages, setUploadedImages] = useState<File[]>([])

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const data = await response.json()
        if (data.user.role !== 'homeowner') {
          router.push('/dashboard/contractor')
          return
        }
        setUser(data.user)
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    try {
      const validatedData = projectRequestSchema.parse({
        category: formData.category,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        budget: formData.budget,
      })

      setSubmitting(true)

      // Prepare form data for file upload
      const payload = new FormData()
      payload.append('category', validatedData.category)
      payload.append('title', validatedData.title)
      payload.append('description', validatedData.description)
      payload.append('location', validatedData.location)
      if (validatedData.budget) {
        payload.append('budget', String(parseFloat(validatedData.budget)))
      }

      // Add images
      uploadedImages.forEach((image) => {
        payload.append('images', image)
      })

      const response = await fetch('/api/projects/create', {
        method: 'POST',
        body: payload,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create project request')
        return
      }

      router.push('/dashboard/homeowner')
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach(error => {
          const path = error.path[0] as string
          errors[path] = error.message
        })
        setFieldErrors(errors)
        setError('Please correct the errors below')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
      }} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Post a New Project Request</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Describe your project and licensed contractors will reach out with bids.
          </p>
        </div>
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <FormError message={error} />}

            {/* Service Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Service Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 rounded-md border ${fieldErrors.category ? 'border-red-500' : 'border-input'} bg-input text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                <option value="">Select a category</option>
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {fieldErrors.category && <p className="text-sm text-red-500">{fieldErrors.category}</p>}
            </div>

            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Roof Repair - Leaking Shingles"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={fieldErrors.title ? 'border-red-500' : ''}
              />
              {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail. What needs to be done? Any specific requirements or preferences?"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                required
                className={`w-full px-3 py-2 rounded-md border ${fieldErrors.description ? 'border-red-500' : 'border-input'} bg-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              />
              {fieldErrors.description && <p className="text-sm text-red-500">{fieldErrors.description}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Project Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="City, State"
                value={formData.location}
                onChange={handleInputChange}
                required
                className={fieldErrors.location ? 'border-red-500' : ''}
              />
              {fieldErrors.location && <p className="text-sm text-red-500">{fieldErrors.location}</p>}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">$</span>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="5000"
                  step="0.01"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leaving this blank helps you get more competitive bids
              </p>
            </div>

            {/* Project Images */}
            <div className="space-y-2">
              <Label>Project Photos (Optional)</Label>
              <ImageUpload
                onImagesChange={setUploadedImages}
                maxFiles={5}
                maxSizeInMB={10}
              />
              <p className="text-xs text-muted-foreground">
                Add up to 5 photos of your project to help contractors understand the scope better
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Posting...' : 'Post Project Request'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
