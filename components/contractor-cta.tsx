import Link from "next/link"
import { ArrowRight, BellRing, ShieldCheck, WalletCards } from "lucide-react"

export function ContractorCTA() {
  return (
    <section className="py-24 lg:py-32 bg-card/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="rounded-3xl border border-border/40 bg-card p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary text-sm font-medium tracking-wide mb-3">For contractors</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Claim verified work without lead auctions.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Get exclusive access to projects that include scope, photos, and budget context before you commit.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contractors" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90">
                  Join network <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-border/40 rounded-xl hover:bg-secondary/50">
                  View pricing <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { icon: BellRing, title: "Real-time request alerts" },
                { icon: ShieldCheck, title: "Exclusive claim ownership" },
                { icon: WalletCards, title: "Flat monthly membership" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border/40 p-4 bg-secondary/30 flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
