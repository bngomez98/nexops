"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Minus } from "lucide-react"

type FAQItem = { question: string; answer: string }

const propertyOwnerFaqs: FAQItem[] = [
  { question: "How does the assignment process work?", answer: "Property owners submit photographs, a scope of work, a budget, and available times. One contractor in the area claims the project exclusively. A consultation is confirmed within 24 hours." },
  { question: "How many contractors will contact me?", answer: "Only one contractor will contact you. Once claimed, your project is permanently removed from all other contractor feeds." },
  { question: "Is there a cost for homeowners or property managers?", answer: "There is no cost to homeowners. Nexus Operations is funded through contractor memberships." },
  { question: "How are contractors screened and verified?", answer: "All contractors are license-verified, insurance-confirmed, and background-checked before network access. No contractor sees project requests until all three requirements are met." },
  { question: "What happens if no contractor is available in my area?", answer: "The platform notifies the property owner immediately if coverage is unavailable in their specific area." },
  { question: "Can I cancel or update my request?", answer: "Property owners can update or cancel their request before a contractor claims it. Once claimed, the assignment is exclusive." },
]

const contractorFaqs: FAQItem[] = [
  { question: "What does exclusive assignment mean?", answer: "The moment you claim a project, it is removed from every other contractor's feed permanently. You are the only professional contacting this homeowner." },
  { question: "What information is included with each project?", answer: "Every project includes 2-10 photographs, a written description, the maximum budget, and pre-selected consultation windows." },
  { question: "How does membership pricing work?", answer: "Membership is billed monthly at a flat rate — $299 for Standard, $499 for Premium, or $749 for Elite. No per-project fees, no cancellation penalties." },
  { question: "How are contractor ratings determined?", answer: "Ratings are derived from the outcomes of projects completed through the platform. They reflect actual job results, not self-reported credentials." },
  { question: "What is the verification process?", answer: "Before gaining access, all contractors must complete license verification, insurance confirmation, and a background check." },
  { question: "Can I claim projects in any service category?", answer: "You can claim projects in the service categories that match your verified credentials." },
]

function AccordionItem({ item, isOpen, onToggle, index }: { item: FAQItem; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <div className={`border-b border-border last:border-0 ${isOpen ? "bg-secondary/50" : ""} transition-colors rounded-lg`}>
      <button className="w-full flex items-center justify-between gap-4 py-4 px-3 text-left group" onClick={onToggle} aria-expanded={isOpen}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-primary font-semibold shrink-0">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
            {item.question}
          </span>
        </div>
        <div className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-all duration-200 ${isOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}>
        <p className="text-sm text-muted-foreground leading-relaxed pb-4 pl-10 pr-10">{item.answer}</p>
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
      if (next.has(index)) next.delete(index)
      else next.add(index)
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
    <section ref={sectionRef} id="faq" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* Left — header */}
          <div className="reveal lg:sticky lg:top-24">
            <p className="section-label mb-4">FAQ</p>
            <h2 className="text-4xl lg:text-5xl font-display leading-[1.05] mb-4">
              Common questions answered directly.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Clear information so homeowners, property managers, and contractors understand the process.
            </p>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-secondary rounded-lg w-fit">
              <button
                onClick={() => switchTab("owners")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "owners"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Homeowners
              </button>
              <button
                onClick={() => switchTab("contractors")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "contractors"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contractors
              </button>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="rounded-xl border border-border bg-card px-2">
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
