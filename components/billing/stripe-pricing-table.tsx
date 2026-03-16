"use client"

import { useCallback, useEffect, useRef } from "react"

interface StripePricingTableProps {
  pricingTableId: string
  publishableKey: string
  clientReferenceId?: string
  customerEmail?: string
}

export function StripePricingTable({
  pricingTableId,
  publishableKey,
  clientReferenceId,
  customerEmail,
}: StripePricingTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)

  const renderPricingTable = useCallback(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ""

    const pricingTable = document.createElement("stripe-pricing-table")
    pricingTable.setAttribute("pricing-table-id", pricingTableId)
    pricingTable.setAttribute("publishable-key", publishableKey)

    if (clientReferenceId) {
      pricingTable.setAttribute("client-reference-id", clientReferenceId)
    }

    if (customerEmail) {
      pricingTable.setAttribute("customer-email", customerEmail)
    }

    containerRef.current.appendChild(pricingTable)
  }, [pricingTableId, publishableKey, clientReferenceId, customerEmail])

  useEffect(() => {
    if (scriptLoaded.current) {
      renderPricingTable()
      return
    }

    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/pricing-table.js"
    script.async = true

    script.onload = () => {
      scriptLoaded.current = true
      renderPricingTable()
    }

    document.body.appendChild(script)
  }, [renderPricingTable])

  return <div ref={containerRef} className="stripe-pricing-table-container min-h-[400px]" />
}
