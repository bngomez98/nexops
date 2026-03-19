import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['homeowner', 'contractor']),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  bio: z.string().optional(),
  serviceCategories: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'contractor') {
    return data.companyName && data.companyName.length > 0
  }
  return true
}, {
  message: 'Company name is required for contractors',
  path: ['companyName'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const projectRequestSchema = z.object({
  category: z.string().min(1, 'Please select a service category'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  location: z.string().min(3, 'Please enter a valid location'),
  budget: z.string().min(1, 'Please enter a budget').optional(),
})

export const contractorProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  licenseNumber: z.string().min(3, 'License number is required'),
  yearsInBusiness: z.string().min(1, 'Years in business is required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500, 'Bio must be less than 500 characters'),
  serviceCategories: z.array(z.string()).min(1, 'Select at least one service category'),
})

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProjectRequestData = z.infer<typeof projectRequestSchema>
export type ContractorProfileData = z.infer<typeof contractorProfileSchema>
