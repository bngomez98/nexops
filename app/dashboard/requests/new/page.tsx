'use client'

import React, { useState, useEffect } from "react"
import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { ChevronLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const serviceTypes = [
  'Roof repair',
  'Gutter cleaning',
  'HVAC inspection',
  'Concrete repair',
  'Fence repair',
  'Plumbing',
  'Electrical',
  'Painting',
  'Other',
]

export default function NewRequestPage() {
  const { user, isLoggedIn } = useAuth()
  const { addRequest } = useRequests()
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'dates' | 'review'>('details')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    type: '',
    property: '',
    description: '',
    budget: '',
    dueDate: '',
  })

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'client') {
      router.push('/login')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== 'client') {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setError('')
    if (step === 'details') {
      if (!formData.type || !formData.property || !formData.description || !formData.budget) {
        setError('Please fill in all fields')
        return
      }
      setStep('dates')
    } else if (step === 'dates') {
      if (!formData.dueDate) {
        setError('Please select a due date')
        return
      }
      setStep('review')
    }
  }

  const handleBack = () => {
    if (step === 'dates') {
      setStep('details')
    } else if (step === 'review') {
      setStep('dates')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    addRequest({
      propertyId: 'prop-1',
      propertyName: formData.property,
      type: formData.type,
      status: 'pending',
      budget: parseInt(formData.budget),
      dueDate: formData.dueDate,
      description: formData.description,
    })
    
    router.push('/dashboard/requests')
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div
              className={`flex-1 h-1 rounded-full ${
                step === 'details' || step === 'dates' || step === 'review' ? 'bg-primary' : 'bg-border'
              }`}
            />
            <div
              className={`flex-1 h-1 rounded-full ${step === 'dates' || step === 'review' ? 'bg-primary' : 'bg-border'}`}
            />
            <div className={`flex-1 h-1 rounded-full ${step === 'review' ? 'bg-primary' : 'bg-border'}`} />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Describe your project</h1>
                <p className="text-muted-foreground">Tell us what needs to be done</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Service type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Property address</label>
                <input
                  type="text"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  placeholder="e.g., 1420 N Maple St"
                  className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the work that needs to be done..."
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Budget cap</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 'dates' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">When do you need this done?</h1>
                <p className="text-muted-foreground">Select your preferred timeline</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Due date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Review your request</h1>
                <p className="text-muted-foreground">Make sure everything looks correct</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Service type</p>
                  <p className="text-sm font-medium text-foreground">{formData.type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Property</p>
                  <p className="text-sm font-medium text-foreground">{formData.property}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Description</p>
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Budget cap</p>
                  <p className="text-sm font-medium text-foreground">${parseInt(formData.budget).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Due date</p>
                  <p className="text-sm font-medium text-foreground">{formData.dueDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleBack}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-opacity ${
                step === 'details'
                  ? 'text-muted-foreground cursor-not-allowed opacity-50'
                  : 'text-foreground hover:bg-secondary'
              }`}
              disabled={step === 'details'}
            >
              Back
            </button>

            {step === 'review' ? (
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit request
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
