import { beforeEach, describe, expect, it, vi } from "vitest"

const createClientMock = vi.hoisted(() => vi.fn())
const customersCreateMock = vi.hoisted(() => vi.fn())
const checkoutCreateMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}))

vi.mock("stripe", () => {
  return {
    default: class Stripe {
      customers = {
        create: customersCreateMock,
      }

      checkout = {
        sessions: {
          create: checkoutCreateMock,
        },
      }
    },
  }
})

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.resetModules()
    createClientMock.mockReset()
    customersCreateMock.mockReset()
    checkoutCreateMock.mockReset()
    process.env.STRIPE_SECRET_KEY = "sk_test_123"
    process.env.NEXT_PUBLIC_SITE_URL = "https://nexusoperations.org"
    process.env.NEXT_PUBLIC_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS = "9900"
  })

  it("creates a contractor subscription using the contractor-configured price", async () => {
    const updateEq = vi.fn()
    const update = vi.fn(() => ({ eq: updateEq }))
    const from = vi.fn((table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: {
                  stripe_customer_id: null,
                  full_name: "Casey Contractor",
                  subscription_price_cents: 12500,
                },
              }),
            }),
          }),
          update,
        }
      }
      throw new Error(`unexpected table ${table}`)
    })

    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "contractor-1",
              email: "contractor@example.com",
              user_metadata: { role: "contractor" },
            },
          },
        }),
      },
      from,
    })

    customersCreateMock.mockResolvedValue({ id: "cus_contractor" })
    checkoutCreateMock.mockResolvedValue({ url: "https://checkout.stripe.test/contractor" })

    const { POST } = await import("./route")
    const res = await POST()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ url: "https://checkout.stripe.test/contractor" })
    expect(checkoutCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "https://nexusoperations.org/dashboard/contractor/billing?billing=success",
        cancel_url: "https://nexusoperations.org/dashboard/contractor/billing?billing=canceled",
        metadata: expect.objectContaining({
          subscription_role: "contractor",
          subscription_price_cents: "12500",
        }),
      }),
    )

    const sessionPayload = checkoutCreateMock.mock.calls[0]?.[0]
    expect(sessionPayload.line_items[0].price_data.unit_amount).toBe(12500)
    expect(customersCreateMock).toHaveBeenCalledOnce()
    expect(update).toHaveBeenCalledWith({ stripe_customer_id: "cus_contractor" })
    expect(updateEq).toHaveBeenCalledWith("id", "contractor-1")
  })

  it("creates an owner subscription at 2x the contractor base price", async () => {
    const from = vi.fn((table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: {
                  stripe_customer_id: "cus_owner",
                  full_name: "Olivia Owner",
                  subscription_price_cents: null,
                },
              }),
            }),
          }),
        }
      }
      throw new Error(`unexpected table ${table}`)
    })

    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "owner-1",
              email: "owner@example.com",
              user_metadata: { role: "homeowner" },
            },
          },
        }),
      },
      from,
    })

    checkoutCreateMock.mockResolvedValue({ url: "https://checkout.stripe.test/owner" })

    const { POST } = await import("./route")
    const res = await POST()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ url: "https://checkout.stripe.test/owner" })
    const sessionPayload = checkoutCreateMock.mock.calls[0]?.[0]
    expect(sessionPayload.success_url).toBe("https://nexusoperations.org/dashboard/billing?billing=success")
    expect(sessionPayload.cancel_url).toBe("https://nexusoperations.org/dashboard/billing?billing=canceled")
    expect(sessionPayload.line_items[0].price_data.unit_amount).toBe(19800)
    expect(sessionPayload.metadata.subscription_role).toBe("owner")
    expect(customersCreateMock).not.toHaveBeenCalled()
  })
})
