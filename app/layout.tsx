import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

const GA_MEASUREMENT_ID = "G-713FG73CGF"
const GOOGLE_ADS_ID = "AW-17873510977"
const SECONDARY_GA_ID = "G-17T4WZRZG4"
const ZENDESK_KEY = process.env.NEXT_PUBLIC_ZENDESK_KEY

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "NexOps | Operations Partner for Property Management",
    template: "%s | NexOps",
  },
  description:
    "NexOps is a consulting agency and SaaS platform for property management companies. We coordinate vendor relationships, document workflows, and support reliable operations delivery.",
  keywords: [
    "property management consulting",
    "vendor coordination property management",
    "operations partner property managers",
    "workflow documentation property management",
    "property management SaaS",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="beforeInteractive" />
        <Script
          id="google-tag"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
              gtag('config', '${GOOGLE_ADS_ID}');
              gtag('config', '${SECONDARY_GA_ID}');
            `,
          }}
        />

        {ZENDESK_KEY ? (
          <Script
            id="zendesk-widget"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.zESettings = { webWidget: { authenticate: { chat: {} } } };
                (function() {
                  var d = document;
                  var s = d.createElement('script');
                  s.src = 'https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}';
                  s.async = true;
                  s.id = 'ze-snippet';
                  d.head.appendChild(s);
                })();
              `,
            }}
          />
        ) : null}
      </head>
      <body className="font-sans antialiased">
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
