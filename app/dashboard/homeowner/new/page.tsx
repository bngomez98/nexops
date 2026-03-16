"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { SERVICE_LABELS, type ServiceCategory } from "@/lib/store";

const CATEGORIES = Object.entries(SERVICE_LABELS) as [ServiceCategory, string][];

export default function NewRequestPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "" as ServiceCategory | "",
    maxBudget: "",
    address: "",
    city: "Topeka",
    state: "KS",
    zip: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a service category");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxBudget: Number(form.maxBudget),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit request");
        return;
      }

      router.push("/dashboard/homeowner");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <Link href="/dashboard/homeowner">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">New project request</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="title">Project title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Large oak tree removal"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="category">Service category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as ServiceCategory }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Project description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your project in detail. Include any relevant measurements, materials, or special considerations."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="maxBudget">Maximum budget ($)</Label>
                <Input
                  id="maxBudget"
                  name="maxBudget"
                  type="number"
                  placeholder="5000"
                  min={1}
                  value={form.maxBudget}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-400">Contractors will see your max budget before claiming.</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="1234 SW 29th St"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input id="zip" name="zip" placeholder="66604" value={form.zip} onChange={handleChange} required />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Link href="/dashboard/homeowner" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">Cancel</Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Submitting…" : "Submit request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
