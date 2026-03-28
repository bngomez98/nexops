import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRoleLabel(role: string) {
  switch (role) {
    case 'homeowner': return 'Homeowner'
    case 'property_manager': return 'Property Manager'
    case 'contractor': return 'Contractor'
    default: return role
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-muted text-muted-foreground'
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low': return 'bg-slate-100 text-slate-600'
    case 'normal': return 'bg-blue-50 text-blue-700'
    case 'high': return 'bg-orange-100 text-orange-700'
    case 'urgent': return 'bg-red-100 text-red-700'
    default: return 'bg-muted text-muted-foreground'
  }
}

const METADATA_DELIMITER = '\n\n---\nAutomation Metadata:\n'

export interface RequestMetadata {
  pipeline_stage: string
  focus_areas: string[]
  tracking_id: string
  service_window: string
  billing_notes: string
  community_notes: string
}

export function appendRequestMetadata(description: string | null, metadata: RequestMetadata) {
  const plainDescription = (description ?? '').replace(METADATA_DELIMITER, '').trim()
  const metadataLines = [
    `pipeline_stage=${metadata.pipeline_stage}`,
    `focus_areas=${metadata.focus_areas.join('|')}`,
    `tracking_id=${metadata.tracking_id}`,
    `service_window=${metadata.service_window}`,
    `billing_notes=${metadata.billing_notes}`,
    `community_notes=${metadata.community_notes}`,
  ]

  return `${plainDescription}${METADATA_DELIMITER}${metadataLines.join('\n')}`.trim()
}

export function parseRequestMetadata(description: string | null) {
  if (!description) {
    return {
      plainDescription: '',
      metadata: null,
    }
  }

  const [plainDescription, metadataBlock] = description.split(METADATA_DELIMITER)
  if (!metadataBlock) {
    return {
      plainDescription: plainDescription.trim(),
      metadata: null,
    }
  }

  const parsed = Object.fromEntries(
    metadataBlock
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, ...valueParts] = line.split('=')
        return [key, valueParts.join('=')]
      })
  )

  return {
    plainDescription: plainDescription.trim(),
    metadata: {
      pipeline_stage: parsed.pipeline_stage ?? 'triage',
      focus_areas: parsed.focus_areas ? parsed.focus_areas.split('|').filter(Boolean) : [],
      tracking_id: parsed.tracking_id ?? 'unassigned',
      service_window: parsed.service_window ?? 'standard',
      billing_notes: parsed.billing_notes ?? '',
      community_notes: parsed.community_notes ?? '',
    } satisfies RequestMetadata,
  }
}
