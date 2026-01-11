import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | Professional Sourcing & Project Coordination Services",
    template: "%s | Nexus Operations",
  },
  description:
    "Expert product sourcing, vendor coordination, and project management for busy professionals. Save time with transparent pricing, same-day response, and guaranteed results. Specialized services for equipment sourcing, resale fulfillment, and contractor coordination.",
  keywords: [
    "product sourcing",
    "vendor coordination",
    "project management",
    "professional services",
    "equipment sourcing",
    "contractor coordination",
    "resale fulfillment",
    "business support",
    "project coordination",
    "time-saving services",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "Nexus Operations | Professional Sourcing & Project Coordination Services",
    description:
      "Expert product sourcing, vendor coordination, and project management for busy professionals. Transparent pricing, same-day response, and guaranteed results.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | Professional Sourcing & Project Coordination Services",
    description: "Expert sourcing and coordination services for busy professionals who value their time.",
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
  verification: {
    google: "verification_token",
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
        <link rel="canonical" href="https://nexusoperations.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Nexus Operations",
              description: "Expert product sourcing, vendor coordination, and project management services",
              url: "https://nexusoperations.org",
              telephone: "+1-913-951-1711",
              email: "admin@nexusoperations.org",
              priceRange: "$$",
              areaServed: "US",
              serviceType: ["Product Sourcing", "Vendor Coordination", "Project Management", "Equipment Sourcing"],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
