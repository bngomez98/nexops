import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, createSessionCookie } from '@/lib/auth'
import { getUserByEmail, createUser, createSession, createContractorProfile } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, companyName, licenseNumber, yearsInBusiness, serviceCategories, bio } = body

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await createUser(email, passwordHash, name, role)

    // If contractor, create profile
    if (role === 'contractor') {
      if (!companyName || !licenseNumber || yearsInBusiness === undefined) {
        return NextResponse.json(
          { error: 'Missing contractor profile information' },
          { status: 400 }
        )
      }
      await createContractorProfile(
        user.id,
        companyName,
        licenseNumber,
        yearsInBusiness,
        serviceCategories || [],
        bio || ''
      )
    }

    // Create session
    const session = await createSession(user.id)
    await createSessionCookie(session.id)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
