import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateUser, deleteUser } from '@/lib/db'
import { logout } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'homeowner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, phone, address, city, state, zipCode } = body

    if (!email || !address) {
      return NextResponse.json({ error: 'Email and address are required' }, { status: 400 })
    }

    const updated = await updateUser(user.id, { email, phone, address, city, state, zipCode })
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save homeowner settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'homeowner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await logout()
    await deleteUser(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete homeowner account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
