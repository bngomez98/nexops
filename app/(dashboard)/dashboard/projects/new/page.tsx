"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const categories = [
  { id: "plumbing", name: "Plumbing", description: "Pipes, fixtures, water heaters" },
  { id: "electrical", name: "Electrical", description: "Wiring, outlets, panels" },
  { id: "hvac", name: "HVAC", description: "Heating, cooling, ventilation" },
  { id: "roofing", name: "Roofing", description: "Repairs, replacement, gutters" },
  { id: "painting", name: "Painting", description: "Interior, exterior, staining" },
  { id: "flooring", name: "Flooring", description: "Tile, hardwood, carpet" },
  { id: "landscaping", name: "Landscaping", description: "Lawn, garden, irrigation" },
  { id: "other", name: "Other", description: "General repairs and projects" },
]

const urgencyOptions = [
  { id: "emergency", name: "Emergency", description: "Need help today" },
  { id: "soon", name: "Soon", description: "Within the next week" },
  { id: "flexible", name: "Flexible", description: "No rush" },
]

export default function NewProjectPage() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")
  const [urgency, setUrgency] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Would submit to backend
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New project</h1>
          <p className="text-muted-foreground">Tell us what you need done</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              s <= step ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Category & Urgency */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What type of work do you need?</CardTitle>
              <CardDescription>Select the category that best fits your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex flex-col items-start rounded-lg border p-4 text-left transition-colors",
                      category === cat.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">{cat.description}</span>
                  </button>
                ))}
              </div>

              {category && (
                <>
                  <div className="border-t border-border pt-6">
                    <h3 className="font-medium mb-3">How urgent is this?</h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {urgencyOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setUrgency(opt.id)}
                          className={cn(
                            "flex flex-col items-center rounded-lg border p-4 text-center transition-colors",
                            urgency === opt.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium">{opt.name}</span>
                          <span className="text-xs text-muted-foreground">{opt.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!urgency}
                  >
                    Continue
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Describe your project</CardTitle>
              <CardDescription>The more details you provide, the better we can match you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Project title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Fix leaky bathroom faucet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  What needs to be done?
                </label>
                <textarea
                  id="description"
                  className="flex min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe the problem or what you want accomplished..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Estimated budget (optional)
                </label>
                <Input
                  id="budget"
                  placeholder="e.g., $200-500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Photos (optional)</label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!title || !description}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review your project</CardTitle>
              <CardDescription>Make sure everything looks good before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border divide-y divide-border">
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{category}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <p className="font-medium capitalize">{urgency}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{title}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{description}</p>
                </div>
                {budget && (
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{budget}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Submit project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
