import { describe, expect, it } from "vitest"

describe("POST /api/stripe/dispatch", () => {
  it("returns 500 when Stripe is not configured", async () => {
    delete process.env.STRIPE_SECRET_KEY
    const { POST } = await import("./route")

    const res = await POST(
      new Request("http://localhost/api/stripe/dispatch", {
        method: "POST",
        body: JSON.stringify({ requestId: "req_123" }),
      }),
    )
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toContain("not fully configured")
  })
})
