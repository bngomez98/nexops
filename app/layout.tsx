import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | One Request. One Verified Contractor.",
    template: "%s | Nexus Operations",
  },
  description:
    "Nexus Operations matches homeowners with one licensed, insured contractor per job — not a list of five who call within the hour. Document your project with photos, set a budget cap, and select a consultation window. Always free for homeowners.",
  keywords: [
    "home services Topeka Kansas",
    "exclusive contractor projects",
    "tree removal Topeka",
    "roofing contractor Kansas",
    "concrete work Topeka",
    "licensed insured contractors",
    "home repair matching",
    "contractor marketplace",
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
    title: "Nexus Operations | One Request. One Verified Contractor.",
    description:
      "Document your project with photos, set a budget cap, and get matched with one verified contractor — not seven. No bidding wars. No unsolicited calls. Always free for homeowners.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | One Request. One Verified Contractor.",
    description: "One request. One verified, licensed contractor. Zero runaround or unsolicited calls. Always free for homeowners in Topeka, KS.",
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-713FG73CGF" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-713FG73CGF');
              gtag('config', 'AW-17873510977');
              gtag('config', 'G-17T4WZRZG4');
            `,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-17T4WZRZG4" />
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
