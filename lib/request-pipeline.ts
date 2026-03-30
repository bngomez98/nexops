export type PipelineMode = 'standard' | 'automated' | 'community'

export interface PipelineSnapshot {
  mode: PipelineMode
  communityVisible: boolean
  stages: string[]
  accessRequirements?: string
}

const PIPELINE_STAGES: Record<PipelineMode, string[]> = {
  standard: [
    'request_submitted',
    'review_incoming',
    'contractor_matching',
    'schedule_confirmation',
    'service_execution',
    'billing_reconciliation',
  ],
  automated: [
    'request_submitted',
    'ai_scope_analysis',
    'contractor_matching',
    'schedule_confirmation',
    'status_tracking',
    'documentation_and_billing',
  ],
  community: [
    'request_submitted',
    'community_visibility',
    'contractor_matching',
    'schedule_confirmation',
    'tracking_and_documents',
    'billing_and_feedback',
  ],
}

export function buildPipelineSnapshot(input: {
  mode: PipelineMode
  communityVisible: boolean
  accessRequirements?: string
}): PipelineSnapshot {
  const accessRequirements = input.accessRequirements?.trim() ?? ''

  return {
    mode: input.mode,
    communityVisible: input.communityVisible,
    stages: PIPELINE_STAGES[input.mode],
    accessRequirements: accessRequirements || undefined,
  }
}

export function serializePipelineSnapshot(snapshot: PipelineSnapshot): string {
  return JSON.stringify(snapshot)
}
