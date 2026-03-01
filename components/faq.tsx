"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "How is NexOps different from a lead marketplace?",
    a: "Each request is assigned to one contractor, not resold to multiple bidders. That keeps communication clean and conversion quality higher.",
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
