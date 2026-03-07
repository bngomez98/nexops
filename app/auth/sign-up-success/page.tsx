import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Link href="/" className="mb-10">
        <Image
          src="/nexus-logo.png"
          alt="Nexus Operations"
          width={150}
          height={50}
          style={{ height: "34px", width: "auto" }}
        />
      </Link>

      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Mail className="h-5 w-5 text-primary" />
        </div>

        <h1 className="text-xl font-bold mb-2">Verify your email address</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          A confirmation link has been sent to your email. Click the link to activate your account and access your dashboard.
        </p>

        <div className="mt-8 rounded border border-border bg-card p-5 text-left space-y-3 text-[13px]">
          <p className="font-medium">What to expect</p>
          {[
            "Check your inbox for an email from Nexus Operations.",
            "Click the confirmation link — it expires in 24 hours.",
            "You will be redirected to your dashboard after confirmation.",
            "Check your spam or junk folder if the email does not arrive within a few minutes.",
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 text-muted-foreground">
              <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-muted-foreground">
          Need to use a different email?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Start over
          </Link>
        </p>
      </div>
    </div>
  )
}
