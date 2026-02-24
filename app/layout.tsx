import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | Exclusive Contractor Leads for Home Services",
    template: "%s | Nexus Operations",
  },
  description:
    "Get matched with a single licensed, insured contractor for your home project. Upload photos, set your budget, and schedule a consultation. No phone tag, no bidding wars.",
  keywords: [
    "home services",
    "contractor leads",
    "tree removal",
    "roofing contractor",
    "concrete work",
    "licensed contractors",
    "home repair",
    "exclusive leads",
    "contractor matching",
    "Topeka contractors",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "Nexus Operations | Exclusive Contractor Leads for Home Services",
    description:
      "Upload photos, set your budget, get matched with one verified contractor. No phone tag. No shared leads.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | Exclusive Contractor Leads for Home Services",
    description: "One request. One verified contractor. No runaround.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "@id": "https://nexusoperations.org/#organization",
                name: "Nexus Operations",
                description:
                  "Two-sided marketplace connecting homeowners with licensed, insured contractors through exclusive lead distribution.",
                url: "https://nexusoperations.org",
                telephone: "+1-913-951-1711",
                email: "admin@nexusoperations.org",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Topeka",
                  addressRegion: "KS",
                  addressCountry: "US",
                },
                areaServed: [
                  { "@type": "City", name: "Topeka" },
                  { "@type": "State", name: "Kansas" },
                ],
                serviceType: [
                  "Tree Removal",
                  "Roofing",
                  "Concrete Work",
                  "HVAC",
                  "Fencing",
                  "Electrical",
                  "Plumbing",
                  "Excavation",
                ],
                priceRange: "Free for homeowners",
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:00",
                  closes: "17:00",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Nexus Operations",
                url: "https://nexusoperations.org",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://nexusoperations.org/services?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
