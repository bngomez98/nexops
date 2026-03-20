import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { AuthProvider } from "./lib/auth-context"
import { RequestsProvider } from "./lib/requests-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | Maintenance Coordination for Property Management",
    template: "%s | Nexus Operations",
  },
  description:
    "Nexus Operations coordinates maintenance and repair services for commercial property managers and residential property owners in Topeka, Kansas. Verified contractors, guaranteed response times, zero coordination burden.",
  keywords: [
    "property maintenance coordination",
    "commercial property management",
    "residential maintenance",
    "contractor coordination",
    "property management Topeka",
    "maintenance services Kansas",
    "B2B property services",
    "verified contractors",
    "multi-family maintenance",
    "Nexus Operations",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "Nexus Operations | Maintenance Coordination for Property Management",
    description:
      "We coordinate maintenance so property managers and homeowners don't have to. Verified contractors, guaranteed response times, one point of contact.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | Maintenance Coordination",
    description:
      "One request. One coordinator. Verified contractors. Guaranteed response times.",
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
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#c7935a",
  width: "device-width",
  initialScale: 1,
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
                  "Outsourced maintenance coordination for commercial and residential property managers in Topeka, Kansas. Verified contractor networks, guaranteed response times, unified invoicing.",
                url: "https://nexusoperations.org",
                telephone: "+1-913-951-1711",
                email: "admin@nexusoperations.org",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "405 SW Fillmore St",
                  addressLocality: "Topeka",
                  addressRegion: "KS",
                  postalCode: "66606",
                  addressCountry: "US",
                },
                areaServed: [
                  { "@type": "City", name: "Topeka" },
                  { "@type": "AdministrativeArea", name: "Shawnee County" },
                ],
                serviceType: [
                  "Maintenance Coordination",
                  "Property Management Support",
                  "Contractor Network Management",
                  "Emergency Repair Coordination",
                  "Vendor Management",
                  "Lead Generation",
                  "Project Management",
                  "B2B Consulting",
                ],
                priceRange: "$$",
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "08:00",
                  closes: "18:00",
                },
                founder: {
                  "@type": "Person",
                  name: "Brianna Gomez",
                  jobTitle: "Chief Executive Member",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Nexus Operations",
                url: "https://nexusoperations.org",
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <RequestsProvider>
            {children}
            <Analytics />
            <Toaster position="bottom-right" richColors closeButton />
          </RequestsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
