import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexOps – Home Services in Topeka, KS",
    template: "%s | NexOps",
  },
  description:
    "Nexus Operations connects Topeka homeowners with licensed, insured contractors. Submit a project request for free and get matched with one verified contractor within 24 hours.",
  keywords: ["home services", "contractors", "Topeka KS", "home repair", "nexops"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
