import Link from 'next/link'
import { Shield, MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f1e36] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[#3b82f6]" />
          <span className="text-2xl font-bold text-white tracking-tight">Nexus Operations</span>
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-10">
          <div className="w-16 h-16 bg-[#eff6ff] rounded-full flex items-center justify-center mx-auto mb-5">
            <MailCheck className="w-8 h-8 text-[#3b82f6]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f1623] mb-3">Check your email</h1>
          <p className="text-[#64748b] text-sm leading-relaxed mb-8">
            We&apos;ve sent you a confirmation link. Click it to verify your account and access your Nexus Operations portal.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
