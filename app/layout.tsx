import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "NexOps | Operations Partner for Property Management",
    template: "%s | NexOps",
  },
  description:
    "NexOps is a consulting agency and SaaS platform for property management companies. We coordinate your vendor relationships, document your workflows, and serve as your dedicated operations partner. Consulting available now — platform launching 2026.",
  keywords: [
    "property management consulting",
    "vendor coordination property management",
    "operations partner property managers",
    "property management software",
    "workflow documentation property management",
    "vendor relationship management",
    "property portfolio operations",
    "property management SaaS",
    "residential property management consulting",
    "commercial property management operations",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "NexOps | Operations Partner for Property Management",
    description:
      "NexOps coordinates your vendor relationships, documents your workflows, and serves as a dedicated operations partner for property management companies. Consulting available now — platform launching 2026.",
    siteName: "NexOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexOps | Operations Partner for Property Management",
    description: "A consulting agency and SaaS platform for property management companies. One dedicated partner. Your vendors coordinated. Your workflows documented.",
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
                "@type": "ProfessionalService",
                "@id": "https://nexusoperations.org/#organization",
                name: "NexOps",
                description:
                  "NexOps is a consulting agency and SaaS platform for property management companies. We coordinate vendor relationships, document workflows, and serve as a dedicated operations partner.",
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
                  "Property Management Consulting",
                  "Vendor Relationship Management",
                  "Workflow Documentation",
                  "Operations Coordination",
                  "Property Management SaaS",
                ],
                priceRange: "$$",
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
