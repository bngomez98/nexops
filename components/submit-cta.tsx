import Link from "next/link"
import { ArrowRight, Upload, CalendarCheck2, ShieldCheck } from "lucide-react"

export function SubmitCTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="rounded-3xl border border-border/40 bg-card p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary text-sm font-medium tracking-wide mb-3">For property owners</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Submit once. Get one verified contractor.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Upload photos, define your budget, and choose availability. Your request is routed to one
                qualified pro, not blasted to a crowd.
              </p>
              <Link
                href="/dashboard/homeowner/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Start a free request
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3">
              {[
                { icon: Upload, title: "Upload scope + photos", body: "Give contractors complete context before consultation." },
                { icon: CalendarCheck2, title: "Pick a consultation window", body: "Set timing that works for your schedule." },
                { icon: ShieldCheck, title: "Only verified pros are assigned", body: "License and insurance checks happen before dispatch." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl border border-border/40 bg-secondary/30">
                  <div className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
