"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const propertyOwnerFaqs: FAQItem[] = [
  {
    question: "How does the assignment process work?",
    answer:
      "Property owners submit photographs, a scope of work, a budget, and available times. One contractor in the area claims the project exclusively. A consultation is confirmed within 24 hours.",
  },
  {
    question: "How many contractors will contact me?",
    answer:
      "Only one contractor will contact you. Once claimed, your project is permanently removed from all other contractor feeds.",
  },
  {
    question: "Is there a cost for homeowners or property managers?",
    answer:
      "There is no cost to homeowners. Nexus Operations is funded through contractor memberships.",
  },
  {
    question: "How are contractors screened and verified?",
    answer:
      "All contractors are license-verified, insurance-confirmed, and background-checked before network access. No contractor sees project requests until all three requirements are met.",
  },
  {
    question: "What happens if no contractor is available in my area?",
    answer:
      "The platform notifies the property owner immediately if coverage is unavailable in their specific area.",
  },
  {
    question: "Can I cancel or update my request?",
    answer:
      "Property owners can update or cancel their request before a contractor claims it. Once a contractor claims the project, the assignment is exclusive and the project cannot be reclaimed by another contractor.",
  },
]

const contractorFaqs: FAQItem[] = [
  {
    question: "What does exclusive assignment mean?",
    answer:
      "The moment you claim a project, it is removed from every other contractor's feed permanently. You are the only professional contacting this homeowner, and you own the project from claim through completion.",
  },
  {
    question: "What information is included with each project?",
    answer:
      "Every project includes 2\u201310 photographs of the work area, a written description of the scope, the maximum budget the property owner has approved, and pre-selected consultation windows. You have everything you need before deciding to claim.",
  },
  {
    question: "How does membership pricing work?",
    answer:
      "Membership is billed monthly at a flat rate \u2014 $299 for Standard, $499 for Premium, or $749 for Elite. No per-project fees, no cancellation penalties, and no limits on the number of projects you can claim.",
  },
  {
    question: "How are contractor ratings determined?",
    answer:
      "Ratings are derived from the outcomes of projects completed through the platform. They reflect actual job results, not self-reported credentials or reviews that could be manipulated.",
  },
  {
    question: "What is the verification process?",
    answer:
      "Before gaining access to the network, all contractors must complete license verification, insurance confirmation, and a background check. This process protects both property owners and the contractors in the network.",
  },
  {
    question: "Can I claim projects in any service category?",
    answer:
      "You can claim projects in the service categories that match your verified credentials. Contractors must hold the appropriate license for the category they claim projects in.",
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
  const [activeTab, setActiveTab] = useState<"owners" | "contractors">("owners")
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  const faqs = activeTab === "owners" ? propertyOwnerFaqs : contractorFaqs

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

  const switchTab = (tab: "owners" | "contractors") => {
    setActiveTab(tab)
    setOpenItems(new Set([0]))
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
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left — header */}
          <div className="reveal lg:sticky lg:top-24">
            <p className="text-primary text-sm font-medium tracking-wide mb-3">FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Common questions
              <span className="gradient-text"> answered directly.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Clear information so homeowners, property managers, and contractors understand the process
              before submitting a project or joining the network.
            </p>

            {/* Tab switcher */}
            <div className="flex gap-2 p-1 rounded-xl bg-secondary/40 border border-border/30 w-fit">
              <button
                onClick={() => switchTab("owners")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "owners"
                    ? "bg-card text-foreground border border-border/40 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Homeowners & Property Managers
              </button>
              <button
                onClick={() => switchTab("contractors")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "contractors"
                    ? "bg-card text-foreground border border-border/40 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contractors
              </button>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="rounded-2xl border border-border/40 bg-card px-6">
              {faqs.map((item, i) => (
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
