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
  brandingSchema,
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
      photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
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
      photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
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

  it('accepts "other" category without extra details', () => {
    const result = projectRequestSchema.safeParse({
      category: 'other',
      customCategory: '',
      title: 'Repair specialty feature',
      description: 'The specialty system needs inspection, documentation, and repair support.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts custom category with category set to other', () => {
    const result = projectRequestSchema.safeParse({
      category: 'other',
      customCategory: 'pool-maintenance',
      title: 'Handle pool chemical balance and filter replacement',
      description: 'Need recurring pool support and documentation for chemical logs and filtration checks.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts non-enumerated category slugs', () => {
    const result = projectRequestSchema.safeParse({
      category: 'graffiti-removal',
      title: 'Remove graffiti from retaining wall',
      description: 'Need cleanup, surface prep, and matching paint with documented before/after photos.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
    })
    expect(result.success).toBe(true)
  })

  it('requires at least 2 photos', () => {
    const result = projectRequestSchema.safeParse({
      category: 'graffiti-removal',
      title: 'Remove graffiti from retaining wall',
      description: 'Need cleanup, surface prep, and matching paint with documented before/after photos.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      photoUrls: ['https://example.com/photo-1.jpg'],
    })
    expect(result.success).toBe(false)
  })

  it('accepts between 2 and 9 photos', () => {
    const result = projectRequestSchema.safeParse({
      category: 'graffiti-removal',
      title: 'Remove graffiti from retaining wall',
      description: 'Need cleanup, surface prep, and matching paint with documented before/after photos.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      photoUrls: [
        'https://example.com/photo-1.jpg',
        'https://example.com/photo-2.jpg',
      ],
    })
    expect(result.success).toBe(true)
  })

  it('accepts automated community pipeline preferences', () => {
    const result = projectRequestSchema.safeParse({
      category: 'open-request',
      title: 'Document and track multi-service request',
      description: 'Need an automated workflow to match specialists, track progress, and manage billing updates.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      pipelineMode: 'community',
      communityVisible: true,
      accessRequirements: 'Gate code 4421, use east entrance.',
      photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid pipeline mode', () => {
    const result = projectRequestSchema.safeParse({
      category: 'open-request',
      title: 'General request for service coordination',
      description: 'Need request tracking, handling, and documentation support for ongoing service work.',
      location: 'Topeka, KS',
      preferredDate: '2099-05-01',
      pipelineMode: 'unknown-mode',
      communityVisible: true,
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
      bio: 'We document projects, manage access, and handle customer updates end-to-end.',
      serviceCategories: [],
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid years in business', () => {
    const result = contractorSettingsSchema.safeParse({
      companyName: 'Pro Services LLC',
      licenseNumber: 'LIC123',
      yearsInBusiness: 'five',
      bio: 'We document projects, manage access, and handle customer updates end-to-end.',
      serviceCategories: ['plumbing'],
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative years in business', () => {
    const result = contractorSettingsSchema.safeParse({
      companyName: 'Pro Services LLC',
      licenseNumber: 'LIC123',
      yearsInBusiness: '-1',
      bio: 'We document projects, manage access, and handle customer updates end-to-end.',
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

// ─── brandingSchema ──────────────────────────────────────────────────────────

describe('brandingSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    expect(brandingSchema.safeParse({}).success).toBe(true)
  })

  it('accepts full valid branding config', () => {
    const data = {
      brandName: 'Acme Property Group',
      primaryColor: '#1a5d2e',
      accentColor: '#e8f5ec',
      logoUrl: 'https://example.com/logo.png',
    }
    expect(brandingSchema.safeParse(data).success).toBe(true)
  })

  it('accepts empty string values (to clear individual fields)', () => {
    const data = {
      brandName: '',
      primaryColor: '',
      accentColor: '',
      logoUrl: '',
    }
    expect(brandingSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid hex color for primaryColor', () => {
    const result = brandingSchema.safeParse({ primaryColor: 'red' })
    expect(result.success).toBe(false)
  })

  it('rejects 3-digit hex shorthand for primaryColor', () => {
    const result = brandingSchema.safeParse({ primaryColor: '#abc' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid hex color for accentColor', () => {
    const result = brandingSchema.safeParse({ accentColor: '#GGGGGG' })
    expect(result.success).toBe(false)
  })

  it('rejects malformed URL for logoUrl', () => {
    const result = brandingSchema.safeParse({ logoUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('rejects brandName exceeding 100 characters', () => {
    const result = brandingSchema.safeParse({ brandName: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts brandName at exactly 100 characters', () => {
    const result = brandingSchema.safeParse({ brandName: 'A'.repeat(100) })
    expect(result.success).toBe(true)
  })

  it('accepts uppercase hex colors', () => {
    const result = brandingSchema.safeParse({ primaryColor: '#1A5D2E' })
    expect(result.success).toBe(true)
  })
})
