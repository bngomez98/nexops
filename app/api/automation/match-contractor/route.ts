import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAutomationEnabled } from '@/lib/env'

interface ContractorMatch {
  contractor_id: string
  email: string | null
  full_name: string
  match_score: number
  active_projects: number
  average_rating: number
}

export async function POST(request: NextRequest) {
  if (!isAutomationEnabled()) {
    return NextResponse.json(
      { error: 'Automation features are disabled', code: 'FEATURE_DISABLED' },
      { status: 403 },
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    // Get the project details
    const { data: project, error: projError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', projectId)
      .eq('owner_id', user.id)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get all available contractors
    const { data: contractors, error: contError } = await supabase
      .from('profiles')
      .select('id, full_name, email, category, service_categories, skills, service_area, average_rating, reviews_count')
      .eq('role', 'contractor')
      .eq('is_active', true)

    if (contError || !contractors) {
      return NextResponse.json({ matches: [] })
    }

    // Count active projects for each contractor
    const { data: activeProjectsData } = await supabase
      .from('service_requests')
      .select('assigned_contractor_id')
      .in('assigned_contractor_id', contractors.map(c => c.id))
      .in('status', ['assigned', 'consultation_scheduled', 'in_progress'])

    const projectCountByContractor = contractors.reduce((acc, c) => {
      acc[c.id] = activeProjectsData?.filter(p => p.assigned_contractor_id === c.id).length ?? 0
      return acc
    }, {} as Record<string, number>)

    // Calculate match scores
    const matches: ContractorMatch[] = contractors
      .map(contractor => {
        let score = 100

        // Category/skills match (40 points)
         const contractorCategories = Array.from(
           new Set(
             [
               ...(Array.isArray(contractor.service_categories) ? contractor.service_categories : []),
               ...(contractor.category ? contractor.category.split(',') : []),
             ]
               .map((c) => String(c).trim().toLowerCase())
               .filter(Boolean),
           ),
         )
        if (!contractorCategories.includes(project.category.toLowerCase())) {
          score -= 40
        }

        // Budget match (30 points) - if budget matches their typical range
        if (project.budget_max) {
          const minReasonableBudget = project.budget_max * 0.8
          const maxReasonableBudget = project.budget_max * 1.2
          const typicalBudget = project.budget_max
          if (typicalBudget < minReasonableBudget || typicalBudget > maxReasonableBudget) {
            score -= 15
          }
        }

        // Workload capacity (20 points)
        const activeProjects = projectCountByContractor[contractor.id] || 0
        if (activeProjects >= 3) {
          score -= 20
        } else if (activeProjects >= 2) {
          score -= 10
        }

        // Rating boost (10 points)
        const rating = contractor.average_rating || 0
        if (rating >= 4.5) {
          score += 10
        } else if (rating >= 4.0) {
          score += 5
        }

        return {
          contractor_id: contractor.id,
          email: contractor.email,
          full_name: contractor.full_name,
          match_score: Math.max(0, Math.min(100, score)),
          active_projects: activeProjects,
          average_rating: rating,
        }
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5) // Top 5 matches

    // Auto-suggest if top match score > 85
    if (matches.length > 0 && matches[0].match_score > 85) {
      const topMatch = matches[0]
      // Auto-assign the contractor if score is very high
      const { error: updateError } = await supabase
        .from('service_requests')
        .update({
          assigned_contractor_id: topMatch.contractor_id,
          status: 'assigned',
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)

      if (!updateError) {
        return NextResponse.json({
          matches,
          autoAssigned: true,
          message: `Project automatically assigned to ${topMatch.full_name} (${(topMatch.match_score).toFixed(0)}% match)`,
        })
      }
    }

    return NextResponse.json({
      matches,
      autoAssigned: false,
    })
  } catch (err) {
    console.error('[POST /api/automation/match-contractor]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
