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
    "NexOps is a consulting agency and SaaS platform for property management companies. We coordinate vendor relationships, document workflows, and serve as your dedicated operations partner.",
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
      "NexOps coordinates vendor relationships, documents workflows, and delivers dedicated operations support for property management teams.",
    siteName: "NexOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexOps | Operations Partner for Property Management",
    description:
      "A consulting agency and SaaS platform for property management companies. One dedicated partner. Your vendors coordinated. Your workflows documented.",
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-713FG73CGF" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-17T4WZRZG4" />
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
      </head>
      <body className="font-sans antialiased">
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
