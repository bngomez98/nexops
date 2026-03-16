"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ClaimButtonProps {
  requestId: string;
}

export function ClaimButton({ requestId }: ClaimButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState("");

  async function handleClaim() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to claim project");
        return;
      }

      setClaimed(true);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (claimed) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <CheckCircle className="h-4 w-4" />
        Project claimed! Refreshing…
      </div>
    );
  }

  return (
    <div>
      <Button onClick={handleClaim} disabled={loading} size="sm">
        {loading ? "Claiming…" : "Claim this project"}
      </Button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
