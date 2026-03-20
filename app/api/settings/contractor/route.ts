import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateContractorProfile, deleteUser } from '@/lib/db'
import { logout } from '@/lib/auth'
import { ServiceCategory } from '@/lib/types'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'contractor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { companyName, bio, licenseNumber, yearsInBusiness, serviceCategories } = body

    if (!companyName || !bio || !serviceCategories || serviceCategories.length === 0) {
      return NextResponse.json({ error: 'Company name, bio, and at least one service category are required' }, { status: 400 })
    }

    const updated = await updateContractorProfile(user.id, {
      companyName,
      bio,
      licenseNumber: licenseNumber ?? '',
      yearsInBusiness: Number(yearsInBusiness) || 0,
      serviceCategories: serviceCategories as ServiceCategory[],
    })

    if (!updated) {
      return NextResponse.json({ error: 'Contractor profile not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save contractor settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'contractor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await logout()
    await deleteUser(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete contractor account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
