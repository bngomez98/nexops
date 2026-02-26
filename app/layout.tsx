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
    "NexOps is a consulting agency and SaaS platform for property management companies. We coordinate vendor relationships, document workflows, and act as your dedicated operations partner.",
  keywords: [
    "property management consulting",
    "vendor coordination property management",
    "operations partner property managers",
    "property management software",
    "workflow documentation property management",
    "property portfolio operations",
  ],
  authors: [{ name: "NexOps" }],
  creator: "NexOps",
  publisher: "NexOps",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "NexOps | Operations Partner for Property Management",
    description:
      "NexOps coordinates your vendor relationships, documents your workflows, and serves as a dedicated operations partner for property management companies.",
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-17T4WZRZG4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
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
