"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "How does contractor assignment work?",
    a: "Each request is matched to one verified contractor based on category, service area, and response availability.",
  },
  {
    q: "Is there a cost for property owners to submit requests?",
    a: "No. Property owners can submit project requests at no charge.",
  },
  {
    q: "What does contractor membership include?",
    a: "Membership includes project access by eligibility, dispatch notifications, and dashboard reporting.",
  },
  {
    q: "Can property managers use NexOps for recurring work?",
    a: "Yes. NexOps supports recurring maintenance coordination and dispatch workflows.",
  },
  {
    q: "What documentation is captured during execution?",
    a: "Request scope, assignment timestamps, status transitions, and completion records are logged for visibility.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">FAQ</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Clear answers before you commit</h2>
          <p className="text-muted-foreground leading-relaxed">Everything stakeholders usually ask about assignment, billing flow, and execution visibility.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <article key={faq.q} className="rounded-xl border border-border/40 bg-card overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
