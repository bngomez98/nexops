"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Zap,
  ArrowUpRight,
} from "lucide-react"

const SERVICE_CATEGORIES = [
  "Tree Removal",
  "Concrete Work",
  "Roofing",
  "HVAC",
  "Fencing",
  "Electrical",
  "Plumbing",
  "Excavation",
]

export default function ContractorSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [serviceCategories, setServiceCategories] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "contractor") {
      router.replace("/login")
      return
    }
    setUser(stored)
    setName(stored.name ?? "")
    setPhone(stored.phone ?? "")
    setBusinessName(stored.businessName ?? "")
    setLicenseNumber(stored.licenseNumber ?? "")
    setServiceCategories(stored.serviceCategories ?? [])
  }, [router])

  function toggleCategory(cat: string) {
    setServiceCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    // Simulate save (no DB persistence in demo)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) return null

  const planDetails: Record<string, { leads: string; notice: string; price: string }> = {
    standard: { leads: "Unlimited", notice: "Real-time (FCFS pool)", price: "$299/mo" },
    premium: { leads: "Unlimited", notice: "90-second advance window", price: "$499/mo" },
    elite: { leads: "Unlimited", notice: "10-min exclusive on $5K+ projects", price: "$749/mo" },
  }
  const plan = planDetails[user.subscription ?? "standard"]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-primary text-sm font-medium mb-1">Contractor Portal</p>
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your business profile and subscription.</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
            <CardDescription>Personal and business information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium">Full name</label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <Input value={user.email} disabled className="opacity-60 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="business" className="text-sm font-medium flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Business name
                  </label>
                  <Input id="business" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="license" className="text-sm font-medium flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> License number
                  </label>
                  <Input id="license" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                </div>
              </div>

              {/* Service categories */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Service categories</label>
                <p className="text-xs text-muted-foreground">Select all categories you actively work in.</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        serviceCategories.includes(cat)
                          ? "bg-primary/20 border-primary text-primary"
                          : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                </p>
              )}
              {saved && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Changes saved.
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Subscription
            </CardTitle>
            <CardDescription>Current plan and billing details.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Current plan</span>
              <span className="text-sm font-semibold capitalize text-primary">{user.subscription ?? "standard"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Monthly price</span>
              <span className="text-sm font-medium">{plan.price}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Advance notice</span>
              <span className="text-sm font-medium">{plan.notice}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Lead access</span>
              <span className="text-sm font-medium">{plan.leads}</span>
            </div>
            <div className="pt-2">
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Compare membership plans <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
