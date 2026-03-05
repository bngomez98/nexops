"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, ExternalLink } from "lucide-react"

export function HelpCenter() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Help Button - only show when Zendesk widget is hidden */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
        aria-label="Open Help Center"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {/* Help Center Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-semibold">Nexus Operations Help Center</h2>
              <div className="flex items-center gap-2">
                <a
                  href="https://nexusoperations.zendesk.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  Open in new tab
                  <ExternalLink className="h-3 w-3" />
                </a>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <iframe
              src="https://nexusoperations.zendesk.com/hc/en-us"
              className="h-full w-full border-0"
              title="Nexus Operations Help Center"
            />
          </div>
        </div>
      )}
    </>
  )
}
