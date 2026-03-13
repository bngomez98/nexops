import { beforeEach, describe, expect, it, vi } from "vitest"

const createClientMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}))

import { POST } from "./route"

function buildRequest() {
  return new Request("http://localhost/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: "roofing",
      description: "Need a roof inspection",
      address: "123 Main St",
      city: "Wichita",
      zipCode: "67202",
    }),
  })
}

describe("POST /api/requests", () => {
  beforeEach(() => {
    createClientMock.mockReset()
  })

  it("allows homeowners to create a request", async () => {
    const insert = vi.fn(() => ({
      select: () => ({ single: async () => ({ data: { id: "req-1" }, error: null }) }),
    }))
    const from = vi.fn(() => ({ insert }))

    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: { id: "user-1", user_metadata: { role: "homeowner" } } } }),
      },
      from,
    })

    const res = await POST(buildRequest())
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body).toEqual({ id: "req-1" })
    expect(from).toHaveBeenCalledWith("service_requests")
    expect(insert).toHaveBeenCalledOnce()
  })

  it("rejects contractor request creation", async () => {
    const insert = vi.fn()
    const from = vi.fn(() => ({ insert }))

    createClientMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: { id: "user-2", user_metadata: { role: "contractor" } } } }),
      },
      from,
    })

    const res = await POST(buildRequest())
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body).toEqual({ error: "Only homeowners can submit service requests." })
    expect(insert).not.toHaveBeenCalled()
  })
})
