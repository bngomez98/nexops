"use client"

import { useEffect } from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "pricing-table-id": string
          "publishable-key": string
          "client-reference-id"?: string
          "customer-email"?: string
          "customer-session-client-secret"?: string
        },
        HTMLElement
      >
    }
  }
}

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
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/pricing-table.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <stripe-pricing-table
      pricing-table-id={pricingTableId}
      publishable-key={publishableKey}
      {...(clientReferenceId ? { "client-reference-id": clientReferenceId } : {})}
      {...(customerEmail ? { "customer-email": customerEmail } : {})}
    />
  )
}
