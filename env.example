import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { CookieConsent } from "@/components/cookie-consent"

const GTM_ID = "GTM-PL3NBCWD"
const GA_ID = "G-LDGVHFCMKT"

const THEME_INIT_SCRIPT = `(function () {
  var theme = localStorage.getItem('nexus-theme')
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.add('light')
  }
})()`

const GTM_INIT_SCRIPT = `(function (w, d, s, l, i) {
  w[l] = w[l] || []
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  var firstScript = d.getElementsByTagName(s)[0]
  var script = d.createElement(s)
  var dataLayerParam = l !== 'dataLayer' ? '&l=' + l : ''
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dataLayerParam
  firstScript.parentNode.insertBefore(script, firstScript)
})(window, document, 'script', 'dataLayer', '${GTM_ID}')`

const GA_INIT_SCRIPT = `window.dataLayer = window.dataLayer || []
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`

export const metadata: Metadata = {
  title: "Nexus Operations | One contractor. Exclusively yours.",
  description:
    "Nexus Operations connects homeowners and property managers with licensed, insured contractors in Topeka, KS. Submit your project once — one verified contractor claims it exclusively.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#0f0f0f",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Theme init — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Google Fonts — loaded as link tags so the build doesn't depend on network access */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-inter: "Inter";
            --font-plus-jakarta-sans: "Plus Jakarta Sans";
            --font-ibm-plex-mono: "IBM Plex Mono";
          }
        `}} />
      </head>
      <body className="font-sans">
        {/* Google Tag Manager */}
        <Script id="gtm-loader" strategy="afterInteractive">
          {GTM_INIT_SCRIPT}
        </Script>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Analytics (gtag.js) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {GA_INIT_SCRIPT}
        </Script>

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
  )
}
