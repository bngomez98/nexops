import Link from 'next/link'
import { Shield } from 'lucide-react'
import { signIn } from '@/app/auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error

  return (
    <div className="min-h-screen bg-[#0f1e36] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[#3b82f6]" />
          <span className="text-2xl font-bold text-white tracking-tight">Nexus Operations</span>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-[#0f1623] mb-1">Welcome back</h1>
          <p className="text-[#64748b] text-sm mb-8">Sign in to access your portal</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signIn} className="flex flex-col gap-5">
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
                autoComplete="current-password"
                placeholder="••••••••"
                className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-[#64748b] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-[#3b82f6] hover:underline font-medium">
              Create one
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
