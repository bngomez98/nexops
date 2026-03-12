export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: "month" | "year"
  features: string[]
}

export const SUBSCRIPTION_PLANS: Product[] = [
  {
    id: "homeowner-monthly",
    name: "Homeowner",
    description: "For individual property owners",
    priceInCents: 0,
    interval: "month",
    features: [
      "Submit service requests",
      "Track project status",
      "Access permanent service records",
      "Basic maintenance recommendations",
    ],
  },
  {
    id: "property-manager-monthly",
    name: "Property Manager",
    description: "For landlords and property managers",
    priceInCents: 4900,
    interval: "month",
    features: [
      "All Homeowner features",
      "Manage unlimited properties",
      "Portfolio-level reporting",
      "Spend analytics by property",
      "Priority contractor assignment",
      "Bulk request submission",
    ],
  },
  {
    id: "property-manager-yearly",
    name: "Property Manager (Annual)",
    description: "For landlords and property managers",
    priceInCents: 47000,
    interval: "year",
    features: [
      "All Property Manager features",
      "2 months free",
      "Dedicated account manager",
      "Custom reporting",
    ],
  },
]

export const SERVICE_FEES: Product[] = [
  {
    id: "standard-service-fee",
    name: "Standard Service Fee",
    description: "Per-project coordination fee",
    priceInCents: 2500,
    features: ["Contractor verification", "Project documentation", "Service record"],
  },
]
