import { beforeEach, describe, expect, it, vi } from "vitest"

const createClientMock = vi.hoisted(() => vi.fn())
const billingPortalCreateMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}))

vi.mock("stripe", () => {
  return {
    default: class Stripe {
      billingPortal = {
        sessions: {
          create: billingPortalCreateMock,
        },
      }
    },
  }
})

describe("POST /api/stripe/portal", () => {
  beforeEach(() => {
    vi.resetModules()
    createClientMock.mockReset()
    billingPortalCreateMock.mockReset()
    process.env.NEXT_PUBLIC_SITE_URL = "https://nexusoperations.org"
  })

  it("returns 500 when Stripe is not configured", async () => {
    delete process.env.STRIPE_SECRET_KEY
    const { POST } = await import("./route")

    const res = await POST()
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toContain("not fully configured")
  })

  it("returns 400 when no Stripe customer exists on profile", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123"
    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: { id: "user-1" } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: { stripe_customer_id: null }, error: null }),
          }),
        }),
      }),
    })

    const { POST } = await import("./route")
    const res = await POST()
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toContain("No Stripe billing account")
    expect(billingPortalCreateMock).not.toHaveBeenCalled()
  })

  it("creates a Stripe billing portal session when profile is valid", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123"
    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: { id: "user-1", user_metadata: { role: "contractor" } } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: { stripe_customer_id: "cus_123" }, error: null }),
          }),
        }),
      }),
    })

    billingPortalCreateMock.mockResolvedValue({ url: "https://billing.stripe.test/session" })

    const { POST } = await import("./route")
    const res = await POST()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ url: "https://billing.stripe.test/session" })
    expect(billingPortalCreateMock).toHaveBeenCalledWith({
      customer: "cus_123",
      return_url: "https://nexusoperations.org/dashboard/contractor/settings",
    })
  })

  it("uses the owner settings return path for owner billing sessions", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123"
    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: { id: "user-2", user_metadata: { role: "homeowner" } } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: { stripe_customer_id: "cus_owner" }, error: null }),
          }),
        }),
      }),
    })

    billingPortalCreateMock.mockResolvedValue({ url: "https://billing.stripe.test/owner-session" })

    const { POST } = await import("./route")
    const res = await POST()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ url: "https://billing.stripe.test/owner-session" })
    expect(billingPortalCreateMock).toHaveBeenCalledWith({
      customer: "cus_owner",
      return_url: "https://nexusoperations.org/dashboard/settings",
    })
  })
})
