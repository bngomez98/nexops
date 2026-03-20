import Link from 'next/link'
import { Shield, Home, Building2, HardHat } from 'lucide-react'
import { signUp } from '@/app/auth/actions'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error

  return (
    <div className="min-h-screen bg-[#0f1e36] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[#3b82f6]" />
          <span className="text-2xl font-bold text-white tracking-tight">Nexus Operations</span>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-[#0f1623] mb-1">Create your account</h1>
          <p className="text-[#64748b] text-sm mb-8">Choose your role to get the right experience</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signUp} className="flex flex-col gap-5">
            {/* Role selector */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#0f1623]">I am a...</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'homeowner', label: 'Homeowner', Icon: Home },
                  { value: 'property_manager', label: 'Property Manager', Icon: Building2 },
                  { value: 'contractor', label: 'Contractor', Icon: HardHat },
                ].map(({ value, label, Icon }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="role" value={value} className="sr-only peer" defaultChecked={value === 'homeowner'} />
                    <div className="flex flex-col items-center gap-2 border-2 border-[#e2e8f0] rounded-lg p-3 text-center peer-checked:border-[#3b82f6] peer-checked:bg-[#eff6ff] transition-all hover:border-[#3b82f6]/50">
                      <Icon className="w-5 h-5 text-[#64748b] peer-checked:text-[#3b82f6]" />
                      <span className="text-xs font-medium text-[#0f1623] leading-tight">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-[#0f1623]">Full name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#0f1623]">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#0f1623]">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                minLength={8}
                className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-[#64748b] mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#3b82f6] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          <Link href="/" className="hover:text-slate-300 transition-colors">← Back to Nexus Operations</Link>
        </p>
      </div>
    </div>
  )
}
