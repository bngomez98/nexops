"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "How is NexOps different from a lead marketplace?",
    a: "Each request is assigned to one contractor, not resold to multiple bidders. That keeps communication clean and conversion quality higher.",
  },
  {
    q: "Can property managers enforce response-time expectations?",
    a: "Yes. Dispatch targets can be configured by urgency band, and backup routing is triggered when a primary contractor does not accept in time.",
  },
  {
    q: "Do homeowners pay to submit requests?",
    a: "No. Project request submission is free for property owners.",
  },
  {
    q: "What does contractor onboarding include?",
    a: "License verification, insurance validation, service-category approval, and ongoing quality review.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-primary text-sm font-medium tracking-wide mb-3">FAQ</p>
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Common questions, direct answers</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Everything teams typically ask before onboarding.
        </p>

        <div className="rounded-2xl border border-border/40 bg-card px-6">
          {faqs.map((item, i) => {
            const isOpen = i === open
            return (
              <div key={item.q} className="border-b border-border/40 last:border-0">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-semibold">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="text-sm text-muted-foreground leading-relaxed pb-5">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
