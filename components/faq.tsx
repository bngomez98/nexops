"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const homeownerFAQs: FAQItem[] = [
  {
    question: "How does the matching process work?",
    answer:
      "You submit your project with photos, a written description, a budget ceiling, and a few available consultation windows. The moment a verified contractor in your trade and area claims it, the request is removed from every other contractor's view — permanently. You receive a confirmed appointment. No phone tag, no competing calls.",
  },
  {
    question: "How many contractors will contact me?",
    answer:
      "Exactly one. When a contractor claims your project, it becomes exclusive to them. No other contractor can see or contact you about it. You will not receive a flood of calls — you will receive one confirmed appointment from one verified professional.",
  },
  {
    question: "Is there any cost to homeowners?",
    answer:
      "None. Nexus Operations is free for homeowners at every tier. Our revenue comes from contractor memberships, not from distributing your contact information.",
  },
  {
    question: "How are contractors verified?",
    answer:
      "Every contractor has passed license verification, proof-of-insurance review, and a background check before being admitted to the network. Their standing is updated after each completed project based on documented outcomes.",
  },
  {
    question: "What if no contractor is available in my area?",
    answer:
      "We'll tell you immediately — no indefinite wait, no ambiguity. We don't hold your request open hoping coverage materializes. If that changes, we'll notify you. You're not obligated to resubmit.",
  },
  {
    question: "Can I cancel or update my request?",
    answer:
      "Yes, at any point before a contractor claims it. Once a contractor has claimed your project and a consultation is confirmed, contact support to discuss changes.",
  },
]

const contractorFAQs: FAQItem[] = [
  {
    question: "How many projects per week?",
    answer:
      "Depends on your area and category. Every project is exclusive to you—no sharing with other contractors.",
  },
  {
    question: "When do I get my first project?",
    answer:
      "Usually within two weeks of activation. Timing depends on active requests in your area.",
  },
  {
    question: "How do I receive projects?",
    answer:
      "They appear in your dashboard. Review the details and claim it if it fits. Claiming is instant and removes it from all other contractors.",
  },
  {
    question: "What's included in membership?",
    answer:
      "Unlimited claims, full project details upfront, dashboard analytics. No per-lead fees, setup fees, or cancellation penalties.",
  },
  {
    question: "Long-term contracts?",
    answer:
      "No. Month-to-month only. Pause or cancel anytime. We limit contractors per area, so re-entry isn't guaranteed if you cancel.",
  },
  {
    question: "When is a project billable?",
    answer:
      "When you claim it. Your flat membership covers all claims. Just follow through on the confirmed consultation.",
  },
  {
    question: "Can I pause my account?",
    answer:
      "Yes. Pause notifications by county or service area for a few hours up to seven days.",
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

type Tab = "homeowners" | "contractors"

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState<Tab>("homeowners")
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  // Reset open items when tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setOpenItems(new Set([0]))
  }

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

  const items = activeTab === "homeowners" ? homeownerFAQs : contractorFAQs

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
              Common questions,
              <span className="gradient-text"> straight answers.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              No vague commitments. If something is not clear, you should know exactly what you are
              agreeing to before you submit a project or join the network.
            </p>

            {/* Tab toggle */}
            <div className="inline-flex p-1 rounded-xl bg-secondary/60 border border-border/40 gap-1">
              {(["homeowners", "contractors"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Right — accordion */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="rounded-2xl border border-border/40 bg-card px-6">
              {items.map((item, i) => (
                <AccordionItem
                  key={`${activeTab}-${i}`}
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
