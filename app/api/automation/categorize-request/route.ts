import { NextRequest, NextResponse } from 'next/server'

const CATEGORIES = [
  'plumbing',
  'electrical',
  'roofing',
  'painting',
  'hvac',
  'carpentry',
  'flooring',
  'landscaping',
  'cleaning',
  'general-maintenance',
]

const URGENCY_KEYWORDS = {
  urgent: ['emergency', 'asap', 'urgent', 'immediately', 'critical', 'leak', 'flood'],
  high: ['soon', 'quickly', 'schedule', 'needs', 'broken', 'damage'],
  normal: ['repair', 'fix', 'install', 'maintenance', 'service'],
  low: ['inspection', 'estimate', 'consultation', 'future', 'plan'],
}

export async function POST(request: NextRequest) {
  try {
    const { description, title } = await request.json()

    if (!description || !title) {
      return NextResponse.json(
        { error: 'description and title are required' },
        { status: 400 }
      )
    }

    const text = `${title} ${description}`.toLowerCase()

    // Smart category matching
    const categoryScores: Record<string, number> = {}
    CATEGORIES.forEach(cat => {
      categoryScores[cat] = 0
    })

    // Category keywords
    const keywordMap: Record<string, string[]> = {
      plumbing: ['pipe', 'leak', 'water', 'faucet', 'sink', 'toilet', 'drain'],
      electrical: ['wire', 'outlet', 'switch', 'breaker', 'power', 'light', 'electric'],
      roofing: ['roof', 'shingle', 'gutter', 'leak', 'water damage'],
      painting: ['paint', 'wall', 'trim', 'color', 'interior', 'exterior'],
      hvac: ['heating', 'cooling', 'ac', 'furnace', 'thermostat', 'temperature'],
      carpentry: ['wood', 'cabinet', 'door', 'frame', 'install', 'build'],
      flooring: ['floor', 'tile', 'carpet', 'wood floor', 'hardwood'],
      landscaping: ['yard', 'lawn', 'garden', 'tree', 'plant', 'outdoor'],
      cleaning: ['clean', 'dirty', 'mess', 'debris', 'trash'],
      'general-maintenance': ['maintenance', 'repair', 'check', 'inspection', 'service'],
    }

    Object.entries(keywordMap).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          categoryScores[category] += 1
        }
      })
    })

    const suggestedCategory = Object.entries(categoryScores).sort(([, a], [, b]) => b - a)[0][0]

    // Urgency detection
    let urgency = 'normal'
    Object.entries(URGENCY_KEYWORDS).forEach(([level, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        urgency = level
      }
    })

    // Budget estimation (rough based on category)
    const estimatedBudgetRange: Record<string, [number, number]> = {
      plumbing: [300, 1500],
      electrical: [400, 2000],
      roofing: [2000, 10000],
      painting: [500, 3000],
      hvac: [1000, 5000],
      carpentry: [600, 3000],
      flooring: [1500, 5000],
      landscaping: [400, 2000],
      cleaning: [200, 800],
      'general-maintenance': [300, 1500],
    }

    const [minBudget, maxBudget] = estimatedBudgetRange[suggestedCategory] ?? [300, 1500]

    // Extract urgency keywords for display
    const urgencyLevel: Record<string, number> = {
      urgent: 1,
      high: 2,
      normal: 3,
      low: 4,
    }

    return NextResponse.json({
      suggestedCategory,
      categoryScores,
      urgency,
      urgencyLevel: urgencyLevel[urgency],
      estimatedBudgetRange: {
        min: minBudget,
        max: maxBudget,
        mid: Math.round((minBudget + maxBudget) / 2),
      },
      confidence: Math.min(100, (categoryScores[suggestedCategory] || 0) * 25),
    })
  } catch (err) {
    console.error('[POST /api/automation/categorize-request]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
