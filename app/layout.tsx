import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NexOps - Home Services in Topeka, KS",
    template: "%s | NexOps",
  },
  description:
    "Nexus Operations connects Topeka homeowners with licensed, insured contractors. Submit a project request for free and get matched with one verified contractor within 24 hours.",
  keywords: ["home services", "contractors", "Topeka KS", "home repair", "nexops"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
