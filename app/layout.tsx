import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Operations | One Project. One Contractor. Done Right.",
  description:
    "Nexus Operations connects property owners with verified, licensed contractors through exclusive project assignment. No competing bids. No shared leads. Just one qualified professional matched to your project.",
  icons: {
    icon: "/nexus-favicon.png",
    apple: "/nexus-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
