"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What does NexOps actually do?",
    answer:
      "NexOps is a consulting agency and, soon, a SaaS platform built for property management companies. We coordinate your vendor relationships, document your workflows, and serve as a dedicated operations partner for your portfolio. Consulting engagements are available now — the platform launches in 2026.",
  },
  {
    question: "Are you a software company, a consulting agency, or both?",
    answer:
      "Both. Consulting is available now. Our SaaS platform — built from real client engagements — is planned for a 2026 launch. You don't need to wait for the software to start working with us, and early clients will have direct input into how the platform gets built.",
  },
  {
    question: "When will the platform launch?",
    answer:
      "We're targeting a 2026 launch. The platform is being built from the ground up using the actual workflows and vendor coordination models we develop through client engagements — not a generic template. Early clients who start consulting now get first access when it's ready.",
  },
  {
    question: "Can we start consulting before the platform is ready?",
    answer:
      "Yes. Consulting engagements are the primary way we work with clients today. We manage your vendor relationships and workflows directly, and the platform will support and extend that work when it launches — it doesn't replace it.",
  },
  {
    question: "How does NexOps handle our existing vendor relationships?",
    answer:
      "We work with your vendors — not around them. We coordinate, document, and manage your existing relationships on your behalf. We don't push replacements or require you to switch platforms. Your relationships stay yours; we just make them run better.",
  },
  {
    question: "What does the first 30 days look like?",
    answer:
      "An initial call to understand your portfolio, followed by an operations assessment of your current vendor landscape and workflows. By the end of the first 30 days, you have a written operations overview, a clear scope for your engagement, and an assigned NexOps partner.",
  },
  {
    question: "Is there a long-term contract or commitment required?",
    answer:
      "No long-term commitments. Engagements are structured around defined scope and outcomes. We want you to stay because the work is valuable — not because you're locked in. Pause or end your engagement with reasonable notice at any time.",
  },
  {
    question: "What types of property management companies do you work with?",
    answer:
      "We work with residential and commercial property management companies of any size. Whether you manage 10 units or 500, the core challenge is the same: coordinating vendors, documenting workflows, and keeping operations consistent as the portfolio grows.",
  },
]

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
          {item.question}
        </span>
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-lg bg-secondary/60 border border-border/40 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 bg-primary/10 border-primary/20" : ""
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-colors duration-200 ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p className="text-sm text-muted-foreground leading-relaxed pb-5 pr-10">{item.answer}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 100)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="faq" className="py-24 lg:py-32 bg-card/30 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left — header */}
          <div className="reveal lg:sticky lg:top-24">
            <p className="text-primary text-sm font-medium tracking-wide mb-3">FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Answers to the questions
              <span className="gradient-text"> that matter before you commit.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Common questions from property management companies about how NexOps works, what consulting looks like, and what to expect from our engagement process.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="rounded-2xl border border-border/40 bg-card px-6">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  item={item}
                  isOpen={openItems.has(i)}
                  onToggle={() => toggleItem(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
