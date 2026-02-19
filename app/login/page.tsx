"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { storeUser, getStoredUser, type PropertyType } from "@/lib/auth"
import { Eye, EyeOff, ArrowRight, CheckCircle2, Building2, Wrench, Home, CalendarClock, Zap } from "lucide-react"

const SERVICE_CATEGORIES = ["Tree Removal", "Concrete Work", "Roofing", "HVAC", "Fencing", "Electrical", "Plumbing", "Excavation"]
const SUBSCRIPTION_TIERS = [
  { value: "standard", label: "Standard", price: "$299/mo" },
  { value: "premium", label: "Premium", price: "$499/mo" },
  { value: "elite", label: "Elite", price: "$749/mo" },
]

const PROPERTY_TYPES: { value: PropertyType; label: string; Icon: React.ElementType; desc: string }[] = [
  { value: "homeowner", label: "Homeowner", Icon: Home, desc: "Single property" },
  { value: "property_manager", label: "Property Manager", Icon: Building2, desc: "Portfolio of units" },
  { value: "airbnb_host", label: "Airbnb / STR Host", Icon: CalendarClock, desc: "Short-term rentals" },
]

const DEMO_ACCOUNTS = [
  {
    label: "Property manager demo",
    email: "homeowner@demo.com",
    password: "demo123",
    role: "homeowner" as const,
    propertyType: "property_manager" as PropertyType,
    propertyCount: 12,
    description: "Multi-unit portfolio view",
  },
  {
    label: "Airbnb host demo",
    email: "homeowner@demo.com",
    password: "demo123",
    role: "homeowner" as const,
    propertyType: "airbnb_host" as PropertyType,
    propertyCount: 3,
    description: "Turnover & STR workflow",
  },
  {
    label: "Contractor demo",
    email: "contractor@demo.com",
    password: "demo123",
    role: "contractor" as const,
    propertyType: undefined,
    propertyCount: undefined,
    description: "Vendor dashboard & leads",
  },
]

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"

  const [tab, setTab] = useState<"login" | "signup">(defaultTab as "login" | "signup")
  const [role, setRole] = useState<"homeowner" | "contractor">("homeowner")
  const [propertyType, setPropertyType] = useState<PropertyType>("homeowner")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupAddress, setSignupAddress] = useState("")
  const [signupBusiness, setSignupBusiness] = useState("")
  const [signupLicense, setSignupLicense] = useState("")
  const [signupCategories, setSignupCategories] = useState<string[]>([])
  const [signupSubscription, setSignupSubscription] = useState("standard")
  const [signupPropertyCount, setSignupPropertyCount] = useState("")

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      router.replace(`/dashboard/${user.role}`)
    }
  }, [router])

  function toggleCategory(cat: string) {
    setSignupCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  async function handleDemoLogin(demo: typeof DEMO_ACCOUNTS[number]) {
    setError("")
    setDemoLoading(demo.label)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demo.email, password: demo.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Demo login failed")
        return
      }
      const enriched = {
        ...data.user,
        ...(demo.propertyType !== undefined && { propertyType: demo.propertyType }),
        ...(demo.propertyCount !== undefined && { propertyCount: demo.propertyCount }),
      }
      storeUser(enriched)
      router.push(`/dashboard/${data.user.role}`)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setDemoLoading(null)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Login failed")
        return
      }
      storeUser(data.user)
      router.push(`/dashboard/${data.user.role}`)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (role === "contractor" && signupCategories.length === 0) {
      setError("Please select at least one service category.")
      return
    }

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        role,
        phone: signupPhone,
      }
      if (role === "homeowner") {
        body.address = signupAddress
        body.propertyType = propertyType
        body.propertyCount = signupPropertyCount ? parseInt(signupPropertyCount) : 1
      } else {
        body.businessName = signupBusiness
        body.licenseNumber = signupLicense
        body.serviceCategories = signupCategories
        body.subscription = signupSubscription
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Sign up failed")
        return
      }
      storeUser(data.user)
      router.push(`/dashboard/${data.user.role}`)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-shrink-0 bg-secondary border-r border-border/40 flex-col justify-between p-12">
        <Link href="/" aria-label="Back to home">
          <Logo />
        </Link>

        <div>
          <p className="text-primary text-sm font-medium tracking-wide mb-4">Property &amp; vendor operations</p>
          <h2 className="text-3xl font-semibold leading-snug tracking-tight mb-8">
            Automate the maintenance.<br />Own the vendor relationships.<br />Run every property.
          </h2>
          <ul className="flex flex-col gap-4 mb-10">
            {[
              "Work orders dispatched in minutes, not days",
              "Verified, insured contractors — always exclusive",
              "Cost and service history across every property",
              "Scales from one home to a full portfolio",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* Quick demo access on left panel */}
          <div className="p-4 rounded-xl border border-border/40 bg-card/30">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-primary">Explore without signing up</p>
            </div>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => handleDemoLogin(demo)}
                  disabled={demoLoading !== null}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/30 bg-secondary/50 hover:bg-secondary hover:border-primary/30 transition-all duration-200 text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="text-xs font-semibold group-hover:text-foreground text-muted-foreground transition-colors">{demo.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{demo.description}</p>
                  </div>
                  {demoLoading === demo.label ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Nexus Operations, LLC
        </p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Mobile demo access */}
          <div className="lg:hidden mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-primary">Try a demo account</p>
            </div>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => handleDemoLogin(demo)}
                  disabled={demoLoading !== null}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-primary/20 bg-background hover:bg-primary/5 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="text-xs font-semibold">{demo.label}</p>
                    <p className="text-[10px] text-muted-foreground">{demo.description}</p>
                  </div>
                  {demoLoading === demo.label ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => { setTab(v as "login" | "signup"); setError("") }}>
            <TabsList className="w-full mb-8">
              <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Create Account</TabsTrigger>
            </TabsList>

            {/* ── SIGN IN ── */}
            <TabsContent value="login">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to your Nexus Operations account.</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                >
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("signup"); setError("") }}
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </button>
              </p>
            </TabsContent>

            {/* ── SIGN UP ── */}
            <TabsContent value="signup">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
                <p className="text-sm text-muted-foreground">Tell us how you use your properties.</p>
              </div>

              {/* Role picker */}
              <div className="mb-5">
                <p className="text-sm font-medium mb-3">I am a…</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: "homeowner", label: "Property Owner / Manager", Icon: Building2, desc: "Homeowner, PM, or STR host" },
                    { value: "contractor", label: "Contractor / Vendor", Icon: Wrench, desc: "Service provider" },
                  ] as const).map(({ value, label, Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setRole(value); setError("") }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                        role === value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/40 text-muted-foreground hover:border-border hover:bg-secondary"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${role === value ? "text-primary" : ""}`} />
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type selector — only for homeowner role */}
              {role === "homeowner" && (
                <div className="mb-5">
                  <p className="text-sm font-medium mb-3">How I use my properties</p>
                  <div className="flex flex-col gap-2">
                    {PROPERTY_TYPES.map(({ value, label, Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPropertyType(value)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                          propertyType === value
                            ? "border-primary bg-primary/10"
                            : "border-border/40 hover:border-border hover:bg-secondary"
                        }`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${propertyType === value ? "text-primary" : "text-muted-foreground"}`} />
                        <div>
                          <p className={`text-sm font-medium ${propertyType === value ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-name" className="text-sm font-medium">Full name <span className="text-primary">*</span></label>
                  <Input
                    id="signup-name"
                    placeholder="Jane Smith"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-email" className="text-sm font-medium">Email <span className="text-primary">*</span></label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-password" className="text-sm font-medium">Password <span className="text-primary">*</span></label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>

                {/* Homeowner-specific fields */}
                {role === "homeowner" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-address" className="text-sm font-medium">Primary property address</label>
                      <Input
                        id="signup-address"
                        placeholder="123 Main St, City, State"
                        value={signupAddress}
                        onChange={(e) => setSignupAddress(e.target.value)}
                        autoComplete="street-address"
                      />
                    </div>
                    {(propertyType === "property_manager" || propertyType === "airbnb_host") && (
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="signup-count" className="text-sm font-medium">Number of properties</label>
                        <Input
                          id="signup-count"
                          type="number"
                          min="1"
                          placeholder="How many properties do you manage?"
                          value={signupPropertyCount}
                          onChange={(e) => setSignupPropertyCount(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Contractor-specific fields */}
                {role === "contractor" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-business" className="text-sm font-medium">Business name <span className="text-primary">*</span></label>
                      <Input
                        id="signup-business"
                        placeholder="Smith Tree Services LLC"
                        value={signupBusiness}
                        onChange={(e) => setSignupBusiness(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-license" className="text-sm font-medium">License number</label>
                      <Input
                        id="signup-license"
                        placeholder="KS-TC-2024-XXXX"
                        value={signupLicense}
                        onChange={(e) => setSignupLicense(e.target.value)}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Service categories <span className="text-primary">*</span></p>
                      <div className="flex flex-wrap gap-2">
                        {SERVICE_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              signupCategories.includes(cat)
                                ? "bg-primary/20 border-primary text-primary"
                                : "border-border/40 text-muted-foreground hover:border-border"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-subscription" className="text-sm font-medium">Subscription tier</label>
                      <div className="grid grid-cols-3 gap-2">
                        {SUBSCRIPTION_TIERS.map(({ value, label, price }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSignupSubscription(value)}
                            className={`flex flex-col items-center gap-0.5 p-3 rounded-lg border text-center transition-all ${
                              signupSubscription === value
                                ? "border-primary bg-primary/10"
                                : "border-border/40 hover:border-border"
                            }`}
                          >
                            <span className="text-xs font-semibold">{label}</span>
                            <span className="text-[10px] text-muted-foreground">{price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                >
                  {loading ? "Creating account…" : "Create Account"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("login"); setError("") }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
