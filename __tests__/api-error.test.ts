import { describe, it, expect } from 'vitest'
import { apiError, badRequest, unauthorized, forbidden, notFound, internalError } from '@/lib/api-error'

describe('apiError', () => {
  it('returns a Response with the given status', async () => {
    const res = apiError('Something went wrong', 422)
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body).toEqual({ error: 'Something went wrong' })
  })

  it('sets Content-Type to application/json', () => {
    const res = apiError('oops', 400)
    expect(res.headers.get('content-type')).toContain('application/json')
  })
})

describe('badRequest', () => {
  it('returns 400 with the given message', async () => {
    const res = badRequest('Missing field')
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing field' })
  })
})

describe('unauthorized', () => {
  it('returns 401 with default message', async () => {
    const res = unauthorized()
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: 'Unauthorized' })
  })

  it('returns 401 with custom message', async () => {
    const res = unauthorized('Token expired')
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: 'Token expired' })
  })
})

describe('forbidden', () => {
  it('returns 403 with default message', async () => {
    const res = forbidden()
    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ error: 'Forbidden' })
  })
})

describe('notFound', () => {
  it('returns 404 with default message', async () => {
    const res = notFound()
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Not found' })
  })

  it('returns 404 with custom message', async () => {
    const res = notFound('Project not found')
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Project not found' })
  })
})

describe('internalError', () => {
  it('returns 500 with default message', async () => {
    const res = internalError()
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Internal server error' })
  })
})
