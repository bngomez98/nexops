"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

interface NavbarProps {
  user?: { name: string; role: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>NexOps</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/contractors" className="text-gray-600 hover:text-gray-900">For Contractors</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === "contractor" ? "/dashboard/contractor" : "/dashboard/homeowner"}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/services" className="block text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Services</Link>
          <Link href="/pricing" className="block text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/contractors" className="block text-sm text-gray-700" onClick={() => setMobileOpen(false)}>For Contractors</Link>
          <Link href="/contact" className="block text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Contact</Link>
          <div className="flex gap-2 pt-2">
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">Log out</Button>
            ) : (
              <>
                <Link href="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
                <Link href="/signup" className="flex-1"><Button size="sm" className="w-full">Sign up</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
