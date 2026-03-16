import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>NexOps</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Connecting Topeka homeowners with trusted, verified contractors.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link href="/services" className="hover:text-gray-900">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
              <li><Link href="/contractors" className="hover:text-gray-900">For Contractors</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Get started</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link href="/signup" className="hover:text-gray-900">Submit a request</Link></li>
              <li><Link href="/signup?role=contractor" className="hover:text-gray-900">Join as contractor</Link></li>
              <li><Link href="/login" className="hover:text-gray-900">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Nexus Operations LLC. All rights reserved. Serving Topeka, KS and surrounding areas.
        </div>
      </div>
    </footer>
  );
}
