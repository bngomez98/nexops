"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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
      if (!res.ok) { setError(data.error ?? "Login failed"); return }
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
        email: signupEmail, password: signupPassword, name: signupName, role, phone: signupPhone,
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
      if (!res.ok) { setError(data.error ?? "Sign up failed"); return }
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
      {/* Left panel — constructivist black branding column */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-shrink-0 bg-foreground flex-col justify-between p-12">
        {/* Red rule at top */}
        <div className="absolute top-0 left-0 w-[480px] xl:w-[560px] h-1 bg-primary" />

        {/* Logo */}
        <Link href="/" aria-label="Back to home">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
              <rect width="180" height="180" fill="currentColor" className="text-primary" />
              <path d="M40 140V40L90 90L140 40V140L90 90L40 140Z" fill="white" fillOpacity="0.95" />
              <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="140" cy="40" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="40" cy="140" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="140" cy="140" r="12" fill="white" fillOpacity="0.95" />
              <circle cx="90" cy="90" r="10" fill="white" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-[0.06em] text-background">NEXUS</span>
              <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-background/40">OPERATIONS</span>
            </div>
          </div>
        </Link>

        <div>
          {tab === "signup" && role === "homeowner" ? (
            <>
              <div className="construct-label mb-6" style={{ color: "var(--primary)" }}>For homeowners in Topeka, KS</div>
              <h2 className="text-3xl lg:text-4xl font-display uppercase leading-[1.0] mb-6 text-background">
                One request.<br />One verified contractor.<br />No bidding wars.
              </h2>
              {/* Red bar */}
              <div className="h-1 w-16 bg-primary mb-8" />
              <ul className="flex flex-col gap-4">
                {[
                  "Free to submit — no cost to homeowners, ever",
                  "Matched with a single licensed, insured contractor",
                  "Photos and written scope collected before any contractor is involved",
                  "Post Implementation Review on every completed project",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-background/60">
                    <div className="w-4 h-4 border-2 border-primary bg-primary flex items-center justify-center mt-0.5 shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="construct-label mb-6" style={{ color: "var(--primary)" }}>For licensed contractors in Topeka, KS</div>
              <h2 className="text-3xl lg:text-4xl font-display uppercase leading-[1.0] mb-6 text-background">
                Exclusive projects.<br />Full documentation upfront.<br />One flat monthly fee.
              </h2>
              <div className="h-1 w-16 bg-primary mb-8" />
              <ul className="flex flex-col gap-4">
                {[
                  "One project, one contractor — the moment you claim it, no one else can",
                  "Every request includes photos, written scope, and a defined budget cap",
                  "Month-to-month membership — cancel from your dashboard at any time",
                  "Real-time notifications and performance analytics",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-background/60">
                    <div className="w-4 h-4 border-2 border-primary bg-primary flex items-center justify-center mt-0.5 shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p className="text-xs text-background/30 font-medium">
          &copy; {new Date().getFullYear()} Nexus Operations, LLC &middot; Topeka, KS
        </p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        {/* Red rule at very top of right panel */}
        <div className="absolute top-0 inset-x-0 h-1 bg-primary lg:left-[480px] xl:left-[560px]" />

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/">
              <div className="flex items-center gap-2.5">
                <svg width="28" height="28" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect width="180" height="180" fill="currentColor" className="text-primary" />
                  <path d="M40 140V40L90 90L140 40V140L90 90L40 140Z" fill="white" fillOpacity="0.95" />
                  <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="140" cy="40" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="40" cy="140" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="140" cy="140" r="12" fill="white" fillOpacity="0.95" />
                  <circle cx="90" cy="90" r="10" fill="white" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[17px] font-black tracking-[0.06em]">NEXUS</span>
                  <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-muted-foreground">OPERATIONS</span>
                </div>
              </div>
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
                <h1 className="text-2xl font-black uppercase mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to your Nexus Operations account.</p>
              </div>

              {/* Demo credentials hint */}
              <div className="mb-6 p-3 border-l-4 border-primary bg-primary/5">
                <p className="text-xs font-black text-primary mb-1 uppercase tracking-wide">Demo accounts</p>
                <p className="text-xs text-muted-foreground font-mono">homeowner@demo.com / demo123</p>
                <p className="text-xs text-muted-foreground font-mono">contractor@demo.com / demo123</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-widest">Email</label>
                  <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive font-bold border-l-4 border-destructive pl-3">{error}</p>}

                <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors mt-2 construct-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-none">
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { setTab("signup"); setError("") }} className="text-primary hover:underline font-bold">Create one</button>
              </p>
            </TabsContent>

            {/* ── SIGN UP ── */}
            <TabsContent value="signup">
              <div className="mb-6">
                <h1 className="text-2xl font-black uppercase mb-1">Create your account</h1>
                <p className="text-sm text-muted-foreground">Submit a project request or apply to join the contractor network.</p>
              </div>

              {/* Role picker — constructivist square tiles */}
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-widest mb-3">I am a…</p>
                <div className="grid grid-cols-2 gap-0 border-2 border-foreground">
                  {([
                    { value: "homeowner", label: "Homeowner", Icon: Home, desc: "Find verified contractors" },
                    { value: "contractor", label: "Contractor", Icon: Wrench, desc: "Get exclusive projects" },
                  ] as const).map(({ value, label, Icon, desc }, i) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setRole(value); setError("") }}
                      className={`flex flex-col items-center gap-2 p-4 text-center transition-all border-r-2 last:border-r-0 border-foreground ${
                        role === value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${role === value ? "text-primary-foreground" : ""}`} />
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight">{label}</p>
                        <p className="text-[10px] opacity-70">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-widest">Full name <span className="text-primary">*</span></label>
                  <Input id="signup-name" placeholder="Jane Smith" value={signupName} onChange={(e) => setSignupName(e.target.value)} required autoComplete="name" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-widest">Email <span className="text-primary">*</span></label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required autoComplete="email" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-widest">Password <span className="text-primary">*</span></label>
                  <div className="relative">
                    <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required autoComplete="new-password" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-phone" className="text-xs font-bold uppercase tracking-widest">Phone</label>
                  <Input id="signup-phone" type="tel" placeholder="(555) 000-0000" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} autoComplete="tel" />
                </div>

                {role === "homeowner" && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="signup-address" className="text-xs font-bold uppercase tracking-widest">Service address</label>
                    <Input id="signup-address" placeholder="123 Main St, Topeka, KS" value={signupAddress} onChange={(e) => setSignupAddress(e.target.value)} autoComplete="street-address" />
                  </div>
                )}

                {role === "contractor" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-business" className="text-xs font-bold uppercase tracking-widest">Business name <span className="text-primary">*</span></label>
                      <Input id="signup-business" placeholder="Smith Tree Services LLC" value={signupBusiness} onChange={(e) => setSignupBusiness(e.target.value)} required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="signup-license" className="text-xs font-bold uppercase tracking-widest">License number</label>
                      <Input id="signup-license" placeholder="KS-TC-2024-XXXX" value={signupLicense} onChange={(e) => setSignupLicense(e.target.value)} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-2">Service categories <span className="text-primary">*</span></p>
                      <div className="flex flex-wrap gap-1.5">
                        {SERVICE_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide border-2 transition-all ${
                              signupCategories.includes(cat)
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black uppercase tracking-widest">Subscription tier</label>
                      <div className="grid grid-cols-3 gap-0 border-2 border-foreground">
                        {SUBSCRIPTION_TIERS.map(({ value, label, price }, i) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSignupSubscription(value)}
                            className={`flex flex-col items-center gap-0.5 p-3 text-center transition-all border-r-2 last:border-r-0 border-foreground ${
                              signupSubscription === value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "hover:bg-secondary text-foreground"
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase">{label}</span>
                            <span className="text-[9px] opacity-70 font-mono">{price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-destructive font-bold border-l-4 border-destructive pl-3">{error}</p>}

                <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors mt-2 construct-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-none">
                  {loading ? "Creating account…" : "Create Account"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline font-bold">Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>.
                </p>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => { setTab("login"); setError("") }} className="text-primary hover:underline font-bold">Sign in</button>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
