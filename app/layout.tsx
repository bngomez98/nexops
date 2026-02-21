import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | Exclusive Contractor Matching in Topeka, KS",
    template: "%s | Nexus Operations",
  },
  description:
    "Nexus Operations matches each home project to one licensed, insured contractor in the Topeka, KS area. Homeowners submit photos, a written scope, and a budget cap. One verified contractor is assigned exclusively. Free for homeowners.",
  keywords: [
    "home services Topeka Kansas",
    "exclusive contractor leads",
    "tree removal Topeka",
    "roofing contractor Kansas",
    "concrete work Topeka",
    "licensed insured contractors",
    "home repair matching",
    "exclusive contractor matching",
    "HVAC contractor Topeka",
    "fencing contractor Kansas",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "Nexus Operations | Exclusive Contractor Matching in Topeka, KS",
    description:
      "Nexus Operations matches each home project to one licensed, insured contractor in Topeka, KS. Homeowners submit photos, scope, and budget. One verified contractor is assigned exclusively. Free for homeowners.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | Exclusive Contractor Matching in Topeka, KS",
    description: "Nexus Operations matches each home project to one licensed, insured contractor in Topeka, KS. Free for homeowners. Flat monthly membership for contractors.",
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
                  "Exclusive contractor matching platform connecting homeowners with a single licensed, insured professional per project — eliminating shared leads, bidding wars, and unsolicited contractor contact.",
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
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
