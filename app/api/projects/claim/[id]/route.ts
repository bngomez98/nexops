import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { claimProject, getProjectById, getContractorProfile } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'contractor') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: projectId } = await params

    // Get project
    const project = await getProjectById(projectId)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.status !== 'open') {
      return NextResponse.json(
        { error: 'Project is no longer available' },
        { status: 400 }
      )
    }

    // Check contractor profile and active projects
    const profile = await getContractorProfile(user.id)
    if (!profile) {
      return NextResponse.json(
        { error: 'Contractor profile not found' },
        { status: 404 }
      )
    }

    if (profile.currentActiveProjects >= profile.maxActiveProjects) {
      return NextResponse.json(
        { error: 'You have reached your maximum active projects limit' },
        { status: 400 }
      )
    }

    // Claim project
    const updatedProject = await claimProject(projectId, user.id)

    return NextResponse.json(
      {
        project: {
          id: updatedProject?.id,
          title: updatedProject?.title,
          status: updatedProject?.status,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Claim project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
