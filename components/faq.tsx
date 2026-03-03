"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Minus } from "lucide-react"

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
  index,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <div className={`border-b-2 border-foreground/15 last:border-0 ${isOpen ? "bg-secondary" : ""} transition-colors`}>
      <button
        className="w-full flex items-center justify-between gap-4 py-5 px-0 text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-black font-mono text-primary shrink-0">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug uppercase tracking-tight">
            {item.question}
          </span>
        </div>
        <div
          className={`flex items-center justify-center w-7 h-7 border-2 shrink-0 transition-colors duration-200 ${
            isOpen ? "border-primary bg-primary text-primary-foreground" : "border-foreground/30 text-muted-foreground"
          }`}
        >
          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p className="text-sm text-muted-foreground leading-relaxed pb-5 pl-8 pr-10">{item.answer}</p>
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
    <section ref={sectionRef} id="faq" className="py-24 lg:py-32 border-b-2 border-foreground bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left — header */}
          <div className="reveal lg:sticky lg:top-24">
            <div className="construct-label mb-4">FAQ</div>
            <h2 className="text-4xl lg:text-5xl font-display uppercase leading-[1.0] mb-4">
              Common questions answered directly.
            </h2>
            {/* Red accent bar */}
            <div className="h-1 w-16 bg-primary mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              Clear information so homeowners, property managers, and contractors understand the process
              before submitting a project or joining the network.
            </p>

            {/* Tab switcher — constructivist square buttons */}
            <div className="flex gap-0 border-2 border-foreground w-fit">
              <button
                onClick={() => switchTab("owners")}
                className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors duration-150 ${
                  activeTab === "owners"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Homeowners
              </button>
              <div className="w-0.5 bg-foreground" />
              <button
                onClick={() => switchTab("contractors")}
                className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors duration-150 ${
                  activeTab === "contractors"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Contractors
              </button>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="border-2 border-foreground bg-background px-6">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={`${activeTab}-${i}`}
                  item={item}
                  isOpen={openItems.has(i)}
                  onToggle={() => toggleItem(i)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
