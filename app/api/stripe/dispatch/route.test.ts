import { beforeEach, describe, expect, it, vi } from "vitest"

const createClientMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}))

describe("POST /api/stripe/dispatch", () => {
  beforeEach(() => {
    vi.resetModules()
    createClientMock.mockReset()
  })

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

  it("skips checkout when the owner has an active subscription", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123"

    const paymentInsert = vi.fn()
    const serviceRequestUpdateEq = vi.fn()
    const serviceRequestUpdate = vi.fn(() => ({ eq: serviceRequestUpdateEq }))

    const from = vi.fn((table: string) => {
      if (table === "service_requests") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: {
                  id: "req_123",
                  owner_id: "owner-1",
                  assigned_contractor_id: "contractor-1",
                  status: "assigned",
                  category: "roofing",
                },
              }),
            }),
          }),
          update: serviceRequestUpdate,
        }
      }

      if (table === "payments") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                in: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            }),
          }),
          insert: paymentInsert,
        }
      }

      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: table === "profiles"
                  ? {
                      stripe_customer_id: "cus_owner",
                      full_name: "Owner One",
                      subscription_status: "active",
                    }
                  : null,
              }),
            }),
          }),
        }
      }

      throw new Error(`unexpected table ${table}`)
    })

    let profileCall = 0
    const fromWithProfiles = vi.fn((table: string) => {
      if (table !== "profiles") return from(table)
      profileCall += 1
      return {
        select: () => ({
          eq: () => ({
            single: async () => ({
              data:
                profileCall === 1
                  ? {
                      stripe_connect_account_id: "acct_123",
                      stripe_connect_status: "active",
                      full_name: "Contractor One",
                    }
                  : {
                      stripe_customer_id: "cus_owner",
                      full_name: "Owner One",
                      subscription_status: "active",
                    },
            }),
          }),
        }),
      }
    })

    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "owner-1",
              email: "owner@example.com",
            },
          },
        }),
      },
      from: fromWithProfiles,
    })

    const { POST } = await import("./route")
    const res = await POST(
      new Request("http://localhost/api/stripe/dispatch", {
        method: "POST",
        body: JSON.stringify({ requestId: "req_123" }),
      }),
    )
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.checkoutSkipped).toBe(true)
    expect(paymentInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        request_id: "req_123",
        amount_cents: 0,
        status: "paid",
      }),
    )
    expect(serviceRequestUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ owner_fee_paid: true }),
    )
    expect(serviceRequestUpdateEq).toHaveBeenCalledWith("id", "req_123")
  })
})
