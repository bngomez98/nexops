import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Operations | Maintenance, Remediation, Preventative, and Routine Services. When you need it, how you need it - managed from start to finish,
  description:
    " platform that connects homeowners and property managers with licensed, insured contractors for all maintenance, improvement, remediation, or emergency maintenance needs. Provides end-to-end maintenance, restoration, and remediation services; including emergency response. Fully coordinated from the moment the service is requested. Nexus manages and coordinates projects and operation requirements until the job is completed. We then provide a Post Implementation Review - this gives insights to homeowners and property managers, and evaluates our success in our work with them, allowing owners to stay in control without the burden of day-to-day operations. We remain a strategic and dependable partner, providing skilled labor and data-driven intelligence",
  icons: {
    icon: "/nexus-favicon.png",
    apple: "/nexus-favicon.png",
  },
};
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Nexus Operations',
  description: 'Connects homeowners, landlords, and property managers with licensed, insured contractors in Topeka, KS and surrounding regions.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PL3NBCWD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}

        <CookieConsent />

        {/* Zendesk Widget */}
        <script
          id="ze-snippet"
          src="https://static.zdassets.com/ekr/snippet.js?key=d8a1128c-008a-443c-894e-4a0fd463bb57"
          async
        />
      </body>
    </html>
  );
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
