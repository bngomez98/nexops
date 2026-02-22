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
      "Submit your project with photos, scope, budget, and available times. One contractor in your area claims it exclusively. You get a confirmed appointment within 24 hours.",
  },
  {
    question: "How many contractors will contact me?",
    answer:
      "One. When a contractor claims your project, it's removed from all other contractors' views. That's the entire system.",
  },
  {
    question: "Is there a cost for homeowners?",
    answer:
      "No. Nexus Operations is free for homeowners at every tier. We are funded by contractor memberships, not by selling your contact information.",
  },
  {
    question: "How are contractors screened and verified?",
    answer:
      "All contractors are verified against state and county license databases, insurance is confirmed directly with the provider, and a business background check is completed. Reputation scores reflect actual project outcomes — not self-reported reviews.",
  },
  {
    question: "What happens if no contractor is available in my area?",
    answer:
      "We notify you immediately — no waiting period. If coverage expands to your area, we will contact you directly.",
  },
  {
    question: "Can I cancel or update my request?",
    answer:
      "Yes, anytime before it's claimed. Once claimed and confirmed, contact support to discuss changes.",
  },
]

const contractorFAQs: FAQItem[] = [
  {
    question: "How many projects can I expect per week?",
    answer:
      "Volume depends on your service area and category. Every project you claim is exclusive to you — no other contractor receives it once you claim it.",
  },
  {
    question: "How soon will I receive my first project after activation?",
    answer:
      "Most contractors receive their first available project within two weeks of activation. Timing varies based on active homeowner requests in your coverage area.",
  },
  {
    question: "How do I receive projects?",
    answer:
      "They appear in your dashboard. Review the details and claim it if it fits. Claiming is instant and removes it from all other contractors.",
  },
  {
    question: "What does my membership include?",
    answer:
      "Unlimited project claims, full documentation before you commit, and dashboard analytics. No per-lead fees, no setup fees, and no cancellation penalties.",
  },
  {
    question: "Are there long-term contracts or annual commitments?",
    answer:
      "No. All memberships are month-to-month. Pause or cancel from your dashboard at any time with no penalty. We limit active contractors per service area, so re-entry is not guaranteed once a spot is vacated.",
  },
  {
    question: "How does billing work for claimed projects?",
    answer:
      "Your flat monthly membership covers all project claims. There are no per-claim charges at any stage. Claiming a project commits you to the confirmed consultation window.",
  },
  {
    question: "Can I pause my service area or notifications?",
    answer:
      "Yes. You can pause notifications by county or service area for any duration between a few hours and seven days.",
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
              Answers to the questions
              <span className="gradient-text"> that matter before you commit.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              How matching works, what contractors are required to carry, what happens if no contractor is
              available, and what your obligations are — answered before you submit a project or join the network.
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
