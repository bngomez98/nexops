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

function toCategoryList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  }

  return []
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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const { data: project, error: projectError } = await supabase
      .from('service_requests')
      .select('id, owner_id, category, budget_max')
      .eq('id', projectId)
      .eq('owner_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: contractors, error: contractorsError } = await supabase
      .from('profiles')
      .select('id, full_name, email, service_categories, average_rating, reviews_count, is_active')
      .eq('role', 'contractor')
      .neq('is_active', false)

    if (contractorsError || !contractors) {
      return NextResponse.json({ matches: [] })
    }

    const contractorIds = contractors
      .map((contractor) => (typeof contractor.id === 'string' ? contractor.id : null))
      .filter((id): id is string => Boolean(id))

    const { data: activeProjectsData } = await supabase
      .from('service_requests')
      .select('assigned_contractor_id')
      .in('assigned_contractor_id', contractorIds)
      .in('status', ['assigned', 'consultation_scheduled', 'in_progress'])

    const projectCountByContractor = contractorIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = activeProjectsData?.filter((projectRow) => projectRow.assigned_contractor_id === id).length ?? 0
      return acc
    }, {})

    const projectCategory = String(project.category).toLowerCase()

    const matches: ContractorMatch[] = contractors
      .reduce<ContractorMatch[]>((acc, contractor) => {
        const contractorId = typeof contractor.id === 'string' ? contractor.id : null

        if (!contractorId) {
          return acc
        }

        let score = 100

        // Category match (40 points)
        const serviceCategories = toCategoryList(contractor.service_categories)
        if (serviceCategories.length > 0 && !serviceCategories.includes(projectCategory)) {
          score -= 40
        }

        // Workload capacity (20 points)
        const activeProjects = projectCountByContractor[contractorId] || 0
        if (activeProjects >= 3) {
          score -= 20
        } else if (activeProjects >= 2) {
          score -= 10
        }

        // Rating boost (10 points)
        const rating =
          typeof contractor.average_rating === 'number' ? contractor.average_rating : 0
        if (rating >= 4.5) {
          score += 10
        } else if (rating >= 4) {
          score += 5
        }

        acc.push({
          contractor_id: contractorId,
          email: typeof contractor.email === 'string' ? contractor.email : '',
          full_name:
            (typeof contractor.full_name === 'string' && contractor.full_name) ||
            'Contractor',
          match_score: Math.max(0, Math.min(100, score)),
          active_projects: activeProjects,
          average_rating: rating,
        })

        return acc
      }, [])
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5)

    if (matches.length > 0 && matches[0].match_score > 85) {
      const topMatch = matches[0]
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
          message: `Project automatically assigned to ${topMatch.full_name} (${topMatch.match_score.toFixed(0)}% match)`,
        })
      }
    }

    return NextResponse.json({ matches, autoAssigned: false })
  } catch (error) {
    console.error('[POST /api/automation/match-contractor]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
