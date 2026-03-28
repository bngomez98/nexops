import { describe, it, expect } from 'vitest'
import {
  signupSchema,
  loginSchema,
  projectRequestSchema,
  contractorProfileSchema,
  contractorSettingsSchema,
  contactFormSchema,
  homeownerSettingsSchema,
  invoiceCreateSchema,
  messageSchema,
  messageWithJobSchema,
} from '@/lib/validators'

// ─── signupSchema ────────────────────────────────────────────────────────────

describe('signupSchema', () => {
  it('accepts valid homeowner signup', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'homeowner' as const,
    }
    expect(signupSchema.safeParse(data).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'different',
      role: 'homeowner' as const,
    }
    const result = signupSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('requires company name for contractors', () => {
    const data = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'contractor' as const,
    }
    const result = signupSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('accepts valid contractor signup with company name', () => {
    const data = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'contractor' as const,
      companyName: 'Doe Construction',
    }
    expect(signupSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid email', () => {
    const data = {
      name: 'John',
      email: 'not-an-email',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'homeowner' as const,
    }
    const result = signupSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const data = {
      name: 'John',
      email: 'john@example.com',
      password: 'short',
      confirmPassword: 'short',
      role: 'homeowner' as const,
    }
    const result = signupSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

// ─── loginSchema ─────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('accepts valid login', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'x' })
    expect(result.success).toBe(true)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '' })
    expect(result.success).toBe(false)
  })
})

// ─── projectRequestSchema ────────────────────────────────────────────────────

