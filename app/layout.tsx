import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ChatAgent } from "@/components/chat-agent"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | Contractor Marketplace for Homeowners and Property Managers",
    template: "%s | Nexus Operations",
  },
  description:
    "Nexus is a contractor marketplace connecting homeowners and property managers with licensed, insured contractors. End-to-end coordination from service request through project completion, including emergency response and Post Implementation Review.",
  keywords: [
    "contractor marketplace",
    "licensed contractors Topeka",
    "property maintenance coordination",
    "emergency contractor response",
    "homeowner contractor matching",
    "property manager maintenance",
    "restoration and remediation services",
    "insured contractors Kansas",
    "project coordination",
    "post implementation review",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "Nexus Operations | Contractor Marketplace for Homeowners and Property Managers",
    description:
      "Nexus is a contractor marketplace connecting homeowners and property managers with licensed, insured contractors. End-to-end coordination from service request through project completion.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | Contractor Marketplace for Homeowners and Property Managers",
    description:
      "Nexus is a contractor marketplace connecting homeowners and property managers with licensed, insured contractors. End-to-end coordination from service request through project completion.",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PL3NBCWD');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("nexops-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
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
                name: "Nexus Operations",
                description:
                  "Nexus is a contractor marketplace connecting homeowners and property managers with licensed, insured contractors for maintenance, restoration, remediation, and emergency response services.",
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
                  "Contractor Marketplace",
                  "Maintenance Coordination",
                  "Restoration Services",
                  "Remediation Services",
                  "Emergency Response",
                  "Post Implementation Review",
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PL3NBCWD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <ChatAgent />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
