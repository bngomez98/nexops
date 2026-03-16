import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default async function ContactPage() {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Contact us</h1>
            <p className="mt-4 text-lg text-gray-500">Have a question? We&apos;re here to help.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {[
              { icon: <Mail className="h-5 w-5" />, label: "Email", value: "hello@nexops.com" },
              { icon: <Phone className="h-5 w-5" />, label: "Phone", value: "785-555-0100" },
              { icon: <MapPin className="h-5 w-5" />, label: "Location", value: "Topeka, KS" },
            ].map(({ icon, label, value }) => (
              <Card key={label} className="text-center">
                <CardHeader className="pb-2">
                  <div className="mx-auto text-blue-600">{icon}</div>
                  <CardTitle className="text-sm text-gray-500 font-normal">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-900">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-center">
                For quickest response, email us at{" "}
                <a href="mailto:hello@nexops.com" className="text-blue-600 hover:underline">
                  hello@nexops.com
                </a>
                . We typically respond within one business day.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