describe('projectRequestSchema', () => {
  it('accepts valid project request', () => {
    const data = {
      category: 'plumbing',
      title: 'Fix kitchen sink',
      description: 'The kitchen sink has been leaking for a week and needs repair.',
      location: 'Topeka, KS',
      budget: '500',
      preferredDate: '2099-05-01',
    }
    expect(projectRequestSchema.safeParse(data).success).toBe(true)
  })

  it('accepts valid project request without a budget', () => {
    const data = {
      category: 'plumbing',
      title: 'Fix kitchen sink',
      description: 'The kitchen sink has been leaking for a week and needs repair.',
      location: 'Topeka, KS',
      budget: '',
      preferredDate: '2099-05-01',
    }
    expect(projectRequestSchema.safeParse(data).success).toBe(true)
  })

  it('rejects short description', () => {
    const data = {
      category: 'plumbing',
      title: 'Fix sink',
      description: 'Short',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
    }
    const result = projectRequestSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects short title', () => {
    const data = {
      category: 'plumbing',
      title: 'Fix',
      description: 'The kitchen sink has been leaking for a week and needs repair.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
    }
    const result = projectRequestSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('requires a preferred service date', () => {
    const result = projectRequestSchema.safeParse({
      category: 'plumbing',
      title: 'Fix kitchen sink',
      description: 'The kitchen sink has been leaking for a week and needs repair.',
      location: 'Topeka, KS',
    })
    expect(result.success).toBe(false)
  })

  it('rejects custom categories without details', () => {
    const result = projectRequestSchema.safeParse({
      category: 'other',
      customCategory: '',
      title: 'Repair specialty feature',
      description: 'The specialty system needs inspection, documentation, and repair support.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
    })
    expect(result.success).toBe(false)
  })
})

// ─── contractorProfileSchema ─────────────────────────────────────────────────

describe('contractorProfileSchema', () => {
  it('accepts valid contractor profile', () => {
    const data = {
      companyName: 'Pro Services LLC',
      licenseNumber: 'LIC123',
      yearsInBusiness: '5',
      bio: 'We are a professional service provider with years of experience in the field.',
      serviceCategories: ['plumbing', 'electrical'],
    }
    expect(contractorProfileSchema.safeParse(data).success).toBe(true)
  })

  it('rejects empty service categories', () => {
    const data = {
      companyName: 'Pro Services LLC',
      licenseNumber: 'LIC123',
      yearsInBusiness: '5',
      bio: 'We are a professional service provider with years of experience in the field.',
      serviceCategories: [],
    }
    const result = contractorProfileSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe('contractorSettingsSchema', () => {
  it('accepts contractor settings without category caps', () => {
    const result = contractorSettingsSchema.safeParse({
      companyName: 'Pro Services LLC',
      licenseNumber: '',
      yearsInBusiness: '5',
      bio: 'We document projects, coordinate access, and handle customer updates end-to-end.',
      serviceCategories: [],
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid years in business', () => {
    const result = contractorSettingsSchema.safeParse({
      companyName: 'Pro Services LLC',
      licenseNumber: 'LIC123',
      yearsInBusiness: 'five',
      bio: 'We document projects, coordinate access, and handle customer updates end-to-end.',
      serviceCategories: ['plumbing'],
    })
    expect(result.success).toBe(false)
  })
})

describe('homeownerSettingsSchema', () => {
  it('accepts valid homeowner settings', () => {
    const result = homeownerSettingsSchema.safeParse({
      email: 'john@example.com',
      phone: '+1 (785) 555-0100',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid homeowner email', () => {
    const result = homeownerSettingsSchema.safeParse({
      email: 'not-an-email',
      phone: '',
    })
    expect(result.success).toBe(false)
  })
})

// ─── contactFormSchema ───────────────────────────────────────────────────────

describe('contactFormSchema', () => {
  it('accepts valid contact form', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      type: 'homeowner' as const,
      message: 'I need help with my roof replacement project.',
    }
    expect(contactFormSchema.safeParse(data).success).toBe(true)
  })

  it('accepts with optional phone', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      type: 'contractor' as const,
      message: 'I am interested in joining the network.',
    }
    expect(contactFormSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid type', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      type: 'unknown',
      message: 'Some long enough message for validation.',
    }
    const result = contactFormSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects short message', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      type: 'homeowner' as const,
      message: 'Hi',
    }
    const result = contactFormSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const result = contactFormSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

// ─── invoiceCreateSchema ─────────────────────────────────────────────────────

describe('invoiceCreateSchema', () => {
  it('accepts valid invoice', () => {
    const data = {
      job_id: '550e8400-e29b-41d4-a716-446655440000',
      line_items: [
        { description: 'Labor', amount: 250 },
        { description: 'Materials', amount: 100 },
      ],
    }
    expect(invoiceCreateSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid job_id', () => {
    const data = {
      job_id: 'not-a-uuid',
      line_items: [{ amount: 100 }],
    }
    const result = invoiceCreateSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects empty line items', () => {
    const data = {
      job_id: '550e8400-e29b-41d4-a716-446655440000',
      line_items: [],
    }
    const result = invoiceCreateSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects negative amount', () => {
    const data = {
      job_id: '550e8400-e29b-41d4-a716-446655440000',
      line_items: [{ amount: -50 }],
    }
    const result = invoiceCreateSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

// ─── messageSchema ───────────────────────────────────────────────────────────

describe('messageSchema', () => {
  it('accepts valid message', () => {
    const data = {
      content: 'Hello, I have a question about the project.',
      recipient_id: '550e8400-e29b-41d4-a716-446655440000',
    }
    expect(messageSchema.safeParse(data).success).toBe(true)
  })

  it('rejects empty content', () => {
    const result = messageSchema.safeParse({
      content: '',
      recipient_id: '550e8400-e29b-41d4-a716-446655440000',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid recipient_id', () => {
    const result = messageSchema.safeParse({
      content: 'Hello',
      recipient_id: 'not-a-uuid',
    })
    expect(result.success).toBe(false)
  })
})

// ─── messageWithJobSchema ────────────────────────────────────────────────────

describe('messageWithJobSchema', () => {
  it('accepts valid message with job', () => {
    const data = {
      job_id: '550e8400-e29b-41d4-a716-446655440000',
      content: 'Hello, I have a question about the project.',
      recipient_id: '660e8400-e29b-41d4-a716-446655440000',
    }
    expect(messageWithJobSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing job_id', () => {
    const data = {
      content: 'Hello',
      recipient_id: '550e8400-e29b-41d4-a716-446655440000',
    }
    const result = messageWithJobSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
