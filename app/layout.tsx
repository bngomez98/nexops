import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Nexus Operations',
  description: 'Connect homeowners with licensed, insured contractors in Topeka, KS and surrounding regions.',
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
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className}`}>
        {children}
      </body>
    </html>
  )
}
