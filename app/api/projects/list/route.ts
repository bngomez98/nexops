import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getProjectsByHomeowner, getOpenProjects } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'my-projects'

    if (user.role === 'homeowner' && type === 'my-projects') {
      const projects = await getProjectsByHomeowner(user.id)
      return NextResponse.json({ projects })
    } else if (user.role === 'contractor' && type === 'available') {
      const projects = await getOpenProjects()
      return NextResponse.json({ projects })
    }

    return NextResponse.json({ projects: [] })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
