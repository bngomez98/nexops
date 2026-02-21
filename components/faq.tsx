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
      "You submit your project with 2–10 photos, a written scope, a hard budget cap, and 3–4 available consultation windows. The moment a verified contractor in your trade category and area claims your request, it is removed from every other contractor's view — permanently. You receive a confirmed appointment for one of your selected windows. No phone tag, no competing calls.",
  },
  {
    question: "How many contractors will contact me after I submit?",
    answer:
      "Exactly one. That is the entire point. The instant your request is claimed, it becomes exclusive to that contractor. No other contractor can see or contact you about it. You will not receive a flood of calls within the first hour — you will receive one confirmed consultation from one verified professional.",
  },
  {
    question: "Is there any cost to homeowners?",
    answer:
      "None. Nexus Operations is completely free for homeowners at every tier, with no hidden fees, subscriptions, or data-selling. Our revenue comes from contractor memberships, not from distributing your contact information.",
  },
  {
    question: "How are contractors verified?",
    answer:
      "Every contractor in the network has passed license verification, proof-of-insurance review, and a background check before being admitted. Their standing is updated after each completed project based on documented outcomes — not self-reported reviews anyone can game.",
  },
  {
    question: "What happens if no contractor is available in my area?",
    answer:
      "You are told immediately and clearly — no indefinite wait, no ambiguity. We do not hold your request open hoping something changes. If coverage expands to your area, we will notify you. You are not obligated to resubmit.",
  },
  {
    question: "Can I cancel or update my request after submitting?",
    answer:
      "Yes. You can update your request or cancel it at any time before a contractor claims it. Once a contractor has claimed your project and a consultation is confirmed, you should contact support to discuss changes.",
  },
]

const contractorFAQs: FAQItem[] = [
  {
    question: "How many leads can I expect each week?",
    answer:
      "Lead volume depends on your trade category, service area, time of year, and local demand. We cannot guarantee a specific number. What we can guarantee is that every lead you receive is exclusive to you — no one else in the network receives the same request simultaneously.",
  },
  {
    question: "When will I receive my first lead?",
    answer:
      "Most partners receive their first claimed lead within the first two weeks of account activation. The timeline varies based on active requests in your area and how quickly you respond to new notifications.",
  },
  {
    question: "How do I receive leads?",
    answer:
      "Leads appear in your contractor dashboard as soon as a homeowner request is submitted in your trade category and service area. You review the full project profile — photos, written scope, budget cap, and consultation windows — and claim it if it fits your business. Claiming is instantaneous and removes the request from all other contractors.",
  },
  {
    question: "What is included in the membership?",
    answer:
      "Your membership covers unlimited lead claims across every trade category you are approved for, access to the full project documentation before you commit to a lead, dashboard analytics, and priority support. There are no per-lead fees, no setup fees, and no cancellation penalties.",
  },
  {
    question: "Are there long-term contracts?",
    answer:
      "No. Membership is month-to-month with no long-term commitment. You can pause or cancel at any time. We do limit the number of contractors per service area and trade category, so if you cancel, re-entry cannot be guaranteed.",
  },
  {
    question: "What makes a lead billable or valid?",
    answer:
      "A lead is counted against your membership when you claim it from the dashboard. Unlike per-lead billing models, your flat membership covers all claims. The only requirement is that you follow through on the confirmed consultation — no-shows affect your standing in the network.",
  },
  {
    question: "Can I pause my account?",
    answer:
      "Yes. If you are on a job, taking time off, or need a break, you can pause incoming notifications for individual counties or your entire service area. Pauses are available in durations from a few hours up to seven days.",
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
              Frequently asked questions about
              <span className="gradient-text"> how Nexus Operations works</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Everything homeowners and contractors need to know about submitting requests, claiming
              leads, membership pricing, and the verification process.
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
