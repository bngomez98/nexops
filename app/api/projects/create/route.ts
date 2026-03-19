import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createProjectRequest } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'homeowner') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { category, title, description, location, budget } = body

    // Validation
    if (!category || !title || !description || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create project request
    const project = await createProjectRequest(
      user.id,
      category,
      title,
      description,
      location,
      budget
    )

    return NextResponse.json(
      {
        project: {
          id: project.id,
          title: project.title,
          category: project.category,
          status: project.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
