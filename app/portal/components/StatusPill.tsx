import { STATUS_LABEL, type JobStatus } from '../lib/mock-data'

const ICON: Record<JobStatus, string> = {
  pending: '◐',
  assigned: '◔',
  in_progress: '◑',
  complete: '●',
}

export function StatusPill({ status }: { status: JobStatus }) {
  return (
    <span className={`status-pill status-${status}`}>
      <span aria-hidden>{ICON[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  )
}
