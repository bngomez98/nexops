"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { storeUser, getStoredUser } from "@/lib/auth"
import { Eye, EyeOff, ArrowRight, CheckCircle2, Home, Wrench } from "lucide-react"

const SERVICE_CATEGORIES = ["Tree Removal", "Concrete Work", "Roofing", "HVAC", "Fencing", "Electrical", "Plumbing", "Excavation"]
const SUBSCRIPTION_TIERS = [
  { value: "standard", label: "Standard", price: "$299/mo" },
  { value: "premium", label: "Premium", price: "$499/mo" },
  { value: "elite", label: "Elite", price: "$749/mo" },
]

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"

  const [tab, setTab] = useState<"login" | "signup">(defaultTab as "login" | "signup")
  const [role, setRole] = useState<"homeowner" | "contractor">("homeowner")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupAddress, setSignupAddress] = useState("")
  const [signupBusiness, setSignupBusiness] = useState("")
  const [signupLicense, setSignupLicense] = useState("")
  const [signupCategories, setSignupCategories] = useState<string[]>([])
  const [signupSubscription, setSignupSubscription] = useState("standard")

  useEffect(() => {
    // Redirect if already logged in
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
          {tab === "signup" && role === "homeowner" ? (
            <>
              <p className="text-primary text-sm font-medium tracking-wide mb-4">For homeowners in Topeka, KS</p>
              <h2 className="text-3xl font-semibold leading-snug tracking-tight mb-8">
                One request.<br />One verified contractor.<br />No bidding wars.
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "Free to submit — no cost to homeowners, ever",
                  "Matched with a single licensed, insured contractor",
                  "Photos and written scope collected before any contractor is involved",
                  "Post Implementation Review on every completed project",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-primary text-sm font-medium tracking-wide mb-4">For licensed contractors in Topeka, KS</p>
              <h2 className="text-3xl font-semibold leading-snug tracking-tight mb-8">
                Exclusive projects.<br />Full documentation upfront.<br />One flat monthly fee.
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "One project, one contractor — the moment you claim it, no one else can",
                  "Every request includes photos, written scope, and a defined budget cap",
                  "Month-to-month membership — cancel from your dashboard at any time",
                  "Real-time notifications and performance analytics",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Nexus Operations, LLC &middot; Topeka, KS
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

              {/* Demo credentials hint */}
              <div className="mb-6 p-3 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-xs font-medium text-primary mb-1">Demo accounts</p>
                <p className="text-xs text-muted-foreground">homeowner@demo.com / demo123</p>
                <p className="text-xs text-muted-foreground">contractor@demo.com / demo123</p>
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
                <p className="text-sm text-muted-foreground">Submit a project request or apply to join the contractor network.</p>
              </div>

              {/* Role picker */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">I am a…</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: "homeowner", label: "Homeowner", Icon: Home, desc: "Find verified contractors" },
                    { value: "contractor", label: "Contractor", Icon: Wrench, desc: "Get exclusive projects" },
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
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-address" className="text-sm font-medium">Service address</label>
                    <Input
                      id="signup-address"
                      placeholder="123 Main St, Topeka, KS"
                      value={signupAddress}
                      onChange={(e) => setSignupAddress(e.target.value)}
                      autoComplete="street-address"
                    />
                  </div>
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
